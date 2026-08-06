import { afterEach, describe, expect, it, vi } from 'vitest';

import { TagChipElement, defineTagChip } from './index.wc';

defineTagChip();

type MountOptions = {
  active?: boolean;
  ariaPressed?: string;
  as?: 'button' | 'span';
  dataTestId?: string;
  disabled?: boolean;
  label?: string;
  size?: 'xxs' | 'xs' | 's';
  variant?: 'blue' | 'green' | 'red' | 'orange' | 'grey' | 'violet' | 'outline';
};

function mountTagChip(options: MountOptions = {}): TagChipElement {
  const element = document.createElement(TagChipElement.tagName) as TagChipElement;

  if (options.label !== undefined) {
    element.label = options.label;
  }

  if (options.size !== undefined) {
    element.size = options.size;
  }

  if (options.variant !== undefined) {
    element.variant = options.variant;
  }

  if (options.active !== undefined) {
    element.active = options.active;
  }

  if (options.as !== undefined) {
    element.as = options.as;
  }

  if (options.dataTestId !== undefined) {
    element.dataTestId = options.dataTestId;
  }

  if (options.ariaPressed !== undefined) {
    element.setAttribute('aria-pressed', options.ariaPressed);
  }

  if (options.disabled !== undefined) {
    element.disabled = options.disabled;
  }

  document.body.appendChild(element);

  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('TagChip (index.wc.ts)', () => {
  it('renders label without button semantics when no interactive handler is attached', () => {
    const element = mountTagChip({
      label: 'Hello',
    });

    expect(element.tagName.toLowerCase()).toBe('peaui-tag-chip');
    expect(element.textContent).toBe('Hello');
    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('tabindex')).toBeNull();
  });

  it('does not expose aria-pressed for non-interactive button usage by default', () => {
    const element = mountTagChip({
      label: 'Hello',
      active: true,
    });

    expect(element.getAttribute('aria-pressed')).toBeNull();
  });

  it("renders span semantics when as='span' is provided", () => {
    const element = mountTagChip({
      label: 'Hello',
      as: 'span',
    });

    expect(element.textContent).toBe('Hello');
    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('tabindex')).toBeNull();
    expect(element.getAttribute('aria-pressed')).toBeNull();
  });

  it('adds button semantics only after an interactive handler is registered', () => {
    const element = mountTagChip({
      label: 'Hello',
    });

    element.addEventListener('click', () => undefined);

    expect(element.getAttribute('role')).toBe('button');
    expect(element.getAttribute('tabindex')).toBe('0');
  });

  it('applies default size xs and variant outline when not provided', () => {
    const element = mountTagChip({
      label: 'Tag',
    });

    const className = element.className;
    expect(className).toMatch(/-tag-chip\b/);
    expect(className).toMatch(/--size-xs\b/);
    expect(className).toMatch(/--variant-outline\b/);
    expect(className).not.toMatch(/-active\b/);
  });

  it('applies provided size and variant', () => {
    const element = mountTagChip({
      label: 'Tag',
      size: 's',
      variant: 'green',
    });

    const className = element.className;
    expect(className).toMatch(/--size-s\b/);
    expect(className).toMatch(/--variant-green\b/);
  });

  it('adds active suffix when active=true', () => {
    const element = mountTagChip({
      label: 'Active',
      active: true,
    });

    expect(element.className).toMatch(/-active\b/);
  });

  it('sets aria-pressed=true for interactive active button usage', () => {
    const element = mountTagChip({
      label: 'Filter',
      active: true,
    });

    element.addEventListener('click', () => undefined);

    expect(element.getAttribute('aria-pressed')).toBe('true');
  });

  it('sets aria-pressed=false for interactive inactive button usage', () => {
    const element = mountTagChip({
      label: 'Filter',
      active: false,
    });

    element.addEventListener('click', () => undefined);

    expect(element.getAttribute('aria-pressed')).toBe('false');
  });

  it('preserves explicit aria-pressed passed by consumer', () => {
    const element = mountTagChip({
      label: 'Filter',
      active: false,
      ariaPressed: 'mixed',
    });

    element.addEventListener('click', () => undefined);

    expect(element.getAttribute('aria-pressed')).toBe('mixed');
  });

  it('sets data-testid when provided', () => {
    const element = mountTagChip({
      label: 'Tag',
      dataTestId: 'tag-chip',
    });

    expect(element.getAttribute('data-testid')).toBe('tag-chip');
  });

  it('marks disabled button semantics and prevents click handlers', () => {
    const element = mountTagChip({
      label: 'Tag',
      disabled: true,
    });
    const handleClick = vi.fn();

    element.addEventListener('click', handleClick);
    element.click();

    expect(element.getAttribute('tabindex')).toBe('-1');
    expect(element.getAttribute('aria-disabled')).toBe('true');
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('triggers click on Enter key for enabled button usage', () => {
    const element = mountTagChip({
      label: 'Tag',
    });
    const handleClick = vi.fn();

    element.addEventListener('click', handleClick);
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('triggers click on Space keyup and prevents default on keydown', () => {
    const element = mountTagChip({
      label: 'Tag',
    });
    const handleClick = vi.fn();
    const keydownEvent = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });

    element.addEventListener('click', handleClick);

    element.dispatchEvent(keydownEvent);

    expect(keydownEvent.defaultPrevented).toBe(true);
    expect(handleClick).not.toHaveBeenCalled();

    element.dispatchEvent(
      new KeyboardEvent('keyup', { key: ' ', bubbles: true, cancelable: true }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
