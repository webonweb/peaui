import { test } from "@playwright/test";
import { expectNativeSelectClipped } from "../../tests/native-select-overflow.mts";

const stories = {
  FormSelect: "5-form-formselect--form-select",
  ListLimitControl: "7-navigation-listlimitcontrol--list-limit-control",
};
for (const [component, story] of Object.entries(stories)) {
  test(`${component} native select proxy stays clipped on mobile`, async ({
    page,
  }) => {
    await expectNativeSelectClipped(page, story);
  });
}
