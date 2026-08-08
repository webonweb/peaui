import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { FormFieldLabelElement, defineFormFieldLabel } from './index.wc';

defineFormFieldLabel();

type StoryArgs = {
  dataTestId?: string;
  for: string;
  readonly?: boolean;
  required?: boolean;
  text: string;
};

const meta = {
  title: '5. Form/FormLabel',
  component: FormFieldLabelElement.tagName,
  parameters: {
    name: 'FormLabel',
    description:
      'Etykieta pola formularza z opcjonalnym tooltipem (slot hint) i dopiskiem o niewymagalnosci pola.',
    code: `
<script type="module">
  import "@peaui/ui/form/FormFieldLabel";
</script>

<peaui-form-field-label
  for="first-name"
  text="Imie"
  readonly="false"
  required="true"
  data-testid="form-label"
>
  <span slot="hint">Tutaj mozesz dodac podpowiedz do pola.</span>
</peaui-form-field-label>
    `,
  },
  argTypes: {
    for: {
      control: { type: 'text' },
      table: { type: { summary: 'string' }, defaultValue: { summary: undefined } },
      description: 'ID pola, do ktorego odnosi sie etykieta (atrybut for).',
    },
    text: {
      control: { type: 'text' },
      table: { type: { summary: 'string' }, defaultValue: { summary: undefined } },
      description: 'Tekst etykiety (renderowany przez innerHTML).',
    },
    readonly: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<StoryArgs>;

function getSettings(storyMeta: Meta<StoryArgs>) {
  const argTypes = storyMeta.argTypes ?? {};

  return {
    ...storyMeta.parameters,
    props: Object.keys(argTypes).map((key) => {
      const argType = argTypes[key] as Record<string, unknown> & {
        type?: unknown;
        types?: unknown;
      };

      return {
        ...argType,
        prop: key,
        type: argType.types ?? argType.type,
      };
    }),
  };
}

function createFormFieldLabel(args: Partial<StoryArgs>): FormFieldLabelElement {
  const element = document.createElement(FormFieldLabelElement.tagName) as FormFieldLabelElement;
  const hint = document.createElement('span');

  if (args.for !== undefined) {
    element.setAttribute('for', args.for);
  }

  if (args.text !== undefined) {
    element.text = args.text;
  }

  if (args.readonly !== undefined) {
    element['readonly'] = args.readonly;
  }

  if (args.required !== undefined) {
    element.required = args.required;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  hint.setAttribute('slot', 'hint');
  hint.textContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat.';
  element.appendChild(hint);

  return element;
}

export const FormLabel: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '18.75rem';
    wrapper.style.margin = 'auto';
    wrapper.appendChild(createFormFieldLabel(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    for: 'first-name',
    text: 'Lorem ipsum',
    readonly: false,
    required: true,
    dataTestId: 'form-label',
  },
};
