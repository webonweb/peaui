/** @jsxImportSource react */
import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import TagChip from '../data-display/TagChip';
import CounterBadge from '../data-display/CounterBadge';
import SectionHeading from '../data-display/SectionHeading';
import DescriptionField from '../data-display/DescriptionField';
import FormFieldLabel from '../form/FormFieldLabel';
import FormField from '../form/FormField';
import TableListHeader from '../data-display/TableListHeader';
import TableListFooter from '../data-display/TableListFooter';
import TreeList from '../data-display/TreeList';

afterEach(cleanup);
describe('regressions: React composition', () => {
  it('uses shared TagChip defaults and button semantics', () => {
    const { container } = render(
      <form>
        <TagChip label="Chip" active onClick={() => undefined} />
      </form>,
    );
    const chip = container.querySelector('.peaui-tag-chip')!;
    expect(chip.tagName).toBe('BUTTON');
    expect(chip.getAttribute('type')).toBe('button');
    expect(chip.classList.contains('peaui-tag-chip--size-xs')).toBe(true);
    expect(chip.classList.contains('peaui-tag-chip--variant-outline-active')).toBe(true);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
  });
  it('announces CounterBadge changes using the same default size', () => {
    const { getByRole } = render(<CounterBadge value={2} />);
    const badge = getByRole('status');
    expect(badge.getAttribute('aria-live')).toBe('polite');
    expect(badge.classList.contains('peaui-counter-badge--size-s')).toBe(true);
  });
  it('uses the shared SectionHeading defaults and size/tag mapping', () => {
    const { container, rerender } = render(<SectionHeading title="Title" />);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(
      container.querySelector('h3')?.classList.contains('peaui-section-heading__title--large'),
    ).toBe(true);
    rerender(<SectionHeading title="Title" size="heading-l" />);
    expect(container.querySelector('h1')?.textContent).toBe('Title');
  });
  it('keeps rich hints keyboard accessible', () => {
    const { container } = render(
      <DescriptionField label="Label" hint={<strong>Help</strong>}>
        Value
      </DescriptionField>,
    );
    expect(container.querySelector('[tabindex="0"],button')).not.toBeNull();
    expect(container.querySelector('[role="tooltip"]')?.textContent).toContain('Help');
  });
  it('prefers label children over fallback text', () => {
    const { container } = render(
      <FormFieldLabel for="field" text="Fallback">
        <strong>Rich label</strong>
      </FormFieldLabel>,
    );
    expect(container.querySelector('label strong')?.textContent).toBe('Rich label');
    expect(container.textContent).not.toContain('Fallback');
  });
  it('forwards refs for fields, table chrome and trees, and clears them on unmount', () => {
    const refs = Array.from({ length: 4 }, () => createRef<HTMLElement>());
    const { unmount } = render(
      <>
        <FormField id="field" name="field" ref={refs[0]} />
        <TableListHeader ref={refs[1]} />
        <TableListFooter total={1} rowsNumber={10} rowsPerPage={10} page={1} ref={refs[2]} />
        <TreeList tree={{ children: {}, label: 'Root' }} ref={refs[3]} />
      </>,
    );
    for (const ref of refs) expect(ref.current).toBeInstanceOf(HTMLElement);
    unmount();
    for (const ref of refs) expect(ref.current).toBeNull();
  });
});
