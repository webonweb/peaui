/** @jsxImportSource react */
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { computeAccessibleDescription, computeAccessibleName } from 'dom-accessibility-api';
import CardPanel from '../layout/CardPanel';
import GridItem from '../layout/GridItem';
import GridSection from '../layout/GridSection';
import PageLayout from '../layout/PageLayout';
import FullscreenContainer from '../layout/FullscreenContainer';
import ScrollArea from '../layout/ScrollArea';
import CalculationResults from '../data-display/CalculationResults';
import ProgressIndicator from '../feedback/ProgressIndicator';
import ToastAlert from '../feedback/ToastAlert';

afterEach(cleanup);

describe('regressions: layout and display React contracts', () => {
  it('keeps keyboard focus inside fullscreen and restores the toggle on Escape', () => {
    const { container, getByText } = render(
      <>
        <FullscreenContainer>
          <button>Inside</button>
        </FullscreenContainer>
        <button>Outside</button>
      </>,
    );
    const toggle = container.querySelector<HTMLButtonElement>(
      '.peaui-fullscreen-container__toggle',
    )!;
    fireEvent.click(toggle);
    expect(document.activeElement).toBe(toggle);
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    toggle.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getByText('Inside'));
    fireEvent.keyDown(getByText('Inside'), { key: 'Escape' });
    expect(container.querySelector('.peaui-fullscreen-container--fullscreen')).toBeNull();
    expect(document.activeElement).toBe(toggle);
  });

  it('makes the native scroll viewport keyboard reachable and respects an explicit opt-out', () => {
    const { container, rerender } = render(<ScrollArea type="native">Long content</ScrollArea>);
    const viewport = container.querySelector<HTMLElement>('.peaui-scroll-area__viewport')!;
    expect(viewport.getAttribute('tabindex')).toBe('0');
    expect(computeAccessibleName(viewport)).not.toBe('');
    rerender(
      <ScrollArea type="native" tabIndex={-1}>
        Long content
      </ScrollArea>,
    );
    expect(viewport.getAttribute('tabindex')).toBe('-1');
  });

  it('preserves native anchor attributes on CardPanel', () => {
    const { getByRole } = render(
      <CardPanel as="a" {...{ href: '/orders', target: '_blank', rel: 'noreferrer' }}>
        Orders
      </CardPanel>,
    );
    const link = getByRole('link', { name: 'Orders' });
    expect(link.getAttribute('href')).toBe('/orders');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noreferrer');
  });

  it('preserves native keyboard scrolling when custom scroll controls are disabled', () => {
    const { container, rerender } = render(
      <ScrollArea type="native" disabled>
        Long content
      </ScrollArea>,
    );
    const viewport = container.querySelector<HTMLElement>('.peaui-scroll-area__viewport')!;
    expect(viewport.getAttribute('tabindex')).toBe('0');
    rerender(
      <ScrollArea type="native" disabled tabIndex={-1}>
        Long content
      </ScrollArea>,
    );
    expect(viewport.getAttribute('tabindex')).toBe('-1');
  });

  it('uses the common grid defaults and accepts explicit numeric spacing', () => {
    const { container, rerender } = render(
      <>
        <GridItem>Item</GridItem>
        <GridSection>Section</GridSection>
      </>,
    );
    const item = container.querySelector<HTMLElement>('.peaui-grid-item')!;
    const section = container.querySelector<HTMLElement>('.peaui-grid-section__content')!;
    expect(item.classList.contains('peaui-grid-item--grid')).toBe(true);
    expect(item.style.getPropertyValue('--peaui-grid-item-columns')).toBe('2');
    expect(item.style.getPropertyValue('--peaui-grid-item-gap')).toBe('6');
    expect(section.style.getPropertyValue('--columns')).toBe('4');
    expect(section.style.getPropertyValue('--peaui-grid-gap-y')).toBe('6');
    rerender(
      <>
        <GridItem grid={false} columns={3} gap={8}>
          Item
        </GridItem>
        <GridSection columns={3} gap={8}>
          Section
        </GridSection>
      </>,
    );
    expect(item.classList.contains('peaui-grid-item--grid')).toBe(false);
    expect(section.style.getPropertyValue('--peaui-grid-gap-y')).toBe('8');
  });

  it('updates conditional composition and keeps CardPanel styling opt-in', () => {
    const { container, rerender } = render(
      <>
        <CardPanel>Body</CardPanel>
        <GridSection>Rows</GridSection>
      </>,
    );
    const card = container.querySelector('.peaui-card-panel')!;
    expect(card.tagName).toBe('DIV');
    expect(card.classList.contains('peaui-card-panel--shadow-enabled')).toBe(false);
    expect(card.classList.contains('peaui-card-panel--hover-enabled')).toBe(true);
    rerender(
      <>
        <CardPanel header="Added heading">Body</CardPanel>
        <GridSection additional="Added actions">Rows</GridSection>
      </>,
    );
    expect(container.querySelector('.peaui-card-panel__header')?.textContent).toBe('Added heading');
    expect(container.querySelector('.peaui-grid-section__additional')?.textContent).toBe(
      'Added actions',
    );
  });

  it('labels the calculation output and blocks calculation while loading', () => {
    const onSimulate = vi.fn();
    const { container, getByRole, rerender } = render(
      <CalculationResults label="Total" onSimulate={onSimulate} />,
    );
    const button = getByRole('button', { name: 'Oblicz wynik' });
    expect(computeAccessibleName(container.querySelector('output')!)).toBe('Total');
    expect(container.querySelector('output')?.textContent).toBe('-/-');
    fireEvent.click(button);
    expect(onSimulate).toHaveBeenCalledTimes(1);
    rerender(<CalculationResults label="Total" isLoading onSimulate={onSimulate} />);
    expect((button as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(button);
    expect(onSimulate).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.peaui-calculation-results')?.getAttribute('aria-busy')).toBe(
      'true',
    );
  });

  it('starts progress at zero until the first completed step', () => {
    const { getByRole, rerender } = render(<ProgressIndicator steps={4} />);
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
    rerender(<ProgressIndicator steps={4} active={2} />);
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBe('2');
  });

  it('names the page header and renders a semantic footer', () => {
    const { getByRole } = render(
      <PageLayout ariaLabel="Account" top="Toolbar" footer="Footer">
        Body
      </PageLayout>,
    );
    expect(getByRole('banner', { name: 'Account' }).textContent).toBe('Toolbar');
    expect(getByRole('contentinfo').textContent).toBe('Footer');
  });

  it('keeps toast defaults, names, descriptions and close action consistent', () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <ToastAlert title="Saved" description="Changes saved" canClose onClose={onClose} />,
    );
    const toast = getByRole('status');
    expect(computeAccessibleName(toast)).toBe('Saved');
    expect(computeAccessibleDescription(toast)).toBe('Changes saved');
    expect(toast.classList.contains('peaui-toast-alert--shadow')).toBe(false);
    expect(toast.classList.contains('peaui-toast-alert--border')).toBe(false);
    fireEvent.click(getByRole('button', { name: 'Zamknij powiadomienie: Saved' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
