import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { DescriptionFieldElement, defineDescriptionField } from './index.wc';

defineDescriptionField();

type DescriptionFieldStoryArgs = {
  dataTestId?: string;
  label: string;
};

const meta = {
  title: '2. Data Display/DescriptionField',
  component: DescriptionFieldElement.tagName,
  parameters: {
    name: 'DescriptionField',
    description:
      'Komponent do wyswietlania pary label + value w semantycznym <dl> z opcjonalnymi dodatkami po bokach oraz slotem hint.',
    code: `
<script type="module">
  import "@peaui/ui/data-display/DescriptionField";
</script>

<peaui-description-field label="Telefon">
  <span slot="hint">Numer telefonu kontaktowego klienta.</span>
  <span slot="additional-before">...</span>
  <a href="tel:+48123456789">+48 123 456 789</a>
  <span slot="additional-after">...</span>
</peaui-description-field>
    `,
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Etykieta pola renderowana w <dt>.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description:
        'Bazowy data-testid dla testow. Dodatkowo generowane sa sufiksy: -label, -value, -addon-before, -addon-after oraz -tooltip.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
} satisfies Meta<DescriptionFieldStoryArgs>;

export default meta;

type Story = StoryObj<DescriptionFieldStoryArgs>;

function getSettings(storyMeta: Meta<DescriptionFieldStoryArgs>) {
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

function createDescriptionField(
  args: Partial<DescriptionFieldStoryArgs> = {},
  options: {
    after?: string | null;
    before?: string | null;
    hint?: string;
    value?: string;
  } = {},
): DescriptionFieldElement {
  const element = document.createElement(
    DescriptionFieldElement.tagName,
  ) as DescriptionFieldElement;
  const value = document.createTextNode(options.value ?? 'Lorem ipsum dolor sit amet, consectetur');

  if (args.label !== undefined) {
    element.label = args.label;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (options.before !== null) {
    const before = document.createElement('span');

    before.setAttribute('slot', 'additional-before');
    before.textContent = options.before ?? 'before';
    element.appendChild(before);
  }

  element.appendChild(value);

  if (options.after !== null) {
    const after = document.createElement('span');

    after.setAttribute('slot', 'additional-after');
    after.textContent = options.after ?? 'after';
    element.appendChild(after);
  }

  if (options.hint) {
    const hint = document.createElement('span');

    hint.setAttribute('slot', 'hint');
    hint.textContent = options.hint;
    element.appendChild(hint);
  }

  return element;
}

function createRender(
  factory?: (args: Partial<DescriptionFieldStoryArgs>) => DescriptionFieldElement,
) {
  return (args: Partial<DescriptionFieldStoryArgs>) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = 'max-content';
    wrapper.style.margin = 'auto';
    wrapper.style.maxWidth = '42rem';
    wrapper.style.minWidth = '0';
    wrapper.appendChild((factory ?? ((nextArgs) => createDescriptionField(nextArgs)))(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  };
}

export const DescriptionField: Story = {
  render: createRender(),
  args: {
    label: 'Lorem ipsum',
    dataTestId: undefined,
  },
};

export const WithHint: Story = {
  render: createRender((args) =>
    createDescriptionField(args, {
      before: null,
      after: null,
      value: 'W trakcie weryfikacji',
      hint: 'Ta wartosc prezentuje aktualny status procesu i jest odswiezana po zapisaniu zmian.',
    }),
  ),
  args: {
    label: 'Status wniosku',
    dataTestId: 'description-field-with-hint',
  },
};
