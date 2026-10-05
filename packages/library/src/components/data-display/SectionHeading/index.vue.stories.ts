import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import SectionHeadingComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
const { getSettings } = useSettingsStorie();

const meta: Meta<typeof SectionHeadingComponent> = {
  title: '2. Data Display/SectionHeading',
  component: SectionHeadingComponent,
  parameters: {
    name: 'SectionHeading',
    description:
      'Komponent do budowania naglowka sekcji: tytul (h1/h2/h3/h4 zaleznie od size) oraz opcjonalny opis. Wspiera semantyczny wrapper poprzez prop `as` (section/div/header), wariant kolorystyczny tytulu przez `variant`, forwarduje atrybuty oraz ustawia aria-labelledby (gdy slot title jest obecny).',
    code: `
<script lang="ts" setup>
    import SectionHeading from "@peaui/ui/data-display/SectionHeading";
</script>

<template>
   <SectionHeading variant="primary">
        <template #title>Ustawienia</template>
        <template #description>Opis sekcji, ktory wprowadza w temat.</template>
    </SectionHeading>
</template>
              `,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['heading-l', 'heading-m', 'heading-s', 'heading-xs', 'xl', 'l', 'm', 's'],
      description:
        'Rozmiar naglowka (wplywa tez na typ tagu: heading-l -> h1, heading-m/heading-s/heading-xs/xl -> h2, l -> h3, m -> h4, s -> strong).',
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
        'Bazowy data-testid dla testow. Dodatkowo generowane sa sufiksy: -title i -description.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SectionHeadingComponent>;

export const SectionHeading: Story = {
  render: (args) => ({
    components: { SectionHeadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SectionHeadingComponent v-bind="args">
          <template #title>Lorem ipsum dolor sit amet</template>
          <template #description>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquet in mauris id feugiat.</template>
          <template #hint>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquet in mauris id feugiat.
          </template>
        </SectionHeadingComponent>
      </StoryContent>
    `,
  }),
  args: {
    size: 'l',
    as: 'div',
    variant: 'default',
    dataTestId: undefined,
  },
};

export const PrimaryVariant: Story = {
  render: (args) => ({
    components: { SectionHeadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SectionHeadingComponent v-bind="args">
          <template #title>Panel administracyjny</template>
          <template #description>Wariant primary podbija tytul akcentem koloru podstawowego.</template>
        </SectionHeadingComponent>
      </StoryContent>
    `,
  }),
  args: {
    size: 'xl',
    as: 'section',
    variant: 'primary',
    dataTestId: 'section-heading-primary',
  },
};

export const HeadingLarge: Story = {
  render: (args) => ({
    components: { SectionHeadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SectionHeadingComponent v-bind="args">
          <template #title>Glowne ustawienia strony</template>
          <template #description>Nowy rozmiar heading-l renderuje tytul jako h1.</template>
        </SectionHeadingComponent>
      </StoryContent>
    `,
  }),
  args: {
    size: 'heading-l',
    as: 'header',
    variant: 'default',
    dataTestId: 'section-heading-heading-large',
  },
};

export const HeadingMedium: Story = {
  render: (args) => ({
    components: { SectionHeadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SectionHeadingComponent v-bind="args">
          <template #title>Wazna sekcja posrednia</template>
          <template #description>Rozmiar heading-m ustawia wiekszy token typografii i renderuje tytul jako h2.</template>
        </SectionHeadingComponent>
      </StoryContent>
    `,
  }),
  args: {
    size: 'heading-m',
    as: 'section',
    variant: 'default',
    dataTestId: 'section-heading-heading-medium',
  },
};

export const HeadingSmall: Story = {
  render: (args) => ({
    components: { SectionHeadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SectionHeadingComponent v-bind="args">
          <template #title>Naglowek sekcji pomocniczej</template>
          <template #description>Rozmiar heading-s ustawia dedykowany token typografii i renderuje tytul jako h2.</template>
        </SectionHeadingComponent>
      </StoryContent>
    `,
  }),
  args: {
    size: 'heading-s',
    as: 'section',
    variant: 'default',
    dataTestId: 'section-heading-heading-small',
  },
};

export const HeadingExtraSmall: Story = {
  render: (args) => ({
    components: { SectionHeadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <SectionHeadingComponent v-bind="args">
          <template #title>Krotki naglowek pomocniczy</template>
          <template #description>Rozmiar heading-xs ustawia dedykowany token typografii i renderuje tytul jako h2.</template>
        </SectionHeadingComponent>
      </StoryContent>
    `,
  }),
  args: {
    size: 'heading-xs',
    as: 'section',
    variant: 'default',
    dataTestId: 'section-heading-heading-xs',
  },
};

export const SecondaryVariant: Story = {
  render: (args) => ({
    components: { SectionHeadingComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div style="padding: 1.5rem; border-radius: 0.75rem; background: var(--peaui-color-grey-900);">
          <SectionHeadingComponent v-bind="args">
            <template #title>Odwrocona powierzchnia</template>
            <template #description>Wariant secondary odwraca kolor tekstu wraz z motywem; tlo korzysta z tokenu grey-900.</template>
          </SectionHeadingComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    size: 'xl',
    as: 'section',
    variant: 'secondary',
    dataTestId: 'section-heading-secondary',
  },
};
