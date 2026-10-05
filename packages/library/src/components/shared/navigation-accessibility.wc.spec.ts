import { nextTick } from 'vue';
import { afterEach, expect, it } from 'vitest';
import { computeAccessibleName } from 'dom-accessibility-api';
import Breadcrumbs from '../navigation/Breadcrumbs/index.wc';
import NavigationIconCard from '../navigation/NavigationIconCard/index.wc';
import ModalDialog from '../overlayer/ModalDialog/index.wc';
import PopoverButton from '../overlayer/PopoverButton/index.wc';
import PopoverOverlayer from '../overlayer/PopoverOverlayer/index.wc';

afterEach(() => document.body.replaceChildren());
async function flush() {
  for (let i = 0; i < 6; i++) await nextTick();
}

it('O08: projected native popover trigger owns semantics immediately after connection', async () => {
  const element = new PopoverOverlayer();
  const button = document.createElement('button');
  button.textContent = 'Open details';
  element.append(button);
  document.body.append(element);
  await flush();
  const wrapper = element.querySelector('.peaui-popover-overlayer')!;
  expect(wrapper.hasAttribute('role')).toBe(false);
  expect(wrapper.hasAttribute('tabindex')).toBe(false);
  expect(button.hasAttribute('aria-controls')).toBe(true);
});

it('O09: forwarded native text supplies the popover button accessible name', async () => {
  const element = new PopoverButton();
  element.textContent = 'Open details';
  document.body.append(element);
  await flush();
  expect(computeAccessibleName(element.querySelector('button')!)).toBe('Open details');
});

it('O09: forwarded label content updates from empty to text after connection', async () => {
  const element = new PopoverButton();
  const label = document.createElement('span');
  element.append(label);
  document.body.append(element);
  await flush();
  label.textContent = 'Open details';
  await flush();
  expect(computeAccessibleName(element.querySelector('button')!)).toBe('Open details');
});

it('O11: pointer positioning updates do not detach the native trigger label', async () => {
  const element = new PopoverButton();
  element.textContent = 'Open details';
  document.body.append(element);
  await flush();
  const button = element.querySelector('button')!;
  const label = Array.from(button.childNodes).find((node) => node.textContent === 'Open details')!;
  const removed: Node[] = [];
  const observer = new MutationObserver((records) => {
    removed.push(...records.flatMap((record) => Array.from(record.removedNodes)));
  });
  observer.observe(button, { childList: true });
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  await flush();
  observer.disconnect();
  expect(removed.includes(label)).toBe(false);
});

it('O10: navigation roots retain native nav and link semantics', async () => {
  const breadcrumbs = new Breadcrumbs();
  breadcrumbs.items = [{ key: 'home', label: 'Home', path: '/' }];
  const card = new NavigationIconCard();
  Object.assign(card, { text: 'Home', path: '/', icon: 'home' });
  document.body.append(breadcrumbs, card);
  await flush();
  expect(breadcrumbs.querySelector('nav')!.hasAttribute('role')).toBe(false);
  expect(card.querySelector('a')!.hasAttribute('role')).toBe(false);
});

it('O10: a card without a path remains a named disabled link', async () => {
  const card = new NavigationIconCard();
  Object.assign(card, { text: '', path: '', icon: 'home', ariaLabel: 'Unavailable' });
  document.body.append(card);
  await flush();
  const link = card.querySelector('a')!;
  expect(link.getAttribute('role')).toBe('link');
  expect(link.hasAttribute('href')).toBe(false);
  expect(link.getAttribute('aria-disabled')).toBe('true');
  expect(link.tabIndex).toBe(-1);
  expect(computeAccessibleName(link)).toBe('Unavailable');
});

it('O11: renaming a projected slot preserves its node, content and listeners', async () => {
  const element = new ModalDialog();
  element.open = false;
  const heading = document.createElement('button');
  heading.slot = 'header';
  heading.textContent = 'Dialog heading';
  let clicks = 0;
  heading.addEventListener('click', () => clicks++);
  element.append(heading);
  document.body.append(element);
  await flush();
  expect(element.querySelector('header')!.contains(heading)).toBe(true);
  heading.slot = 'default';
  await flush();
  expect(element.querySelector('header')).toBeNull();
  expect(element.querySelector('.peaui-modal-dialog__inner')!.contains(heading)).toBe(true);
  heading.click();
  expect(clicks).toBe(1);
  heading.slot = 'header';
  await flush();
  expect(element.querySelector('header')!.contains(heading)).toBe(true);
});
