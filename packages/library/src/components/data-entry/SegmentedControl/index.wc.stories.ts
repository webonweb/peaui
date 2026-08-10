import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import SegmentedControlVueComponent from './index.vue';
import { defineSegmentedControl, SegmentedControlElement } from './index.wc';
import { segmentedControlPeriodItems, segmentedControlViewItems } from './segmented-control.demo';

defineSegmentedControl();

function renderControl(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(SegmentedControlElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderSet(entries: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, { display: 'grid', gap: '1.5rem', justifyItems: 'start' });
  wrapper.append(...entries.map(renderControl));
  return wrapper;
}

const meta = {
  title: '3. Data Entry/SegmentedControl WC',
  component: SegmentedControlElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(SegmentedControlVueComponent),
    ariaLabel: 'Sposób wyświetlania',
    dataTestId: 'segmented-control-default',
    items: segmentedControlViewItems,
    value: 'grid',
  },
  argTypes: createVueCustomElementArgTypes(SegmentedControlVueComponent),
  parameters: {
    name: 'SegmentedControl',
    description:
      'Light-DOM radiogroup z tym samym modelem, wskaźnikiem, responsywnością i wyglądem co Vue oraz React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/data-entry/SegmentedControl';
</script>
<peaui-segmented-control aria-label="Sposób wyświetlania"></peaui-segmented-control>
<script>document.querySelector('peaui-segmented-control').items = [{ value: 'grid', label: 'Kafelki' }];</script>
    `,
  },
  render: renderControl,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};

export const DistributionAndWidth: Story = {
  render: () => {
    const wrapper = renderSet([
      { ariaLabel: 'Równy rozkład', items: segmentedControlPeriodItems, value: 30 },
      {
        ariaLabel: 'Naturalny rozkład',
        distribution: 'auto',
        items: segmentedControlPeriodItems,
        value: 90,
      },
      {
        ariaLabel: 'Pełna szerokość',
        fullWidth: true,
        items: segmentedControlPeriodItems,
        value: 365,
      },
    ]);
    wrapper.style.inlineSize = 'min(100%, 42rem)';
    wrapper.style.justifyItems = 'stretch';
    return wrapper;
  },
};

export const ContentAndSizes: Story = {
  render: () =>
    renderSet([
      {
        ariaLabel: 'Ikony',
        content: 'icon',
        items: segmentedControlViewItems,
        size: 's',
        value: 'list',
      },
      {
        ariaLabel: 'Ikony i tekst',
        content: 'icon-text',
        items: segmentedControlViewItems,
        value: 'grid',
      },
      {
        ariaLabel: 'Tekst',
        items: segmentedControlViewItems,
        size: 'l',
        value: 'compact',
      },
    ]),
};

export const DisabledStates: Story = {
  render: () =>
    renderSet([
      {
        ariaLabel: 'Wyłączona pozycja',
        items: segmentedControlViewItems.map((item, index) => ({
          ...item,
          disabled: index === 1,
        })),
        value: 'list',
      },
      {
        ariaLabel: 'Wyłączona grupa',
        disabled: true,
        items: segmentedControlViewItems,
        value: 'grid',
      },
      {
        ariaLabel: 'Niepoprawna wartość',
        items: segmentedControlViewItems,
        value: 'missing',
      },
    ]),
};

export const Controlled: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    const output = document.createElement('output');
    const control = renderControl({
      ariaLabel: 'Kontrolowany widok',
      items: segmentedControlViewItems,
      value: 'grid',
    });
    Object.assign(wrapper.style, { display: 'grid', gap: '.75rem', justifyItems: 'start' });
    output.textContent = 'Wybrano: Kafelki';
    control.addEventListener('update:value', (event) => {
      const value = (event as CustomEvent<string | number | null>).detail;
      const selectedItem = segmentedControlViewItems.find((item) => item.value === value);
      output.textContent = `Wybrano: ${selectedItem?.label ?? 'brak'}`;
    });
    wrapper.append(output, control);
    return wrapper;
  },
};

export const ManualActivation: Story = {
  args: { activation: 'manual', ariaLabel: 'Ręczna aktywacja', value: 'list' },
};

export const VerticalAndRtl: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      alignItems: 'start',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem',
      maxWidth: '100%',
      minWidth: '0',
      width: '100%',
    });
    const vertical = renderControl({
      ariaLabel: 'Układ pionowy',
      items: segmentedControlViewItems,
      orientation: 'vertical',
      value: 'grid',
    });
    const rtl = document.createElement('div');
    Object.assign(vertical.style, { flex: '1 1 14rem', maxWidth: '100%', minWidth: '0' });
    Object.assign(rtl.style, { flex: '1 1 14rem', maxWidth: '100%', minWidth: '0' });
    rtl.dir = 'rtl';
    rtl.append(
      renderControl({
        ariaLabel: 'Kierunek RTL',
        items: segmentedControlViewItems,
        value: 'grid',
      }),
    );
    wrapper.append(vertical, rtl);
    return wrapper;
  },
};

export const MobileOverflow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.dataset.segmentedControlMobile = '';
    Object.assign(wrapper.style, { inlineSize: '20rem', maxInlineSize: '100%' });
    wrapper.append(
      renderControl({
        ariaLabel: 'Zakres raportu',
        dataTestId: 'segmented-control-mobile',
        fullWidth: true,
        items: Array.from({ length: 8 }, (_, index) => ({
          value: index,
          label: `Bardzo długa opcja ${index + 1}`,
        })),
        value: 0,
      }),
    );
    return wrapper;
  },
};

export const ReducedMotion: Story = {
  args: { ariaLabel: 'Ograniczony ruch', value: 'grid' },
};

export const DarkMode: Story = {
  args: { ariaLabel: 'Widok w ciemnym motywie', content: 'icon-text', value: 'grid' },
  parameters: { backgrounds: { default: 'dark' } },
};
