// Maintained production-entry regression checks. Run after the library build.
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const assert = require("node:assert/strict");
const esbuild = require("esbuild");
const playwright = require("playwright");
const root = path.resolve(__dirname, "..");
const engine =
  process.env.PEAUI_BROWSER || "chromium";
const reportDirectory = path.resolve(
  process.env.PEAUI_REPORT_DIR || "test-results/interactions",
);
const catalog = Object.fromEntries(
  Object.entries({
    navigation: [
      "NavigationCard",
      "NavigationDisclosureCard",
      "NavigationIconCard",
      "NavigationLink",
      "NavigationStepper",
      "PaginationControl",
    ],
    overlayer: ["GuidedTour", "PopoverButton", "PopoverOverlayer"],
    layout: ["CardPanel"],
  }).flatMap(([category, names]) =>
    names.map((name) => [name, category + "/" + name]),
  ),
);
const fixture = `${Object.entries(catalog)
  .flatMap(([name, entry]) =>
    ["vue", "react", "wc"].map(
      (framework) =>
        `import ${framework}${name} from '@peaui/ui/${framework}/${entry}';`,
    ),
  )
  .join("\n")}
import '@peaui/ui/styles.css';
import {createApp,h,nextTick,shallowRef} from 'vue';
import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
const components={${["vue", "react", "wc"]
  .map(
    (f) =>
      f +
      ":{" +
      Object.keys(catalog)
        .map((n) => n + ":" + f + n)
        .join(",") +
      "}",
  )
  .join(",")}};
let cleanup=()=>{},patch=()=>{},events=[];
function vnode(x,create){if(Array.isArray(x))return x.map(v=>vnode(v,create));if(!x||typeof x!=='object')return x;const attrs={...x.attrs};if(create===createElement&&attrs.popovertarget){attrs.popoverTarget=attrs.popovertarget;delete attrs.popovertarget;}return create(x.tag,attrs,...(x.children||[]).map(v=>vnode(v,create)));}
function dom(x){if(Array.isArray(x)){const f=document.createDocumentFragment();x.forEach(v=>f.append(dom(v)));return f;}if(x&&typeof x==='object'){const e=document.createElement(x.tag);Object.entries(x.attrs||{}).forEach(([k,v])=>e.setAttribute(k,v));(x.children||[]).forEach(v=>e.append(dom(v)));return e;}return document.createTextNode(String(x));}
const settle=async()=>{await nextTick();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));};
window.componentTest={async mount({framework,name,props={},slots={}}){cleanup();await settle();document.body.replaceChildren();events=[];document.documentElement.dir='ltr';const before=document.createElement('button'),host=document.createElement('main'),after=document.createElement('button');before.id='before';before.textContent='Before';host.id='root';after.id='after';after.textContent='After';document.body.append(before,host,after);before.focus();const models=['open','page','step'];const event=(n,v)=>events.push({name:n,value:v});
if(framework==='vue'){const state=shallowRef(props);const app=createApp({render:()=>h(components.vue[name],{...state.value,...Object.fromEntries(models.map(n=>['onUpdate:'+n,v=>{event(n,v);state.value={...state.value,[n]:v};}]))},Object.fromEntries(Object.entries(slots).map(([n,v])=>[n,()=>vnode(v,h)])))});app.mount(host);patch=p=>state.value={...state.value,...p};cleanup=()=>app.unmount();}
else if(framework==='react'){let state=props;const app=createRoot(host);const render=()=>flushSync(()=>app.render(createElement(components.react[name],{...state,...Object.fromEntries(models.map(n=>['on'+n[0].toUpperCase()+n.slice(1)+'Change',v=>{event(n,v);state={...state,[n]:v};render();}])),...Object.fromEntries(Object.entries(slots).map(([n,v])=>[n==='default'||(name==='GuidedTour'&&n==='content')?'children':n,vnode(v,createElement)]))})));render();patch=p=>{state={...state,...p};render();};cleanup=()=>flushSync(()=>app.unmount());}
else{const el=new components.wc[name]();const assign=p=>Object.entries(p).forEach(([k,v])=>{if(['target','rel','download','href'].includes(k))el.setAttribute(k,String(v));else Reflect.set(el,k,v);});assign(props);Object.entries(slots).forEach(([n,v])=>{let child=dom(v);if(n!=='default'){const wrapper=document.createElement('span');wrapper.slot=n;wrapper.append(child);child=wrapper;}el.append(child);});models.forEach(n=>el.addEventListener('update:'+n,e=>{event(n,e.detail);Reflect.set(el,n,e.detail);}));host.append(el);patch=assign;cleanup=()=>el.remove();}await settle();},async patch(p){patch(p);await settle();},async clear(){cleanup();await settle();},events:()=>events};`;
const button = (text, attrs = {}) => ({
  tag: "button",
  attrs: { type: "button", ...attrs },
  children: [text],
});
const options = Array.from({ length: 8 }, (_, i) => ({
  key: "step" + i,
  label: "Long step title " + i,
  status: "complete",
}));
const results = [],
  errors = [];
