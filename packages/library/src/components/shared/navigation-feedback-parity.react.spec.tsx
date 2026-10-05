/** @jsxImportSource react */
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MessageText from '../feedback/MessageText';
import ToastAlert from '../feedback/ToastAlert';
import ProgressIndicator from '../feedback/ProgressIndicator';
import NavigationStepper from '../navigation/NavigationStepper';
import NavigationTabs from '../navigation/NavigationTabs';
import ListLimitControl from '../navigation/ListLimitControl';
import NavigationCard from '../navigation/NavigationCard';
import PopoverButton from '../overlayer/PopoverButton';
import PopoverOverlayer from '../overlayer/PopoverOverlayer';
import InfoTooltip from '../overlayer/InfoTooltip';

afterEach(cleanup);

describe('navigation and feedback design-system parity', () => {
  it('keeps tooltip trigger content controlled by the consumer, including an empty trigger', () => {
    const { container, rerender } = render(<InfoTooltip description="Help" />);
    expect(container.querySelector('.peaui-info-tooltip')?.childElementCount).toBe(0);
    rerender(
      <InfoTooltip description="Help">
        <span>Details</span>
      </InfoTooltip>,
    );
    expect(container.querySelector('.peaui-info-tooltip')?.textContent).toBe('Details');
  });
  it('renders per-tab before and after content without changing the tab accessible name', () => {
    const { getByRole } = render(
      <NavigationTabs
        ariaLabel="Navigation"
        tabs={[{ key: 'inbox', label: 'Inbox' }]}
        renderTabBefore={(tab) => <span>{`Before ${tab.key}`}</span>}
        renderTabAfter={(tab) => <span>{`After ${tab.key}`}</span>}
      />,
    );
    const tab = getByRole('button', { name: 'Inbox' });
    expect(tab.textContent).toBe('Before inboxInboxAfter inbox');
  });

  it('displays the numeric page limit through the string-valued select options', () => {
    const { getByRole } = render(<ListLimitControl id="limit" label="Rows" limit={10} />);
    expect((getByRole('combobox') as HTMLInputElement).value).toBe('10');
  });
  it('uses the small message default and reserves builtin icons for semantic variants', () => {
    const { container, rerender } = render(<MessageText id="message">Message</MessageText>);
    expect(container.firstElementChild?.classList.contains('peaui-message-text--size-s')).toBe(
      true,
    );
    rerender(
      <MessageText id="message" variant="white">
        Message
      </MessageText>,
    );
    expect(container.querySelector('svg')).toBeNull();
    rerender(
      <MessageText id="message" variant="info">
        Message
      </MessageText>,
    );
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 14 14');
  });

  it.each(['info', 'error', 'success', 'danger'] as const)(
    'uses the same %s symbol for inline messages and toast notifications',
    (variant) => {
      const { container } = render(
        <>
          <MessageText id="message" variant={variant}>
            Message
          </MessageText>
          <ToastAlert variant={variant} title="Notification" canClose />
        </>,
      );
      const message = container.querySelector('.peaui-message-text__icon');
      const toast = container.querySelector('.peaui-toast-alert__icon');
      expect(message?.getAttribute('viewBox')).toBe('0 0 14 14');
      expect(toast?.getAttribute('viewBox')).toBe('0 0 14 14');
      expect(toast?.querySelector('path')?.getAttribute('d')).toBe(
        message?.querySelector('path')?.getAttribute('d'),
      );
      expect(
        container.querySelector('.peaui-toast-alert__close-icon')?.getAttribute('viewBox'),
      ).toBe('0 0 12 12');
    },
  );

  it('shows 0/0 when no steps exist, including the inactive progress variant', () => {
    const { container } = render(<ProgressIndicator steps={0} removeActive />);
    expect(container.querySelector('.peaui-progress-indicator__text')?.textContent).toBe('0/0');
  });

  it('groups the step status and completion symbol before the strong step label', () => {
    const { container, getByRole } = render(
      <NavigationStepper
        options={[
          { key: 'done', label: '1. Account', status: 'complete' },
          { key: 'hidden', label: 'Hidden step', status: 'hidden' },
        ]}
      />,
    );
    const done = getByRole('button', { name: 'Krok 1. Account. Gotowe.' });
    const status = done.querySelector('.peaui-navigation-stepper__status');
    expect(status?.querySelector('.peaui-navigation-stepper__status-label')?.textContent).toBe(
      'Gotowe',
    );
    expect(status?.querySelector('svg')).not.toBeNull();
    expect(done.querySelector('strong.peaui-navigation-stepper__label')?.textContent).toBe(
      '1. Account',
    );
    expect(
      container.querySelector('.peaui-navigation-stepper__status-label--status-hidden')
        ?.textContent,
    ).toBe('Ukryte');
    expect(done.children).toHaveLength(2);
    expect(
      container
        .querySelector('.peaui-navigation-stepper__control--prev')
        ?.classList.contains('peaui-button-action--is-disabled'),
    ).toBe(true);
  });

  it('keeps unavailable navigation cards semantic and explains the lock through the tooltip', () => {
    const { container, getByRole } = render(
      <NavigationCard
        title="Locked step"
        description="Details"
        variant="disabled"
        path="/locked"
      />,
    );
    const card = getByRole('article', { name: 'Locked step' });
    expect(card.getAttribute('aria-disabled')).toBe('true');
    expect(
      container.querySelector('.peaui-navigation-card__tooltip [tabindex="0"]'),
    ).not.toBeNull();
    expect(getByRole('tooltip').textContent).toContain('Krok niedostepny');
  });

  it.each([PopoverButton, PopoverOverlayer])(
    'places a default popover above its trigger',
    (Component) => {
      const { container, getByRole } = render(<Component content="Popup">Open</Component>);
      fireEvent.click(getByRole('button', { name: 'Open' }));
      expect(container.querySelector('[role="dialog"]')?.className).toContain(
        '__content--placement-top',
      );
    },
  );

  it('uses the standard disabled button treatment for popover buttons', () => {
    const { getByRole } = render(
      <PopoverButton disabled content="Popup">
        Open
      </PopoverButton>,
    );
    expect(getByRole('button').classList.contains('peaui-button-action--is-disabled')).toBe(true);
  });
});
