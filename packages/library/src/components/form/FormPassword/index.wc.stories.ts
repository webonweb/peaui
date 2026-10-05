import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { FormPasswordElement, defineFormPassword } from './index.wc';

defineFormPassword();

type StoryArgs = {
  before?: string;
  canCopy?: boolean;
  canVisible?: boolean;
  copyPasswordAriaLabel?: string;
  dataTestId?: string;
  disabled?: boolean;
  enablePasswordStrengthMeter?: boolean;
  hidePasswordAriaLabel?: string;
  iconBefore?: string;
  id: string;
  label?: string;
  maxLength?: number;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  showPasswordAriaLabel?: string;
  value?: string;
};

const meta = {
  title: '5. Form/FormPassword',
  component: FormPasswordElement.tagName,
  parameters: {
    name: 'FormPassword',
    description:
      'Pole hasla oparte o FormField z obsluga update:value, etykiety, opcjonalnymi akcjami po prawej stronie oraz opcjonalnym meterem sily hasla.',
    code: `
<script type="module">
  import "@peaui/ui/form/FormPassword";
</script>

<peaui-form-password
  id="user-password"
  name="userPassword"
  value="SuperTajneHaslo123!"
  label="Haslo"
  placeholder="Wpisz haslo"
  enable-password-strength-meter="true"
>
  <span slot="hint">Uzyj przycisku po prawej, aby pokazac lub skopiowac haslo.</span>
</peaui-form-password>
    `,
  },
  argTypes: {
    id: {
      control: { type: 'text' },
      description: 'ID pola formularza.',
      table: { type: { summary: 'string' } },
    },
    name: {
      control: { type: 'text' },
      description: 'Nazwa pola formularza.',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: { type: 'text' },
      description: 'Aktualna wartosc pola.',
      table: { type: { summary: 'string | undefined' } },
    },
    label: {
      control: { type: 'text' },
      description: 'Etykieta renderowana nad polem.',
      table: { type: { summary: 'string | undefined' } },
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder pola hasla.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'wpisz'" },
      },
    },
    required: {
      control: { type: 'boolean' },
      description: 'Oznacza pole jako wymagane.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'Przelacza komponent w tryb tylko do odczytu.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje interakcje z polem i przyciskami akcji.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    before: {
      control: { type: 'text' },
      description: 'Tekst wyswietlany przed polem.',
      table: { type: { summary: 'string | undefined' } },
    },
    iconBefore: {
      control: { type: 'text' },
      description: 'Nazwa ikony wyswietlanej przed polem.',
      table: { type: { summary: 'string | undefined' } },
    },
    maxLength: {
      control: { type: 'number' },
      description: 'Maksymalna liczba znakow.',
      table: { type: { summary: 'number | undefined' } },
    },
    canCopy: {
      control: { type: 'boolean' },
      description: 'Decyduje, czy pokazywac przycisk kopiowania hasla.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
    canVisible: {
      control: { type: 'boolean' },
      description: 'Decyduje, czy pokazywac przycisk pokazywania i ukrywania hasla.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'true' },
      },
    },
    enablePasswordStrengthMeter: {
      control: { type: 'boolean' },
      description:
        'Pokazuje meter sily hasla oraz wymusza spelnienie zasad bezpieczenstwa przez custom validity.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
      },
    },
    showPasswordAriaLabel: {
      control: { type: 'text' },
      description: 'Etykieta dostepnosci dla przycisku pokazywania hasla.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Pokaz haslo'" },
      },
    },
    hidePasswordAriaLabel: {
      control: { type: 'text' },
      description: 'Etykieta dostepnosci dla przycisku ukrywania hasla.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Ukryj haslo'" },
      },
    },
    copyPasswordAriaLabel: {
      control: { type: 'text' },
      description: 'Etykieta dostepnosci dla przycisku kopiowania hasla.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: "'Kopiuj haslo'" },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid komponentu.',
      table: { type: { summary: 'string | undefined' } },
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

function createFormPassword(args: Partial<StoryArgs>): FormPasswordElement {
  const element = document.createElement(FormPasswordElement.tagName) as FormPasswordElement;
  const hint = document.createElement('span');

  if (args.before !== undefined) {
    element.beforeText = args.before;
  }

  if (args.canCopy !== undefined) {
    element.canCopy = args.canCopy;
  }

  if (args.canVisible !== undefined) {
    element.canVisible = args.canVisible;
  }

  if (args.copyPasswordAriaLabel !== undefined) {
    element.copyPasswordAriaLabel = args.copyPasswordAriaLabel;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.disabled !== undefined) {
    element.disabled = args.disabled;
  }

  if (args.enablePasswordStrengthMeter !== undefined) {
    element.enablePasswordStrengthMeter = args.enablePasswordStrengthMeter;
  }

  if (args.hidePasswordAriaLabel !== undefined) {
    element.hidePasswordAriaLabel = args.hidePasswordAriaLabel;
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

  if (args.showPasswordAriaLabel !== undefined) {
    element.showPasswordAriaLabel = args.showPasswordAriaLabel;
  }

  if (args.value !== undefined) {
    element.value = args.value;
  }

  hint.setAttribute('slot', 'hint');
  hint.textContent = 'Uzyj przycisku po prawej, aby pokazac lub skopiowac haslo.';
  element.appendChild(hint);

  return element;
}

export const FormPassword: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '18.75rem';
    wrapper.style.margin = 'auto';
    wrapper.appendChild(createFormPassword(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    id: 'user-password',
    name: 'userPassword',
    value: 'SuperTajneHaslo123!',
    label: ' ',
    required: true,
    readonly: false,
    disabled: false,
    before: undefined,
    canCopy: true,
    canVisible: true,
    enablePasswordStrengthMeter: false,
    iconBefore: undefined,
    dataTestId: 'form-password',
  },
};

export const ReadonlyPassword: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '18.75rem';
    wrapper.style.margin = 'auto';
    wrapper.appendChild(createFormPassword(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    id: 'readonly-password',
    name: 'readonlyPassword',
    value: 'ReadonlyHaslo789!',
    label: 'Haslo techniczne',
    readonly: true,
    disabled: false,
    canCopy: true,
    canVisible: true,
    dataTestId: 'readonly-password',
  },
};

export const WithoutActions: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '18.75rem';
    wrapper.style.margin = 'auto';
    wrapper.appendChild(createFormPassword(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    id: 'password-without-actions',
    name: 'passwordWithoutActions',
    value: 'UkryteHaslo321!',
    label: 'Haslo bez akcji',
    readonly: false,
    disabled: false,
    canCopy: false,
    canVisible: false,
    dataTestId: 'password-without-actions',
  },
};

export const WithStrengthMeter: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.style.width = '18.75rem';
    wrapper.style.margin = 'auto';
    wrapper.appendChild(createFormPassword(args));

    return createStoryContent({
      settings: getSettings(meta),
      preview: wrapper,
    });
  },
  args: {
    id: 'password-with-strength-meter',
    name: 'passwordWithStrengthMeter',
    value: 'BezpieczneHaslo34!$',
    label: 'Haslo z meterem sily',
    readonly: false,
    disabled: false,
    canCopy: true,
    canVisible: true,
    enablePasswordStrengthMeter: true,
    dataTestId: 'password-with-strength-meter',
  },
};
