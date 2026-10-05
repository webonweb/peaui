import { test } from "@playwright/test";
import { expectNativeSelectClipped } from "../../tests/native-select-overflow.mts";

const stories = {
  FormSelect: "5-form-formselect--default",
  ListLimitControl: "7-navigation-listlimitcontrol--default",
};
for (const [component, story] of Object.entries(stories)) {
  test(`${component} native select proxy stays clipped on mobile`, async ({
    page,
  }) => {
    await expectNativeSelectClipped(page, story);
  });
}
