import type { Meta, StoryObj } from '@storybook/web-components';

import {
  createVueCustomElementArgTypes,
  createVueCustomElementStoryArgs,
  type VueCustomElementStoryArgs,
} from '@/helpers/vue-custom-element-story.helper';

import {
  formRatingInputDemoProps,
  formRatingInputLabels,
  formRatingInputLongLabel,
} from './form-rating-input.demo';
import FormRatingInputVueComponent from './index.vue';
import { defineFormRatingInput, FormRatingInputElement } from './index.wc';

defineFormRatingInput();

function renderRating(args: VueCustomElementStoryArgs): HTMLElement {
  const element = document.createElement(FormRatingInputElement.tagName) as HTMLElement &
    Record<string, unknown>;
  for (const [name, value] of Object.entries(args)) {
    if (value !== undefined) element[name] = value;
  }
  return element;
}

function renderCollection(configurations: VueCustomElementStoryArgs[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dataset.ratingParity = '';
  Object.assign(wrapper.style, { display: 'grid', gap: '1rem' });
  configurations.forEach((configuration) => wrapper.append(renderRating(configuration)));
  return wrapper;
}

const meta = {
  title: '5. Form/FormRatingInput WC',
  component: FormRatingInputElement.tagName,
  args: {
    ...createVueCustomElementStoryArgs(FormRatingInputVueComponent),
    ...formRatingInputDemoProps,
    allowClear: true,
    dataTestId: 'form-rating-input-default',
    step: 0.5,
  },
  argTypes: createVueCustomElementArgTypes(FormRatingInputVueComponent),
  parameters: {
    name: 'FormRatingInput',
    description:
      'Light-DOM Web Component ze stabilnym opisem wartości, gwiazdkami primary oraz tym samym suwakiem i ARIA co Vue oraz React.',
    code: `
<script type="module">
  import '@peaui/ui/wc/form/FormRatingInput';
  document.querySelector('peaui-form-rating-input').value = 3.5;
</script>
<peaui-form-rating-input id="rating" name="rating" label="Ocena" step="0.5"></peaui-form-rating-input>
    `,
  },
  render: renderRating,
} satisfies Meta<VueCustomElementStoryArgs>;

export default meta;
type Story = StoryObj<VueCustomElementStoryArgs>;

export const Default: Story = {};
export const FullAndHalfSteps: Story = {
  render: () =>
    renderCollection([
      { ...formRatingInputDemoProps, id: 'rating-full-wc', label: 'Pełne oceny', value: 4 },
      {
        ...formRatingInputDemoProps,
        id: 'rating-half-wc',
        label: 'Połówkowe oceny',
        labels: formRatingInputLabels,
        step: 0.5,
        value: 3.5,
      },
      {
        ...formRatingInputDemoProps,
        allowClear: true,
        id: 'rating-empty-wc',
        label: 'Pusta ocena',
        value: null,
      },
    ]),
};
export const SizesAndCustomIcon: Story = {
  render: () =>
    renderCollection([
      { ...formRatingInputDemoProps, id: 'rating-s-wc', label: 'Mała', size: 's' },
      { ...formRatingInputDemoProps, id: 'rating-m-wc', label: 'Średnia', size: 'm' },
      {
        ...formRatingInputDemoProps,
        icon: 'core/heart',
        id: 'rating-l-wc',
        label: 'Duża, własna ikona',
        size: 'l',
      },
    ]),
};
export const ReadonlyDisabledAndError: Story = {
  render: () =>
    renderCollection([
      { ...formRatingInputDemoProps, id: 'rating-readonly-wc', readonly: true, value: 4 },
      { ...formRatingInputDemoProps, disabled: true, id: 'rating-disabled-wc', value: 2 },
      {
        ...formRatingInputDemoProps,
        error: 'Wybierz ocenę, aby kontynuować.',
        id: 'rating-error-wc',
        required: true,
        value: null,
      },
    ]),
};
export const KeyboardAndClear: Story = {
  args: { allowClear: true, id: 'rating-keyboard-wc', step: 0.5, value: 2.5 },
};
export const MobileAndLongLabel: Story = {
  args: { label: formRatingInputLongLabel, max: 10, value: 7 },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const DarkMode: Story = {
  parameters: { backgrounds: { default: 'dark' } },
};
