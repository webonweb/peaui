import { test } from "@playwright/test";
import { expectInverseSurfaceContrast } from "../../tests/inverse-surface-contrast.mts";

const examples = [
  [
    "SectionHeading",
    "react-data-display-sectionheading--secondary-variant",
    ".peaui-section-heading__title, .peaui-section-heading__description",
  ],
  [
    "MessageText",
    "react-feedback-messagetext--white-variant",
    ".peaui-message-text__content",
  ],
] as const;

for (const [component, story, selector] of examples) {
  for (const theme of ["light", "dark"] as const) {
    test(`${component} inverse surface has AA text contrast in ${theme}`, async ({
      page,
    }, testInfo) => {
      const result = await expectInverseSurfaceContrast(
        page,
        story,
        selector,
        theme,
      );
      await testInfo.attach("contrast", {
        body: JSON.stringify(result),
        contentType: "application/json",
      });
    });
  }
}
