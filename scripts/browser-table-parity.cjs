// Visual geometry regressions for the TableList family. Build the library first.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { boot } = require("./browser-display-harness.cjs");
const {
  waitForFiniteAnimations,
} = require("../packages/storybook/helpers/animations.mts");

const records = [
  { id: "1", name: "Wniosek Alfa", updatedAt: "2026-08-04", status: true },
  { id: "2", name: "Wniosek Beta", updatedAt: "2026-08-05", status: false },
];
const columns = [
  { key: "name", label: "Nazwa", canSort: true, width: 220 },
  { key: "updatedAt", label: "Data", canSort: true, type: "date", width: 180 },
  { key: "status", label: "Status", type: "status", width: 150 },
];
const actions = {
  key: "actions",
  label: "Akcje",
  resolve: {
    $fn: '() => [{key:"preview",label:"Podglad",icon:"eye"},{key:"copy",label:"Kopiuj",icon:"copy"}]',
  },
};
const header = {
  canSearch: true,
  canFilter: true,
  canCreate: true,
  canExport: true,
  countFilters: 2,
  countSelectedRecords: 1,
  totalRecords: 18,
  searchPlaceholder: "Szukaj rekordu",
};
const footer = { rowsNumber: 38, rowsPerPage: 10, page: 2, total: 4 };
const editableColumns = [
  { key: "name", label: "Nazwa", width: 220, manage: { type: "text" } },
  {
    ...actions,
    resolve: {
      $fn: '() => [{key:"edit",label:"Edytuj",icon:"edit",simple:true}]',
    },
  },
];
const cases = [
  ...[1400, 720, 320].map((width) => ({
    id: `header-controls-${width}`,
    name: "TableListHeader",
    width,
    props: header,
  })),
  {
    id: "header-content-order",
    name: "TableListHeader",
    props: header,
    slots: {
      "additional-content": { tag: "p", text: "Zawartosc dodatkowa" },
      "additional-description": { tag: "p", text: "Opis listy" },
    },
  },
  ...[1400, 320].map((width) => ({
    id: `table-selected-sorted-${width}`,
    name: "TableList",
    width,
    props: { records, columns, selectedRows: ["2"] },
  })),
  {
    id: "table-radio-and-selection",
    name: "TableList",
    props: {
      records,
      columns,
      canSelectRows: true,
      canCheckRows: true,
      currentCheckedRow: "2",
      selectedRows: ["1"],
    },
  },
  {
    id: "table-row-actions",
    name: "TableList",
    props: { records, columns: [...columns, actions] },
  },
  {
    id: "table-row-actions-open",
    name: "TableList",
    props: { records, columns: [...columns, actions] },
    open: ".peaui-table-list__actions-popover-trigger",
  },
  {
    id: "table-column-visibility",
    name: "TableList",
    props: {
      records,
      canHideColumns: true,
      columns: [
        columns[0],
        ...columns.slice(1),
        { key: "owners", label: "Opiekunowie", width: 180 },
        actions,
      ],
    },
    open: ".peaui-table-list__head-actions-popover-trigger",
  },
  {
    id: "table-column-visibility-without-actions",
    name: "TableList",
    props: {
      records,
      canHideColumns: true,
      columns: [
        ...columns,
        { key: "owners", label: "Opiekunowie", width: 180 },
      ],
    },
    open: ".peaui-table-list__head-actions-popover-trigger",
  },
  {
    id: "table-copy-falsy-values",
    name: "TableList",
    props: {
      records: [0, false, "", null].map((value, id) => ({
        id: String(id),
        value,
      })),
      columns: [{ key: "value", label: "Wartosc", canCopy: true }],
    },
  },
  {
    id: "table-column-lock",
    name: "TableList",
    width: 320,
    props: {
      records,
      columns: [{ ...columns[0], withLock: true }, ...columns.slice(1)],
    },
    open: ".peaui-table-list__head-lock-trigger",
  },
  {
    id: "table-all-cell-types",
    name: "TableList",
    props: {
      records: [{ ...records[0], tags: ["Alfa", "Beta"], link: "/example" }],
      columns: [
        { key: "index", label: "Lp.", type: "index", width: 70 },
        {
          key: "name",
          label: "Nazwa",
          width: 220,
          canCopy: true,
          hint: true,
          hintColumn: "Pelna nazwa",
        },
        ...columns.slice(1),
        { key: "tags", label: "Tagi", type: "array", width: 180 },
        { key: "link", label: "Link", type: "link", width: 180 },
        {
          key: "action",
          label: "Akcja",
          type: "action",
          actionLabel: "Otworz",
          width: 130,
        },
        {
          key: "name",
          subKey: "edit",
          label: "Edycja",
          type: "editAction",
          width: 220,
        },
        { key: "empty", label: "Rezerwa", type: "empty", width: 100 },
      ],
    },
  },
  {
    id: "table-edit-row",
    name: "TableList",
    props: {
      records,
      columns: editableColumns,
      editable: true,
      canCreate: false,
    },
    open: ".peaui-table-list__actions-simple-button",
    ready: ".peaui-table-list__editable-cell input",
  },
  {
    id: "table-create-row",
    name: "TableList",
    props: {
      records: [],
      columns: editableColumns,
      editable: true,
      canCreate: true,
      emptyDescription: false,
    },
    open: ".peaui-table-list__create-row-button",
    ready: ".peaui-table-list__editable-cell input",
  },
  {
    id: "table-create-from-empty-state",
    name: "TableList",
    props: {
      records: [],
      columns: editableColumns,
      editable: true,
      canCreate: true,
    },
    open: ".peaui-empty-state button",
    ready: ".peaui-table-list__editable-cell input",
  },
  {
    id: "table-workflow",
    name: "TableList",
    props: {
      records: [records[0]],
      columns: [
        columns[0],
        {
          key: "steps",
          label: "Etapy",
          width: 500,
          type: "stepper",
          steps: {
            $fn: '() => [{key:"done",label:"Gotowe",status:"complete"},{key:"active",label:"Biezace",status:"current",collapse:{activeElements:1,count:3}},{key:"blocked",label:"Nastepne",status:"disabled"}]',
          },
        },
      ],
    },
  },
  {
    id: "table-expanded-details",
    name: "TableList",
    props: {
      records: [records[0]],
      isDetails: true,
      columns: [{ ...columns[0], type: "expandable" }],
    },
    slots: { "details-record": { tag: "p", text: "Szczegoly rekordu" } },
    open: ".peaui-table-list__expandable-button",
  },
  {
    id: "table-loading",
    name: "TableList",
    props: { records, columns, isLoading: true },
  },
  {
    id: "table-empty",
    name: "TableList",
    props: { records: [], columns, canCreate: false },
  },
  {
    id: "table-empty-inline",
    name: "TableList",
    props: {
      records: [],
      columns,
      emptyDescription: false,
      emptyDescriptionInline: "Brak rekordow",
    },
  },
  ...[false, true].map((under) => ({
    id: `footer-${under ? "under" : "inline"}`,
    name: "TableListFooter",
    props: { ...footer, under },
  })),
  {
    id: "footer-flex-mobile",
    name: "TableListFooter",
    width: 320,
    props: { ...footer, isFlex: true },
  },
];

