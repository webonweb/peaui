import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { SectionHeadingElement, defineSectionHeading } from './index.wc';

defineSectionHeading();

type SectionHeadingStoryArgs = {
  as?: 'section' | 'div' | 'header';
  dataTestId?: string;
  size?: 'heading-l' | 'heading-m' | 'heading-s' | 'heading-xs' | 'xl' | 'l' | 'm' | 's';
  variant?: 'default' | 'primary' | 'secondary';
};

const meta = {
  title: '2. Data Display/SectionHeading',
  component: SectionHeadingElement.tagName,
  parameters: {
    name: 'SectionHeading',
    description:
      'Komponent do budowania naglowka sekcji: tytul (h1/h2/h3/h4 zaleznie od size) oraz opcjonalny opis. Wspiera semantyczny wrapper poprzez prop `as` (section/div/header), wariant kolorystyczny tytulu przez `variant`, forwarduje atrybuty oraz ustawia aria-labelledby (gdy slot title jest obecny).',
    code: `
<script type="module">
  import "@peaui/ui/data-display/SectionHeading";
</script>

<peaui-section-heading variant="primary">
  <span slot="title">Ustawienia</span>
  <span slot="description">Opis sekcji, ktory wprowadza w temat.</span>
</peaui-section-heading>
    `,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['heading-l', 'heading-m', 'heading-s', 'heading-xs', 'xl', 'l', 'm', 's'],
      description:
        'Rozmiar naglowka (wplywa tez na typ tagu: heading-l -> h1, heading-m/heading-s/heading-xs/xl -> h2, l -> h3, m -> h4, s -> h5).',
      table: {
        type: {
          summary:
            "'heading-l' | 'heading-m' | 'heading-s' | 'heading-xs' | 'xl' | 'l' | 'm' | 's'",
        },
        defaultValue: { summary: 'l' },
      },
    },
    as: {
      control: { type: 'select' },
      options: ['section', 'div', 'header'],
      description: 'Semantyczny wrapper komponentu.',
      table: {
        type: { summary: "'section' | 'div' | 'header'" },
        defaultValue: { summary: 'div' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary'],
      description: 'Wariant kolorystyczny tytulu sekcji.',
      table: {
        type: { summary: "'default' | 'primary' | 'secondary'" },
        defaultValue: { summary: 'default' },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description:
        'Bazowy data-testid dla testow. Dodatkowo generowane sa sufiksy: -title, -hint i -description.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
} satisfies Meta<SectionHeadingStoryArgs>;

export default meta;

type Story = StoryObj<SectionHeadingStoryArgs>;

function getSettings(storyMeta: Meta<SectionHeadingStoryArgs>) {
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

function appendSlotText(
  element: SectionHeadingElement,
  slotName: 'title' | 'description' | 'hint',
  text: string,
): void {
  const slotElement = document.createElement('span');

  slotElement.setAttribute('slot', slotName);
  slotElement.textContent = text;
  element.appendChild(slotElement);
}

function createSectionHeading(
  args: Partial<SectionHeadingStoryArgs> = {},
  content: {
    description?: string;
    hint?: string;
    title?: string;
  } = {},
): SectionHeadingElement {
  const element = document.createElement(SectionHeadingElement.tagName) as SectionHeadingElement;

  if (args.size !== undefined) {
    element.size = args.size;
  }

  if (args.as !== undefined) {
    element.as = args.as;
  }

  if (args.variant !== undefined) {
    element.variant = args.variant;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (content.title) {
    appendSlotText(element, 'title', content.title);
  }

  if (content.description) {
    appendSlotText(element, 'description', content.description);
  }

  if (content.hint) {
    appendSlotText(element, 'hint', content.hint);
  }

  return element;
}

function createRender(factory?: (args: Partial<SectionHeadingStoryArgs>) => Node) {
  return (args: Partial<SectionHeadingStoryArgs>) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: (
        factory ??
        ((nextArgs) =>
          createSectionHeading(nextArgs, {
            title: 'Lorem ipsum dolor sit amet',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquet in mauris id feugiat.',
            hint: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquet in mauris id feugiat.',
          }))
      )(args),
    });
}

export const SectionHeading: Story = {
  render: createRender(),
  args: {
    size: 'l',
    as: 'div',
    variant: 'default',
    dataTestId: undefined,
  },
};

export const PrimaryVariant: Story = {
  render: createRender((args) =>
    createSectionHeading(args, {
      title: 'Panel administracyjny',
      description: 'Wariant primary podbija tytul akcentem koloru podstawowego.',
    }),
  ),
  args: {
    size: 'xl',
    as: 'section',
    variant: 'primary',
    dataTestId: 'section-heading-primary',
  },
};

export const HeadingLarge: Story = {
  render: createRender((args) =>
    createSectionHeading(args, {
      title: 'Glowne ustawienia strony',
      description: 'Nowy rozmiar heading-l renderuje tytul jako h1.',
    }),
  ),
  args: {
    size: 'heading-l',
    as: 'header',
    variant: 'default',
    dataTestId: 'section-heading-heading-large',
  },
};

export const HeadingMedium: Story = {
  render: createRender((args) =>
    createSectionHeading(args, {
      title: 'Wazna sekcja posrednia',
      description: 'Rozmiar heading-m ustawia wiekszy token typografii i renderuje tytul jako h2.',
    }),
  ),
  args: {
    size: 'heading-m',
    as: 'section',
    variant: 'default',
    dataTestId: 'section-heading-heading-medium',
  },
};

export const HeadingSmall: Story = {
  render: createRender((args) =>
    createSectionHeading(args, {
      title: 'Naglowek sekcji pomocniczej',
      description:
        'Rozmiar heading-s ustawia dedykowany token typografii i renderuje tytul jako h2.',
    }),
  ),
  args: {
    size: 'heading-s',
    as: 'section',
    variant: 'default',
    dataTestId: 'section-heading-heading-small',
  },
};

export const HeadingExtraSmall: Story = {
  render: createRender((args) =>
    createSectionHeading(args, {
      title: 'Krotki naglowek pomocniczy',
      description:
        'Rozmiar heading-xs ustawia dedykowany token typografii i renderuje tytul jako h2.',
    }),
  ),
  args: {
    size: 'heading-xs',
    as: 'section',
    variant: 'default',
    dataTestId: 'section-heading-heading-xs',
  },
};

export const SecondaryVariant: Story = {
  render: createRender((args) => {
    const wrapper = document.createElement('div');

    wrapper.style.padding = '1.5rem';
    wrapper.style.borderRadius = '0.75rem';
    wrapper.style.background = '#1f2937';
    wrapper.appendChild(
      createSectionHeading(args, {
        title: 'Panel nocny',
        description: 'Wariant secondary ustawia bialy kolor tytulu do uzycia na ciemnym tle.',
      }),
    );

    return wrapper;
  }),
  args: {
    size: 'xl',
    as: 'section',
    variant: 'secondary',
    dataTestId: 'section-heading-secondary',
  },
};
