import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { FormInputElement, defineFormInput } from './index.wc';

defineFormInput();

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
  value?: string;
};

const meta = {
  title: '5. Form/FormInput',
  component: FormInputElement.tagName,
  parameters: {
    name: 'FormInput',
    description:
      'Bazowy komponent input type="text" opakowany w FormField. Obsluguje update:value, etykiete, ikony, tekst przed/po polu oraz sloty pomocnicze.',
    code: `
<script type="module">
  import "@peaui/ui/form/FormInput";
</script>

<peaui-form-input
  id="first-name"
  name="firstName"
  value="Jan"
  label="Imie"
  placeholder="Wpisz imie"
>
  <span slot="hint">Tutaj mozesz dodac podpowiedz do pola.</span>
</peaui-form-input>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID pola formularza.',
      table: { type: { summary: 'string' }, defaultValue: { summary: undefined } },
    },
    name: {
      control: { type: 'text' },
      description: 'Nazwa pola formularza.',
      table: { type: { summary: 'string' }, defaultValue: { summary: undefined } },
    },
    value: {
      control: { type: 'text' },
      description: 'Aktualna wartosc pola.',
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: undefined } },
    },
    label: {
      control: { type: 'text' },
      description: 'Etykieta renderowana nad polem.',
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: undefined } },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder inputa.',
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: "'wpisz'" } },
    },
    required: {
      control: { type: 'boolean' },
      description: 'Oznacza pole jako wymagane.',
      table: { type: { summary: 'boolean | undefined' }, defaultValue: { summary: undefined } },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Przelacza komponent w tryb tylko do odczytu.',
      table: { type: { summary: 'boolean | undefined' }, defaultValue: { summary: undefined } },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje z polem.',
      table: { type: { summary: 'boolean | undefined' }, defaultValue: { summary: undefined } },
    },
    before: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany przed polem.',
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: undefined } },
    },
    after: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany po polu.',
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: undefined } },
    },
    iconBefore: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej przed polem.',
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: undefined } },
    },
    iconAfter: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej po polu.',
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: undefined } },
    },
    canErase: {
      control: { type: 'boolean' },
      description: 'Pokazuje mozliwosc wyczyszczenia wartosci.',
      table: { type: { summary: 'boolean | undefined' }, defaultValue: { summary: undefined } },
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maksymalna liczba znakow.',
      table: { type: { summary: 'number | undefined' }, defaultValue: { summary: undefined } },
    },
    dataTestId: {
      control: { type: 'text' },
      table: { type: { summary: 'string | undefined' }, defaultValue: { summary: undefined } },
      description: 'Bazowy data-testid komponentu.',
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
      const argType = argTypes[key as keyof typeof argTypes] as Record<string, unknown> & {
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

function createFormInput(args: Partial<StoryArgs>): FormInputElement {
  const element = document.createElement(FormInputElement.tagName) as FormInputElement;
  const hint = document.createElement('span');
  const description = document.createElement('span');

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

  description.setAttribute('slot', 'description');
  description.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  element.append(hint, description);

  return element;
}

export const FormInput: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '18.75rem';
    wrapper.style.margin = 'auto';
    wrapper.appendChild(createFormInput(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    id: 'lorem-ipsum',
    name: 'loremIpsum',
    value: 'lorem ipsum',
    label: 'Lorem ipsum',
    required: true,
    readonly: false,
    disabled: false,
    before: 'test',
    after: 'tets',
    iconBefore: undefined,
    iconAfter: undefined,
    canErase: true,
    maxLength: undefined,
    dataTestId: 'form-input',
  },
};
