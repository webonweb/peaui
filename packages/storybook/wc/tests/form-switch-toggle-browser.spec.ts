import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function gotoFormSwitchStory(page: Page, story: string): Promise<void> {
  await page.goto(
    `/iframe.html?id=5-form-formswitchtoggle-wc--${story}&viewMode=story`,
  );
}

test("FormSwitchToggle Web Component exposes native keyboard and ARIA semantics", async ({
  page,
}) => {
  await gotoFormSwitchStory(page, "default");
  const input = page.locator(".peaui-form-switch-toggle__input");

  await expect(input).toHaveAttribute("type", "checkbox");
  await expect(input).toHaveAttribute("role", "switch");
  await expect(input).toHaveAccessibleName(/Powiadomienia o ważnych zmianach/);
  await expect(input).toHaveAttribute("aria-checked", "false");
  await expect(input).toHaveAttribute(
    "aria-describedby",
    /notifications-switch-control-description/,
  );
  await input.focus();
  await page.keyboard.press("Space");
  await expect(input).toBeChecked();
  await expect(input).toHaveAttribute("aria-checked", "true");

  const track = page.locator(".peaui-form-switch-toggle__track");
  await expect
    .poll(() =>
      track.evaluate((element) => {
        const probe = document.createElement("span");
        probe.style.color = "var(--peaui-color-primary-600)";
        document.body.append(probe);
        const trackStyle = getComputedStyle(element);
        const solidPrimary = getComputedStyle(probe).color;
        const matches = {
          lighterBackground: trackStyle.backgroundColor !== solidPrimary,
          primaryBorder: trackStyle.borderColor === solidPrimary,
        };
        probe.remove();
        return matches;
      }),
    )
    .toEqual({ lighterBackground: true, primaryBorder: true });

  const outlineWidth = await track.evaluate(
    (element) => getComputedStyle(element).outlineWidth,
  );
  expect(outlineWidth).not.toBe("0px");

  await page.locator(".peaui-form-switch-toggle__track").click();
  await expect(input).not.toBeChecked();

  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-switch-toggle")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormSwitchToggle Web Component blocks all protected states and exposes validation", async ({
  page,
}) => {
  await gotoFormSwitchStory(page, "readonly");
  const readonly = page.locator(".peaui-form-switch-toggle__input");
  await expect(readonly).toHaveAccessibleName(
    /Powiadomienia o ważnych zmianach/,
  );
  await expect(readonly).toBeChecked();
  await expect(readonly).not.toBeDisabled();
  await expect(readonly).toHaveAttribute("aria-readonly", "true");
  await page.locator(".peaui-form-switch-toggle__track").click();
  await expect(readonly).toBeChecked();

  await gotoFormSwitchStory(page, "disabled");
  const disabled = page.locator(".peaui-form-switch-toggle__input");
  await expect(disabled).toBeDisabled();
  await expect(disabled).toBeChecked();

  await gotoFormSwitchStory(page, "loading");
  const loading = page.locator(".peaui-form-switch-toggle__input");
  await expect(loading).toBeDisabled();
  await expect(loading).toHaveAttribute("aria-busy", "true");

  await gotoFormSwitchStory(page, "error");
  const required = page.locator(".peaui-form-switch-toggle__input");
  await expect(required).toHaveAttribute("aria-invalid", "true");
  await expect(required).toHaveAttribute("aria-required", "true");
  await expect(required).toHaveAccessibleDescription(
    /Włącz zgodę, aby kontynuować/,
  );
});

test("FormSwitchToggle Web Component wraps long content without shrinking its mobile target", async ({
  page,
}) => {
  await page.setViewportSize({ height: 720, width: 320 });
  await gotoFormSwitchStory(page, "responsive-long-content");
  const metrics = await page
    .locator(".peaui-form-switch-toggle")
    .evaluate((root) => {
      const interaction = root.querySelector(
        ".peaui-form-switch-toggle__interaction",
      )!;
      const control = root.querySelector(".peaui-form-switch-toggle__control")!;
      const track = root.querySelector(".peaui-form-switch-toggle__track")!;
      const label = root.querySelector(".peaui-form-switch-toggle__label")!;
      return {
        controlHeight: control.getBoundingClientRect().height,
        interactionHeight: interaction.getBoundingClientRect().height,
        labelHeight: label.getBoundingClientRect().height,
        rootRight: root.getBoundingClientRect().right,
        trackHeight: track.getBoundingClientRect().height,
        trackWidth: track.getBoundingClientRect().width,
      };
    });

  expect(metrics.interactionHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.controlHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.labelHeight).toBeGreaterThan(21);
  expect(metrics.trackWidth).toBe(40);
  expect(metrics.trackHeight).toBe(22);
  expect(metrics.rootRight).toBeLessThanOrEqual(320);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