async function main() {
  fs.mkdirSync(reportDirectory, { recursive: true });
  const temp = fs.mkdtempSync(
    path.join(os.tmpdir(), "peaui-verified-interactions-"),
  );
  await esbuild.build({
    stdin: { contents: fixture, resolveDir: root },
    bundle: true,
    outdir: temp,
    format: "esm",
    platform: "browser",
    define: {
      "process.env.NODE_ENV": '"production"',
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    },
    logLevel: "silent",
  });
  fs.writeFileSync(
    path.join(temp, "index.html"),
    '<!doctype html><html lang="en"><meta charset="utf-8"><title>PeaUI interaction regressions</title><link rel="stylesheet" href="/stdin.css"><script type="module" src="/stdin.js"></script></html>',
  );
  const server = http.createServer((request, response) => {
    const file = path.resolve(
      temp,
      "." + (request.url === "/" ? "/index.html" : request.url),
    );
    if (!file.startsWith(temp + path.sep) || !fs.existsSync(file)) {
      response.writeHead(404).end();
      return;
    }
    response.setHeader(
      "Content-Type",
      file.endsWith(".js")
        ? "text/javascript"
        : file.endsWith(".css")
          ? "text/css"
          : "text/html",
    );
    response.end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await playwright[engine].launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  page.setDefaultTimeout(3500);
  page.on("pageerror", (error) => errors.push(String(error)));
  const mount = (framework, name, props = {}, slots = {}) =>
    page.evaluate((args) => window.componentTest.mount(args), {
      framework,
      name,
      props,
      slots,
    });
  const save = () =>
    fs.writeFileSync(
      path.join(reportDirectory, `results-${engine}.json`),
      JSON.stringify(
        { engine, productionEntries: true, results, errors },
        null,
        2,
      ),
    );
  async function check(id, framework, component, scenario, run) {
    if (
      process.env.PEAUI_CASE &&
      !process.env.PEAUI_CASE.split(",").includes(id)
    )
      return;
    try {
      results.push({
        id,
        framework,
        component,
        scenario,
        pass: true,
        evidence: await run(),
      });
    } catch (error) {
      results.push({
        id,
        framework,
        component,
        scenario,
        pass: false,
        error: error.stack,
        html: await page.locator("body").innerHTML(),
      });
    }
    console.log(
      id,
      framework,
      component,
      scenario,
      results.at(-1).pass ? "PASS" : "FAIL",
    );
    save();
  }
  await page.goto("http://127.0.0.1:" + server.address().port);
  await page.waitForFunction(() => window.componentTest);
  try {
    for (const framework of ["vue", "react", "wc"]) {
      for (const component of ["PopoverButton", "PopoverOverlayer"])
        await check(
          "V-I01",
          framework,
          component,
          "Tab and ShiftTab between two controls",
          async () => {
            await mount(
              framework,
              component,
              { ariaLabel: "Open panel" },
              {
                default: "Open panel",
                content: [button("First"), button("Second")],
              },
            );
            const trigger = page.getByRole("button", {
              name: "Open panel",
              exact: true,
            });
            await trigger.click();
            // Native toggle events are queued by the browser; keyboard checks start once
            // the component has observed the completed opening transition.
            await page.waitForFunction(() =>
              document.querySelector('#root [aria-expanded="true"]'),
            );
            await page
              .getByRole("button", { name: "First", exact: true })
              .focus();
            await page.keyboard.press("Tab");
            assert.equal(
              await page.evaluate(() => document.activeElement?.textContent),
              "Second",
            );
            await page.keyboard.press("Shift+Tab");
            assert.equal(
              await page.evaluate(() => document.activeElement?.textContent),
              "First",
            );
            assert.equal(await trigger.getAttribute("aria-expanded"), "true");
            await page.keyboard.press("Escape");
            await page.waitForFunction(
              () => !document.querySelector(":popover-open"),
            );
            return { tab: "Second", shiftTab: "First", escapeCloses: true };
          },
        );
      await check(
        "V-I02",
        framework,
        "NavigationStepper",
        "RTL next and previous boundaries",
        async () => {
          await page.setViewportSize({ width: 390, height: 800 });
          await mount(framework, "NavigationStepper", { options });
          await page.evaluate(() => {
            document.documentElement.dir = "rtl";
            window.dispatchEvent(new Event("resize"));
          });
          const viewport = page.locator(".peaui-navigation-stepper__viewport");
          const next = page.locator(".peaui-navigation-stepper__control--next");
          const previous = page.locator(
            ".peaui-navigation-stepper__control--prev",
          );
          const before = await viewport.evaluate(
            (element) => element.scrollLeft,
          );
          const settled = () =>
            viewport.evaluate(async (element) => {
              await new Promise((resolve, reject) => {
                let previousPosition = element.scrollLeft;
                let stableFrames = 0;
                const deadline = performance.now() + 3000;
                const tick = () => {
                  if (element.scrollLeft === previousPosition) stableFrames++;
                  else stableFrames = 0;
                  previousPosition = element.scrollLeft;
                  if (stableFrames >= 6) resolve();
                  else if (performance.now() > deadline)
                    reject(new Error("Scroll did not settle"));
                  else requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
              });
            });
          await next.click();
          await page.waitForFunction(
            () =>
              document.querySelector(".peaui-navigation-stepper__viewport")
                .scrollLeft < -10,
          );
          await settled();
          for (
            let count = 0;
            count < 12 && !(await next.isDisabled());
            count++
          ) {
            // Repeated keyboard activation also exercises the disabled boundary:
            // Enter on a button that just became disabled is naturally ignored.
            await next.press("Enter");
            await settled();
          }
          assert.equal(await next.isDisabled(), true);
          assert.equal(await previous.isDisabled(), false);
          const end = await viewport.evaluate((element) => ({
            scrollLeft: element.scrollLeft,
            maximum: element.scrollWidth - element.clientWidth,
          }));
          assert.ok(Math.abs(end.scrollLeft + end.maximum) <= 2);
          for (
            let count = 0;
            count < 12 && !(await previous.isDisabled());
            count++
          ) {
            await previous.press("Enter");
            await settled();
          }
          assert.equal(await previous.isDisabled(), true);
          assert.equal(await next.isDisabled(), false);
          return {
            before,
            end,
            returnedToStart: true,
            activation: "pointer then keyboard Enter",
          };
        },
      );
      await check(
        "V-I03",
        framework,
        "NavigationStepper",
        "Parent resize without window event",
        async () => {
          await page.setViewportSize({ width: 2000, height: 900 });
          await mount(framework, "NavigationStepper", {
            options: options.slice(0, 3),
          });
          const next = page.locator(".peaui-navigation-stepper__control--next");
          assert.equal(await next.isDisabled(), true);
          await page.locator("#root").evaluate((element) => {
            element.style.width = "250px";
          });
          await page.waitForFunction(
            () =>
              !document.querySelector(
                ".peaui-navigation-stepper__control--next",
              ).disabled,
          );
          await page.locator("#root").evaluate((element) => {
            element.style.width = "1800px";
          });
          await page.waitForFunction(
            () =>
              document.querySelector(".peaui-navigation-stepper__control--next")
                .disabled,
          );
          return { narrowEnablesNext: true, wideDisablesNext: true };
        },
      );
      await page.setViewportSize({ width: 1280, height: 900 });
      for (const component of [
        "NavigationLink",
        "NavigationCard",
        "NavigationIconCard",
        "CardPanel",
      ])
        await check(
          "V-I04",
          framework,
          component,
          "Native anchor attributes",
          async () => {
            await mount(
              framework,
              component,
              {
                path: "#report",
                title: "Report",
                description: "Report file",
                icon: "home",
                text: "Report",
                ...(component === "CardPanel"
                  ? { as: "a", href: "#report" }
                  : {}),
                target: "_blank",
                rel: "noopener",
                download: "report.txt",
              },
              { default: "Report" },
            );
            const attrs = await page
              .locator("#root a")
              .evaluate((element) =>
                Object.fromEntries(
                  ["target", "rel", "download"].map((name) => [
                    name,
                    element.getAttribute(name),
                  ]),
                ),
              );
            assert.deepEqual(attrs, {
              target: "_blank",
              rel: "noopener",
              download: "report.txt",
            });
            return attrs;
          },
        );
      for (const kind of ["popover", "dialog", "consumed"])
        await check(
          "V-I05",
          framework,
          "GuidedTour",
          "Nested Escape " + kind,
          async () => {
            const content =
              kind === "popover"
                ? [
                    button("Open nested popup", {
                      popovertarget: "nested-popup",
                    }),
                    {
                      tag: "div",
                      attrs: { id: "nested-popup", popover: "auto" },
                      children: [button("Nested action")],
                    },
                  ]
                : kind === "dialog"
                  ? [
                      {
                        tag: "dialog",
                        attrs: { id: "nested-dialog" },
                        children: [button("Nested action")],
                      },
                    ]
                  : [button("Nested action")];
            await mount(
              framework,
              "GuidedTour",
              {
                open: true,
                mode: "modal",
                steps: [{ id: "one", title: "Step" }],
              },
              { content },
            );
            if (kind === "popover")
              await page
                .getByRole("button", { name: "Open nested popup", exact: true })
                .click();
            if (kind === "dialog")
              await page
                .locator("#nested-dialog")
                .evaluate((element) => element.showModal());
            if (kind === "consumed")
              await page
                .getByRole("button", { name: "Nested action", exact: true })
                .evaluate((element) =>
                  element.addEventListener(
                    "keydown",
                    (event) => event.preventDefault(),
                    { once: true },
                  ),
                );
            await page
              .getByRole("button", { name: "Nested action", exact: true })
              .focus();
            await page.keyboard.press("Escape");
            await page.waitForTimeout(75);
            assert.equal(
              await page.locator(".peaui-guided-tour__card").isVisible(),
              true,
            );
            if (kind === "popover")
              assert.equal(await page.locator(":popover-open").count(), 0);
            if (kind === "dialog")
              assert.equal(
                await page
                  .locator("#nested-dialog")
                  .evaluate((element) => element.open),
                false,
              );
            assert.equal(
              (await page.evaluate(() => window.componentTest.events())).some(
                (event) => event.name === "open" && event.value === false,
              ),
              false,
            );
            await page.locator(".peaui-guided-tour__card").focus();
            await page.keyboard.press("Escape");
            await page.waitForFunction(
              () => !document.querySelector(".peaui-guided-tour__card"),
            );
            return {
              firstEscapePreservesTour: true,
              secondEscapeClosesTour: true,
            };
          },
        );
      await check(
        "V-I05",
        framework,
        "GuidedTour",
        "Tour Tab boundaries with an open nonmodal popover",
        async () => {
          await mount(
            framework,
            "GuidedTour",
            {
              open: true,
              mode: "modal",
              steps: [{ id: "one", title: "Step" }],
            },
            {
              content: [
                button("Open nested popup", { popovertarget: "nested-popup" }),
                {
                  tag: "div",
                  attrs: { id: "nested-popup", popover: "auto" },
                  children: [button("Nested action")],
                },
              ],
            },
          );
          await page
            .getByRole("button", { name: "Open nested popup", exact: true })
            .click();
          const buttons = page
            .locator(".peaui-guided-tour__card")
            .getByRole("button");
          await buttons.last().focus();
          assert.equal(await page.locator(":popover-open").count(), 1);
          await page.keyboard.press("Tab");
          assert.equal(
            await buttons
              .first()
              .evaluate((element) => element === document.activeElement),
            true,
          );
          await page.keyboard.press("Shift+Tab");
          assert.equal(
            await buttons
              .last()
              .evaluate((element) => element === document.activeElement),
            true,
          );
          return { wrapsForward: true, wrapsBackward: true };
        },
      );
      await check(
        "V-I06",
        framework,
        "NavigationDisclosureCard",
        "Explicit name on the link",
        async () => {
          await mount(framework, "NavigationDisclosureCard", {
            id: "named-card",
            title: "",
            description: "",
            path: "#target",
            ariaLabel: "Named destination",
          });
          assert.equal(
            await page
              .getByRole("link", { name: "Named destination", exact: true })
              .count(),
            1,
          );
          return { accessibleLinkName: "Named destination" };
        },
      );
      await check(
        "V-I08",
        framework,
        "NavigationCard",
        "Shared default title size",
        async () => {
          await mount(framework, "NavigationCard", {
            title: "Account",
            description: "Account details",
            path: "#account",
          });
          const title = await page.locator("h4").evaluate((element) => ({
            classes: element.className,
            fontSize: getComputedStyle(element).fontSize,
          }));
          assert.ok(title.classes.includes("__title--size-s"));
          return title;
        },
      );
      await check(
        "V-I09",
        framework,
        "PaginationControl",
        "78 unique bounded page ranges",
        async () => {
          await mount(framework, "PaginationControl", {
            totalPages: 6,
            page: 2,
          });
          let combinations = 0;
          for (let totalPages = 1; totalPages <= 12; totalPages++)
            for (let current = 1; current <= totalPages; current++) {
              await page.evaluate((props) => window.componentTest.patch(props), {
                totalPages,
                page: current,
              });
              const pages = (
                await page
                  .locator(".peaui-pagination-control__button--page")
                  .allTextContents()
              ).map(Number);
              assert.equal(
                new Set(pages).size,
                pages.length,
                JSON.stringify({ totalPages, current, pages }),
              );
              assert.ok(pages.includes(current));
              assert.ok(
                pages.every((value) => value >= 1 && value <= totalPages),
              );
              combinations++;
            }
          return { combinations };
        },
      );
    }
    await check(
      "V-I07",
      "wc",
      "CardPanel",
      "Slot rename, removal, reappend and reconnect preserve identity",
      async () => {
        await mount(
          "wc",
          "CardPanel",
          {},
          { header: button("Heading"), default: "Body" },
        );
        await page.locator("[slot=header]").evaluate((element) => {
          window.projectedNode = element;
          window.projectedClicks = 0;
          element.addEventListener("click", () => window.projectedClicks++);
          element.removeAttribute("slot");
        });
        await page.waitForFunction(
          () => !document.querySelector(".peaui-card-panel__header"),
        );
        assert.equal(
          await page.evaluate(() =>
            document
              .querySelector(".peaui-card-panel__content")
              .contains(window.projectedNode),
          ),
          true,
        );
        await page
          .getByRole("button", { name: "Heading", exact: true })
          .click();
        await page.evaluate(() => {
          window.projectedNode.slot = "header";
        });
        await page.waitForFunction(() =>
          document
            .querySelector(".peaui-card-panel__header")
            ?.contains(window.projectedNode),
        );
        await page.evaluate(() => window.projectedNode.remove());
        await page.waitForFunction(
          () => !document.querySelector(".peaui-card-panel__header"),
        );
        await page.evaluate(() =>
          document
            .querySelector("peaui-card-panel")
            .append(window.projectedNode),
        );
        await page.waitForFunction(() =>
          document
            .querySelector(".peaui-card-panel__header")
            ?.contains(window.projectedNode),
        );
        await page.locator("peaui-card-panel").evaluate(async (element) => {
          const parent = element.parentElement;
          element.remove();
          await new Promise((resolve) => setTimeout(resolve, 10));
          parent.append(element);
        });
        assert.equal(
          await page.evaluate(() =>
            document
              .querySelector(".peaui-card-panel__header")
              .contains(window.projectedNode),
          ),
          true,
        );
        await page
          .getByRole("button", { name: "Heading", exact: true })
          .click();
        assert.equal(await page.evaluate(() => window.projectedClicks), 2);
        await page.evaluate(() => {
          delete window.projectedNode;
          delete window.projectedClicks;
        });
        return { sameNode: true, clicks: 2, reconnect: true };
      },
    );
  } finally {
    save();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
  const failed = results.filter((result) => !result.pass);
  console.log(
    JSON.stringify({
      engine,
      passed: results.length - failed.length,
      failed: failed.map(({ id, framework, scenario, error }) => ({
        id,
        framework,
        scenario,
        error,
      })),
      errors,
    }),
  );
  if (failed.length || errors.length) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
