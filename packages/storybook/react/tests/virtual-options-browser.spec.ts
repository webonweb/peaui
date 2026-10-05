import { expect, test } from "@playwright/test";

for (const component of ["formselect", "formmultiselect"]) {
  test(
    component + " virtual options preserve visible keyboard navigation",
    async ({ page }) => {
      await page.goto(
        "/iframe.html?id=react-form-" +
          component +
          "--virtualized&viewMode=story",
      );
      const input = page.getByRole("combobox");
      await input.click();
      const options = page.getByRole("option");
      await expect(options.first()).toBeVisible();
      expect(await options.count()).toBeLessThan(20);
      await input.press("End");
      const last = page.locator('[role="option"][aria-posinset="5000"]');
      await expect(last).toBeVisible();
      await expect(input).toHaveAttribute(
        "aria-activedescendant",
        (await last.getAttribute("id")) ?? "",
      );
      const list = page.getByRole("listbox");
      const [rowBox, listBox] = await Promise.all([
        last.boundingBox(),
        list.boundingBox(),
      ]);
      expect(rowBox!.y + rowBox!.height).toBeLessThanOrEqual(
        listBox!.y + listBox!.height + 1,
      );
      await input.fill("Option 4999");
      await expect(options).toHaveCount(1);
      await input.press("Enter");
      await expect(input).toHaveValue("Option 4999");
    },
  );
}

test("TransferList virtualizes both panels and scrolls to the last item", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=react-data-entry-transferlist--virtualized&viewMode=story",
  );
  const source = page.getByRole("listbox").first();
  await expect(source).toBeVisible();
  expect(await page.getByRole("option").count()).toBeLessThan(25);
  await source.focus();
  await source.press("End");
  const last = source.getByRole("option", { name: "Option 4999", exact: true });
  await expect(last).toBeVisible();
  await expect(source).toHaveAttribute(
    "aria-activedescendant",
    (await last.getAttribute("id")) ?? "",
  );
});
