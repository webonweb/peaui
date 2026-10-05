// Maintained browser regressions for display components. Build the library first.
// PEAUI_BROWSER=chromium|firefox|webkit; VERIFICATION_REPORT=<JSON path>.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { boot } = require("./browser-display-harness.cjs");

async function main() {
  const engine =
    process.env.PEAUI_BROWSER || process.env.VERIFICATION_ENGINE || "chromium";
  const report = path.resolve(
    process.env.VERIFICATION_REPORT ||
      `test-results/browser-display-${engine}.json`,
  );
  const { page, errors, close } = await boot();
  const results = [];
  const mount = (framework, name, props, slots) =>
    page.evaluate((args) => window.display.mount(args), {
      framework,
      name,
      props,
      slots,
    });
  const update = (props) =>
    page.evaluate((props) => window.display.update(props), props);
  const snapshot = () => page.evaluate(() => window.display.snapshot());
  const action = (name, args) =>
    page.evaluate(({ name, args }) => window.display.action(name, args), {
      name,
      args,
    });
  const events = () => page.evaluate(() => window.display.events());
  const run = async (framework, ids, scenario, test) => {
    try {
      const evidence = await test();
      results.push({ framework, ids, scenario, status: "passed", evidence });
    } catch (error) {
      results.push({
        framework,
        ids,
        scenario,
        status: "failed",
        error: error.stack,
        snapshot: await snapshot(),
      });
    }
    console.log(engine, framework, scenario, results.at(-1).status);
  };
  const records = [
    { id: "a", name: "Alice" },
    { id: "b", name: "Bob" },
  ];
  const columns = [
    { key: "name", label: "Name", manage: { type: "text" } },
    {
      key: "actions",
      label: "Actions",
      resolve: { $fn: '() => [{key:"edit", label:"Edit", simple:true}]' },
    },
  ];
  const editable = {
    records,
    columns,
    editable: true,
    canCreate: false,
    canSelectRows: false,
  };
  const slides = (keys) =>
    keys.map((key) => ({
      tag: "button",
      props: { key, type: "button" },
      text: `Card ${key}`,
    }));
  try {
    for (const framework of ["vue", "react", "wc"]) {
      await run(
        framework,
        ["V-D01"],
        "table-reorder-preserves-draft-and-current-index",
        async () => {
          await mount(framework, "TableList", editable);
          await page
            .locator("tbody tr")
            .first()
            .getByRole("button")
            .first()
            .click();
          await page.getByRole("textbox").fill("Alice edited");
          await update({ records: [records[1], records[0]] });
          assert.equal(
            await page
              .locator("tbody tr")
              .nth(1)
              .getByRole("textbox")
              .inputValue(),
            "Alice edited",
          );
          assert.equal(
            await page.locator("tbody tr").first().getByRole("textbox").count(),
            0,
          );
          await page
            .getByRole("button", {
              name: "Zapisz edytowany rekord",
              exact: true,
            })
            .click();
          const submitted = (await events()).find(
            (event) => event.event === "on:submit",
          );
          assert.deepEqual(submitted.args[0], { id: 1, name: "Alice edited" });
          return { submitted };
        },
      );
      for (const change of ["removed", "duplicate", "page"])
        await run(framework, ["V-D01"], `table-cancels-${change}`, async () => {
          await mount(framework, "TableList", {
            ...editable,
            paginate: true,
            rowsPerPage: 1,
            page: 1,
          });
          await page
            .locator("tbody tr")
            .first()
            .getByRole("button")
            .first()
            .click();
          await page.getByRole("textbox").fill("Draft");
          await update(
            change === "removed"
              ? { records: [records[1]] }
              : change === "duplicate"
                ? { records: [records[0], { ...records[1], id: "a" }] }
                : { page: 2 },
          );
          assert.equal(await page.getByRole("textbox").count(), 0);
          const emitted = await events();
          assert.equal(
            emitted.filter((event) => event.event === "on:cancel").length,
            1,
          );
          assert.equal(
            emitted.filter((event) => event.event === "on:submit").length,
            0,
          );
          return { events: emitted };
        });
      await run(
        framework,
        ["V-D02", "V-D03"],
        "table-default-bulk-selection-and-numeric-ids",
        async () => {
          await mount(framework, "TableList", {
            records: [
              { id: 1, name: "One" },
              { id: 2, name: "Two" },
            ],
            columns: columns.slice(0, 1),
            selectedRows: ["1"],
          });
          const bulk = page.locator("thead input[type=checkbox]");
          assert.equal(await bulk.count(), 1);
          assert.equal(
            await bulk.evaluate((input) => input.indeterminate),
            true,
          );
          await bulk.click();
          const selected = (await events())
            .filter((event) => event.event === "on:select:row")
            .at(-1);
          assert.deepEqual(
            framework === "wc" ? selected.args : selected.args[0],
            ["1", "2"],
          );
          await update({ selectedRows: ["1", "2"] });
          assert.deepEqual(
            await page
              .getByRole("checkbox")
              .evaluateAll((inputs) => inputs.map((input) => input.checked)),
            [true, true, true],
          );
          await bulk.click();
          const cleared = (await events())
            .filter((event) => event.event === "on:select:row")
            .at(-1);
          assert.deepEqual(
            framework === "wc" ? cleared.args : cleared.args[0],
            [],
          );
          return { selected, cleared };
        },
      );
      await run(
        framework,
        ["V-D04"],
        "virtual-list-prepend-and-remove-preserve-anchor",
        async () => {
          const items = Array.from({ length: 100 }, (_, id) => ({
            id,
            label: `Item ${id}`,
          }));
          await mount(framework, "VirtualList", {
            items,
            height: 200,
            itemSize: 40,
            overscan: 1,
          });
          await action("scrollToIndex", [50, "start"]);
          const measure = () =>
            page
              .locator(".peaui-scroll-area__viewport")
              .evaluate((viewport) => ({
                offset: viewport.scrollTop,
                visible: [
                  ...viewport.querySelectorAll(".peaui-virtual-list__item"),
                ]
                  .filter(
                    (item) =>
                      item.getBoundingClientRect().bottom >
                        viewport.getBoundingClientRect().top &&
                      item.getBoundingClientRect().top <
                        viewport.getBoundingClientRect().bottom,
                  )
                  .map((item) => item.textContent),
              }));
          const before = await measure();
          assert.equal(before.offset, 2000);
          await update({ items: [{ id: "new", label: "New" }, ...items] });
          const prepended = await measure();
          assert.equal(prepended.offset, 2040);
          assert.equal(prepended.visible[0], before.visible[0]);
          await update({ items: items.slice(1) });
          const removed = await measure();
          assert.equal(removed.offset, 1960);
          assert.equal(removed.visible[0], before.visible[0]);
          return { before, prepended, removed };
        },
      );
      await run(
        framework,
        ["V-D05"],
        "interactive-avatar-empty-alt-still-named",
        async () => {
          await mount(framework, "Avatar", {
            name: "Alice Smith",
            alt: "",
            interactive: true,
          });
          const button = page.getByRole("button", {
            name: "Alice Smith",
            exact: true,
          });
          assert.equal(await button.count(), 1);
          await button.focus();
          await page.keyboard.press("Enter");
          return await snapshot();
        },
      );
      await run(
        framework,
        ["V-D06"],
        "disclosure-dynamic-named-title-slot",
        async () => {
          await mount(
            framework,
            "DisclosurePanel",
            { open: true },
            { default: "Content" },
          );
          await page.evaluate(() =>
            window.display.slots({ title: "Account details" }),
          );
          assert.equal(
            (await snapshot()).controls.find(
              (control) => control.tag === "summary",
            ).name,
            "Account details",
          );
          await page.evaluate(() => window.display.slots({ title: null }));
          assert.equal(
            (await snapshot()).controls.find(
              (control) => control.tag === "summary",
            ).name,
            "Sekcja rozwijana",
          );
          return await snapshot();
        },
      );
      await run(
        framework,
        ["V-D07"],
        "notification-groups-have-injective-heading-ids",
        async () => {
          await mount(framework, "NotificationCenter", {
            groupBy: "type",
            referenceDate: "2026-10-02",
            items: [
              {
                id: 1,
                title: "Invoice",
                read: false,
                createdAt: "2026-10-02",
                type: "account alerts",
                typeLabel: "Account alerts",
              },
              {
                id: 2,
                title: "Shipment",
                read: false,
                createdAt: "2026-10-02",
                type: "account-alerts",
                typeLabel: "Shipping alerts",
              },
            ],
          });
          const names = (await snapshot()).controls
            .filter((control) => control.role === "group")
            .map((control) => control.name);
          assert.deepEqual(names, ["Account alerts", "Shipping alerts"]);
          return { names };
        },
      );
      await run(
        framework,
        ["V-D08"],
        "avatar-popup-focused-removal-and-escape",
        async () => {
          const items = [
            { id: "a", name: "Alice" },
            { id: "b", name: "Bob" },
            { id: "c", name: "Carol" },
          ];
          await mount(framework, "AvatarGroup", {
            items,
            maxVisible: 1,
            overflowMode: "popover",
          });
          await page.locator(".peaui-avatar-group__overflow-button").click();
          assert.equal(
            await page.evaluate(() =>
              document.activeElement.getAttribute("aria-label"),
            ),
            "Bob",
          );
          await update({ items: [items[0], items[2]] });
          assert.equal(
            await page.evaluate(() =>
              document.activeElement.getAttribute("aria-label"),
            ),
            "Carol",
          );
          await page.keyboard.press("Escape");
          assert.equal(
            await page
              .locator(".peaui-avatar-group__overflow-button")
              .getAttribute("aria-expanded"),
            "false",
          );
          return await snapshot();
        },
      );
      await run(
        framework,
        ["V-D09"],
        "virtual-list-end-event-once-per-count",
        async () => {
          const items = Array.from({ length: 20 }, (_, id) => ({
            id,
            label: `Item ${id}`,
          }));
          await mount(framework, "VirtualList", {
            items,
            height: 200,
            itemSize: 40,
            hasMore: true,
            semanticRole: "listbox",
          });
          await action("scrollToIndex", [19, "end"]);
          await page.getByRole("listbox").focus();
          await page.keyboard.press("End");
          await page.keyboard.press("ArrowUp");
          await page.keyboard.press("ArrowDown");
          await update({ loading: true });
          await action("scrollToOffset", [0]);
          await action("scrollToIndex", [19, "end"]);
          const first = (await events()).filter(
            (event) => event.event === "reachEnd",
          );
          assert.equal(first.length, 1);
          await update({
            loading: false,
            items: [...items, { id: 20, label: "Item 20" }],
          });
          await action("scrollToIndex", [20, "end"]);
          const second = (await events()).filter(
            (event) => event.event === "reachEnd",
          );
          assert.equal(second.length, 2);
          return { first, second };
        },
      );
      await run(
        framework,
        ["V-D10"],
        "tagchip-active-managed-state-and-consumer-override",
        async () => {
          await mount(framework, "TagChip", { label: "Active", active: false });
          await update({ active: true });
          assert.equal(
            await page
              .getByRole("button", { name: "Active", exact: true })
              .getAttribute("aria-pressed"),
            "true",
          );
          if (framework === "wc")
            await page.evaluate(() => {
              const chip = document.querySelector("#root").firstElementChild;
              chip.remove();
              document.querySelector("#root").append(chip);
            });
          await update({ active: false });
          assert.equal(
            await page
              .getByRole("button", { name: "Active", exact: true })
              .getAttribute("aria-pressed"),
            "false",
          );
          await update({ "aria-pressed": "mixed", active: true });
          assert.equal(
            await page
              .getByRole("button", { name: "Active", exact: true })
              .getAttribute("aria-pressed"),
            "mixed",
          );
          return await snapshot();
        },
      );
      await run(
        framework,
        ["V-D11"],
        "carousel-data-update-preserves-surviving-node",
        async () => {
          await mount(
            framework,
            "CardCarousel",
            { defaultVisibleSlides: 1 },
            { default: slides(["A", "B", "C"]) },
          );
          await page.evaluate(() => {
            window.retainedSlide = document.querySelector(
              ".peaui-card-carousel__slide button",
            );
            window.retainedClicks = 0;
            window.retainedSlide.addEventListener(
              "click",
              () => window.retainedClicks++,
            );
          });
          if (framework === "wc")
            await page.evaluate(() => {
              const carousel =
                document.querySelector("#root").firstElementChild;
              window.retainedSlide.focus();
              for (const node of [
                ...carousel.querySelectorAll(
                  ".peaui-card-carousel__slide button",
                ),
              ].slice(1))
                node.remove();
              const added = document.createElement("button");
              added.type = "button";
              added.textContent = "Card X";
              carousel.append(added);
            });
          else
            await page.evaluate(
              (slides) => window.display.slots({ default: slides }),
              slides(["X", "A"]),
            );
          await page.waitForFunction(
            () =>
              document.querySelectorAll(".peaui-card-carousel__slide")
                .length === 2,
          );
          assert.deepEqual(
            await page.locator(".peaui-card-carousel__slide").allTextContents(),
            framework === "wc" ? ["Card A", "Card X"] : ["Card X", "Card A"],
          );
          assert.equal(
            await page.evaluate(
              () =>
                window.retainedSlide ===
                document.querySelectorAll(".peaui-card-carousel__slide button")[
                  [
                    ...document.querySelectorAll(
                      ".peaui-card-carousel__slide button",
                    ),
                  ].findIndex((button) => button.textContent === "Card A")
                ],
            ),
            true,
          );
          if (framework === "wc")
            assert.equal(
              await page.evaluate(
                () => document.activeElement === window.retainedSlide,
              ),
              true,
            );
          await page.evaluate(() => window.retainedSlide.click());
          assert.equal(await page.evaluate(() => window.retainedClicks), 1);
          if (framework === "wc")
            await page.evaluate(() =>
              document
                .querySelectorAll(".peaui-card-carousel__slide button")
                .forEach((button) => button.remove()),
            );
          else await page.evaluate(() => window.display.slots({ default: [] }));
          await page.waitForFunction(
            () =>
              document.querySelectorAll(".peaui-card-carousel__slide")
                .length === 0,
          );
          if (framework === "wc") {
            await page.evaluate(() => {
              const carousel =
                document.querySelector("#root").firstElementChild;
              carousel.remove();
              document.querySelector("#root").append(carousel);
              carousel.append(window.retainedSlide);
            });
            await page.waitForFunction(
              () =>
                document.querySelectorAll(".peaui-card-carousel__slide")
                  .length === 1,
            );
            await page.evaluate(() => window.retainedSlide.click());
            assert.equal(await page.evaluate(() => window.retainedClicks), 2);
          }
          return await snapshot();
        },
      );
    }
  } finally {
    await close();
    fs.mkdirSync(path.dirname(report), { recursive: true });
    const failed = results.filter(
      (result) => result.status === "failed",
    ).length;
    fs.writeFileSync(
      report,
      JSON.stringify(
        {
          date: new Date().toISOString(),
          engine,
          passed: results.length - failed,
          failed,
          errors,
          results,
        },
        null,
        2,
      ) + "\n",
    );
    if (failed || errors.length) process.exitCode = 1;
    console.log(
      `${results.length - failed}/${results.length} passed; ${errors.length} runtime errors; ${report}`,
    );
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
