import { test } from "@playwright/test";
import { expectCompactLayout } from "../../tests/compact-layout.mts";

const stories = [
  ...["default", "loading", "simple-long-result"].map((variant) => ({
    id: `2-data-display-calculationresults--${variant}`,
    selector: ".peaui-calculation-results",
  })),
  ...[
    "default",
    "groups-and-recent",
    "nested",
    "disabled",
    "controlled",
    "mobile",
  ].map((variant) => ({
    id: `5-navigation-commandpalette-wc--${variant}`,
    selector: ".peaui-command-palette__panel",
  })),
];

for (const { id, selector } of stories) {
  test(`${id} fits a 320px viewport with a larger user font`, async ({
    page,
  }) => {
    await expectCompactLayout(page, id, selector);
  });
}
