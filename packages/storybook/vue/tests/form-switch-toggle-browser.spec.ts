import { waitForFiniteAnimations } from "../../helpers/animations.mts";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { gotoStory, waitForStoryRender } from "./helpers/a11y";

async function gotoFormSwitchStory(page: Page, story: string): Promise<void> {
  await gotoStory(page, `5-form-formswitchtoggle--${story}`);
  await waitForStoryRender(page);
}

test("FormSwitchToggle Vue exposes native keyboard and ARIA semantics", async ({
  page,
}) => {
  await gotoFormSwitchStory(page, "playground");
  const input = page.locator(".peaui-form-switch-toggle__input");

  await expect(input).toHaveAttribute("type", "checkbox");
  await expect(input).toHaveAttribute("role", "switch");
  await expect(input).toHaveAccessibleName(/Powiadomienia o ważnych zmianach/);
  await expect(input).toHaveAttribute("aria-checked", "false");
  await expect(input).toHaveAttribute(
    "aria-describedby",
    /notifications-switch-description/,
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

  await page
    .getByText("Powiadomienia o ważnych zmianach", { exact: true })
    .click();
  await expect(input).not.toBeChecked();

  await waitForFiniteAnimations(page.locator("body"));
  const accessibility = await new AxeBuilder({ page })
    .include(".peaui-form-switch-toggle")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("FormSwitchToggle Vue blocks all protected states and exposes validation", async ({
  page,
}) => {
  await gotoFormSwitchStory(page, "blocking-and-error-states");
  const switchByText = (text: string) =>
    page
      .locator(".peaui-form-switch-toggle")
      .filter({ hasText: text })
      .locator("input");
  const disabled = switchByText("Disabled");
  const readonly = switchByText("Tylko do odczytu");
  const loading = switchByText("Zapisywanie");
  const required = switchByText("Wymagana zgoda");

  await expect(disabled).toBeDisabled();
  await expect(disabled).toBeChecked();
  await expect(loading).toBeDisabled();
  await expect(loading).toHaveAttribute("aria-busy", "true");
  await expect(readonly).not.toBeDisabled();
  await expect(readonly).toHaveAttribute("aria-readonly", "true");
  await page
    .locator(".peaui-form-switch-toggle")
    .filter({ hasText: "Tylko do odczytu" })
    .locator(".peaui-form-switch-toggle__track")
    .click();
  await expect(readonly).toBeChecked();
  await expect(required).toHaveAttribute("aria-invalid", "true");
  await expect(required).toHaveAttribute("aria-required", "true");
  await expect(required).toHaveAccessibleDescription(
    "Włącz zgodę, aby kontynuować.",
  );
});

test("FormSwitchToggle Vue wraps long content without shrinking its mobile target", async ({
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
