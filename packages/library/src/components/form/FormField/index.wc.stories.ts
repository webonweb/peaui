import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { FormFieldElement, defineFormField } from './index.wc';

defineFormField();

type StoryArgs = {
  after?: string;
  before?: string;
  canErase?: boolean;
  dataTestId?: string;
  disabled?: boolean;
  iconAfter?: string;
  iconBefore?: string;
  id: string;
  label?: string;
  maxLength?: number;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  value?: number | string | string[] | null;
};

const meta = {
  title: '5. Form/FormField',
  component: FormFieldElement.tagName,
  parameters: {
    name: 'FormField',
    description: 'Kontener pola formularza z etykieta i opcjonalnym tooltipem w slocie hint.',
    code: `
<script type="module">
  import "@peaui/ui/form/FormField";
</script>

<peaui-form-field
  id="first-name"
  name="firstName"
  label="Imie"
  required="true"
  data-testid="form-field"
>
  <span slot="hint">Tutaj mozesz dodac podpowiedz do pola.</span>
  <input type="text" />
</peaui-form-field>
    `,
  },
  argTypes: {
    after: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tekst wyswietlany po zawartosci pola.',
    },
    before: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tekst wyswietlany przed zawartoscia pola.',
    },
    canErase: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Czy pole moze byc czyszczone.',
    },
    disabled: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Stan wylaczenia pola.',
    },
    iconAfter: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Nazwa ikony wyswietlanej po prawej stronie pola.',
    },
    iconBefore: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Nazwa ikony wyswietlanej po lewej stronie pola.',
    },
    id: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
      description: 'ID pola, przekazywane do etykiety.',
    },
    label: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tekst etykiety renderowanej nad polem.',
    },
    maxLength: {
      control: { type: 'number' },
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Maksymalna liczba znakow.',
    },
    name: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
      description: 'Nazwa pola formularza.',
    },
    placeholder: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Placeholder pola.',
    },
    readonly: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Tryb tylko do odczytu.',
    },
    required: {
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Czy pole jest wymagane.',
    },
    dataTestId: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Bazowy data-testid komponentu.',
    },
    value: {
      control: { type: 'text' },
      table: {
        type: { summary: 'string | number | string[] | null | undefined' },
        defaultValue: { summary: undefined },
      },
      description: 'Aktualna wartosc pola.',
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

function createFormField(args: Partial<StoryArgs>): FormFieldElement {
  const element = document.createElement(FormFieldElement.tagName) as FormFieldElement;
  const hint = document.createElement('span');
  const input = document.createElement('input');

  if (args.after !== undefined) {
    element.afterText = args.after;
  }

  if (args.before !== undefined) {
    element.beforeText = args.before;
  }

  if (args.canErase !== undefined) {
    element.canErase = args.canErase;
  }

  if (args.disabled !== undefined) {
    element.disabled = args.disabled;
  }

  if (args.iconAfter !== undefined) {
    element.iconAfter = args.iconAfter;
  }

  if (args.iconBefore !== undefined) {
    element.iconBefore = args.iconBefore;
  }

  if (args.id !== undefined) {
    element.id = args.id;
  }

  if (args.label !== undefined) {
    element.label = args.label;
  }

  if (args.maxLength !== undefined) {
    element.maxLength = args.maxLength;
  }

  if (args.name !== undefined) {
    element.name = args.name;
  }

  if (args.placeholder !== undefined) {
    element.placeholder = args.placeholder;
  }

  if (args.readonly !== undefined) {
    element.readonly = args.readonly;
  }

  if (args.required !== undefined) {
    element.required = args.required;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.value !== undefined) {
    element.value = args.value;
  }

  hint.setAttribute('slot', 'hint');
  hint.textContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ullamcorper finibus augue ut feugiat.';
  input.type = 'text';
  input.setAttribute('data-testid', 'story-input');
  element.append(hint, input);

  return element;
}

export const FormField: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '18.75rem';
    wrapper.appendChild(createFormField(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    after: undefined,
    before: undefined,
    canErase: true,
    disabled: false,
    iconAfter: 'calendar',
    iconBefore: undefined,
    id: 'first-name',
    label: 'Lorem ipsum',
    maxLength: undefined,
    name: 'firstName',
    placeholder: 'Wpisz wartosc',
    readonly: false,
    required: true,
    dataTestId: 'form-field',
    value: 'PEAUI',
  },
};
