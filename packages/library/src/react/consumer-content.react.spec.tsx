/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import CalculationResults from '@/components/data-display/CalculationResults';
import DescriptionField from '@/components/data-display/DescriptionField';
import ToastAlert from '@/components/feedback/ToastAlert';
import FormFieldLabel from '@/components/form/FormFieldLabel';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import NavigationCard from '@/components/navigation/NavigationCard';

afterEach(cleanup);

const payload = '<img src=x onerror="alert(1)">Consumer content';

function expectSafeText(container: HTMLElement, selector: string): void {
  const element = container.querySelector(selector);

  expect(element).toHaveTextContent(payload);
  expect(element?.querySelector('img')).toBeNull();
}

describe('React consumer content safety', () => {
  it('renders CalculationResults values as text', () => {
    const { container } = render(<CalculationResults label={payload} result={payload} />);

    expectSafeText(container, '.peaui-calculation-results__content-label span');
    expectSafeText(container, 'output');
  });

  it('renders DescriptionField and FormFieldLabel labels as text', () => {
    const description = render(<DescriptionField label={payload}>Value</DescriptionField>);
    const formLabel = render(<FormFieldLabel for="field" text={payload} />);

    expectSafeText(description.container, '.peaui-description-field__label');
    expectSafeText(formLabel.container, '.peaui-form-label__text');
  });

  it('renders ToastAlert content as text', () => {
    const { container } = render(<ToastAlert title={payload} description={payload} />);

    expectSafeText(container, '.peaui-toast-alert__title');
    expectSafeText(container, '.peaui-toast-alert__description');
  });

  it('renders navigation labels and descriptions as text', () => {
    const breadcrumbs = render(<Breadcrumbs items={[{ key: 'current', label: payload }]} />);
    const card = render(<NavigationCard title="Title" description={payload} />);

    expectSafeText(breadcrumbs.container, '.peaui-breadcrumbs__content [aria-current="page"]');
    expectSafeText(card.container, '.peaui-navigation-card__description');
  });
});