async function runTableVisualParity(page, screenshotDirectory) {
  const results = [];
  for (const scenario of cases) {
    const layouts = {};
    await page.setViewportSize({ width: scenario.width ?? 1000, height: 900 });
    for (const framework of ["vue", "react", "wc"]) {
      await page.evaluate((options) => window.display.mount(options), {
        framework,
        name: scenario.name,
        props: scenario.props,
        slots: scenario.slots,
      });
      if (scenario.open) await page.locator(scenario.open).first().click();
      if (scenario.ready) await page.locator(scenario.ready).first().waitFor();
      if (scenario.id === "table-copy-falsy-values")
        assert.equal(
          await page.locator(".peaui-table-list__copy-button").count(),
          2,
        );
      await waitForFiniteAnimations(page.locator("body"));
      layouts[framework] = await page.locator("#root").evaluate((root) => {
        const selectors = [
          ".peaui-table-list-header",
          ".peaui-table-list-header__controls",
          ".peaui-table-list-header__search-area",
          ".peaui-table-list-header__search",
          ".peaui-table-list-header__actions",
          ".peaui-table-list-header__additional-content",
          ".peaui-table-list-header__description",
          ".peaui-button-action",
          ".peaui-counter-badge",
          ".peaui-table-list",
          ".peaui-table-list__table",
          "th",
          "td",
          ".peaui-table-list__head-button",
          ".peaui-table-list__head-sort-icon",
          ".peaui-table-list__body-cell-content",
          ".peaui-form-field-checkbox__element",
          ".peaui-table-list__date-column",
          ".peaui-tag-chip",
          ".peaui-table-list__actions-trigger",
          ".peaui-table-list__actions-list",
          ".peaui-table-list__head-lock-trigger",
          ".peaui-table-list__head-actions-popover-trigger",
          ".peaui-table-list__head-actions-menu",
          ".peaui-table-list__head-actions-checkbox",
          ".peaui-table-list__copy-button",
          ".peaui-spinner-loader",
          ".peaui-empty-state",
          ".peaui-table-list-footer",
          ".peaui-table-list-footer__summary",
          ".peaui-table-list-footer__pagination",
          ".peaui-table-list-footer__limit",
        ];
        const origin = root.getBoundingClientRect();
        return Object.fromEntries(
          selectors.map((selector) => [
            selector,
            [...root.querySelectorAll(selector)]
              .filter((element) => element.checkVisibility())
              .map((element) => {
                const rect = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                return {
                  x: rect.x - origin.x,
                  y: rect.y - origin.y,
                  width: rect.width,
                  height: rect.height,
                  color: style.color,
                  background: style.backgroundColor,
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                  borderRadius: style.borderRadius,
                };
              }),
          ]),
        );
      });
      if (screenshotDirectory) {
        fs.mkdirSync(screenshotDirectory, { recursive: true });
        await page.screenshot({
          path: path.join(
            screenshotDirectory,
            `${scenario.id}-${framework}.png`,
          ),
          fullPage: true,
        });
      }
    }
    const differences = [];
    for (const framework of ["react", "wc"]) {
      for (const [selector, expected] of Object.entries(layouts.vue)) {
        const actual = layouts[framework][selector];
        if (actual.length !== expected.length) {
          differences.push({
            framework,
            selector,
            expectedCount: expected.length,
            actualCount: actual.length,
          });
          continue;
        }
        expected.forEach((rect, index) => {
          for (const [property, value] of Object.entries(rect)) {
            const received = actual[index][property];
            if (
              typeof value === "number"
                ? Math.abs(value - received) > 1
                : value !== received
            )
              differences.push({
                framework,
                selector,
                index,
                property,
                expected: value,
                actual: received,
              });
          }
        });
      }
    }
    results.push({ scenario: scenario.id, differences });
    console.log(
      "table visual parity",
      scenario.id,
      differences.length ? `FAIL (${differences.length})` : "PASS",
    );
  }
  return results;
}

async function main() {
  const { page, errors, close } = await boot();
  const engine =
    process.env.PEAUI_BROWSER || process.env.VERIFICATION_ENGINE || "chromium";
  const report = path.resolve(
    process.env.VERIFICATION_REPORT ??
      `test-results/browser-table-parity-${engine}.json`,
  );
  const directory =
    process.env.VERIFICATION_SCREENSHOTS ??
    path.join(path.dirname(report), `table-parity-${engine}`);
  try {
    const results = await runTableVisualParity(page, directory);
    fs.mkdirSync(path.dirname(report), { recursive: true });
    fs.writeFileSync(report, JSON.stringify({ results, errors }, null, 2));
    assert.deepEqual(errors, [], "Unexpected browser errors");
    assert.equal(
      results.filter((result) => result.differences.length).length,
      0,
      `See ${report}`,
    );
  } finally {
    await close();
  }
}
if (require.main === module)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
module.exports = { runTableVisualParity };
