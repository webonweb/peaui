import { test } from "@playwright/test";
import { expectNativeSelectClipped } from "../../tests/native-select-overflow.mts";

const stories = {
  FormSelect: "react-form-formselect--default",
  ListLimitControl: "react-navigation-listlimitcontrol--default",
};
for (const [component, story] of Object.entries(stories)) {
  test(`${component} native select proxy stays clipped on mobile`, async ({
    page,
  }) => {
    await expectNativeSelectClipped(page, story);
  });
}
