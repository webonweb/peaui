import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import CardPanel from '../layout/CardPanel/index.wc';
import GridSection from '../layout/GridSection/index.wc';
import GridItem from '../layout/GridItem/index.wc';
import PageLayout from '../layout/PageLayout/index.wc';
import FullscreenContainer from '../layout/FullscreenContainer/index.wc';
import ScrollArea from '../layout/ScrollArea/index.wc';
import CalculationResults from '../data-display/CalculationResults/index.wc';
import ProgressIndicator from '../feedback/ProgressIndicator/index.wc';
import ToastAlert from '../feedback/ToastAlert/index.wc';

afterEach(() => document.body.replaceChildren());
async function settle(): Promise<void> {
  await nextTick();
  await Promise.resolve();
  await nextTick();
}

describe('regressions: layout and display WC contracts', () => {
  it('keeps Tab in fullscreen and restores the toggle on Escape', async () => {
    const element = new FullscreenContainer();
    element.innerHTML = '<button>Inside</button>';
    document.body.append(element);
    await settle();
    const toggle = element.querySelector<HTMLButtonElement>('.peaui-fullscreen-container__toggle')!;
    toggle.click();
    await settle();
    expect(document.activeElement).toBe(toggle);
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    toggle.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement?.textContent).toBe('Inside');
    document.activeElement?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await settle();
    expect(element.querySelector('.peaui-fullscreen-container--fullscreen')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });
  it('adds native viewport keyboard access', async () => {
    const element = new ScrollArea();
    element.type = 'native';
    document.body.append(element);
    await settle();
    expect(element.querySelector('.peaui-scroll-area__viewport')?.getAttribute('tabindex')).toBe(
      '0',
    );
    element.tabindex = -1;
    await settle();
    expect(element.querySelector('.peaui-scroll-area__viewport')?.getAttribute('tabindex')).toBe(
      '-1',
    );
  });
  it('preserves native keyboard scrolling when custom scroll controls are disabled', async () => {
    const element = new ScrollArea();
    element.type = 'native';
    element.disabled = true;
    document.body.append(element);
    await settle();
    expect(element.querySelector('.peaui-scroll-area__viewport')?.getAttribute('tabindex')).toBe(
      '0',
    );
    element.tabindex = -1;
    await settle();
    expect(element.querySelector('.peaui-scroll-area__viewport')?.getAttribute('tabindex')).toBe(
      '-1',
    );
  });
  it('uses the shared grid defaults and retains opt-in automatic columns', async () => {
    const item = new GridItem();
    item.innerHTML = '<span>One</span>';
    const section = new GridSection();
    document.body.append(item, section);
    await settle();
    expect(item.style.getPropertyValue('--peaui-grid-item-columns')).toBe('2');
    item.columns = 0;
    await settle();
    expect(item.style.getPropertyValue('--peaui-grid-item-columns')).toBe('1');
    expect(
      section
        .querySelector<HTMLElement>('.peaui-grid-section__content')
        ?.style.getPropertyValue('--columns'),
    ).toBe('4');
  });
  it('retains anchor semantics and dynamic named slots', async () => {
    const element = new CardPanel();
    element.setAttribute('as', 'a');
    element.setAttribute('href', '/orders');
    element.textContent = 'Orders';
    document.body.append(element);
    await settle();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/orders');
    const header = document.createElement('span');
    header.slot = 'header';
    header.textContent = 'Added heading';
    element.append(header);
    await settle();
    expect(element.querySelector('.peaui-card-panel__header')?.textContent).toContain(
      'Added heading',
    );
  });
  it('keeps labelled header and semantic footer', async () => {
    const element = new PageLayout();
    element.ariaLabel = 'Account';
    element.innerHTML = '<span slot="top">Toolbar</span><span slot="footer">Footer</span>';
    document.body.append(element);
    await settle();
    expect(element.querySelector('header')?.getAttribute('aria-label')).toBe('Account');
    expect(element.querySelector('footer')?.textContent).toBe('Footer');
  });
  it('keeps calculation, progress and toast semantics aligned', async () => {
    const calculation = new CalculationResults();
    Object.assign(calculation, { label: 'Total', isLoading: true });
    const progress = new ProgressIndicator();
    progress.steps = 4;
    const toast = new ToastAlert();
    Object.assign(toast, { title: 'Saved', description: 'Changes saved', canClose: true });
    document.body.append(calculation, progress, toast);
    await settle();
    expect(calculation.querySelector('button')?.disabled).toBe(true);
    expect(
      progress.getAttribute('aria-valuenow') ??
        progress.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow'),
    ).toBe('0');
    expect(computeAccessibleName(toast.querySelector('[role="status"]')!)).toBe('Saved');
    expect(toast.querySelector('.peaui-toast-alert--shadow')).toBeNull();
  });
});
