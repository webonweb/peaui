import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { formPinInputDemoProps, formPinInputLongLabel } from './form-pin-input.demo';
import FormPinInputComponent from './index.vue';

const meta = {
  title: '5. Form/FormPinInput',
  component: FormPinInputComponent,
  parameters: {
    name: 'FormPinInput',
    description:
      'Dostępne, responsywne pole PIN/OTP z bezpiecznym paste, roving tabindex i kontrolowanym modelem string.',
  },
  argTypes: {
    size: { control: 'select', options: ['s', 'm', 'l'] },
    transform: { control: 'select', options: ['none', 'uppercase', 'lowercase'] },
    type: { control: 'select', options: ['numeric', 'alphanumeric'] },
  },
} satisfies Meta<typeof FormPinInputComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
const { getSettings } = useSettingsStorie();

const playgroundRender: Story['render'] = (args) => ({
  components: { FormPinInputComponent, StoryContent },
  setup: () => ({ args, settings: getSettings(meta) }),
  template: `
    <StoryContent :settings>
      <div style="inline-size:30rem;max-inline-size:100%">
        <FormPinInputComponent v-bind="args" v-model:value="args.value" />
      </div>
    </StoryContent>
  `,
});

export const Playground: Story = {
  args: { ...formPinInputDemoProps, dataTestId: 'form-pin-input-default' },
  render: playgroundRender,
};

export const NumericAndAlphanumeric: Story = {
  render: () => ({
    components: { FormPinInputComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-pin-parity style="display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))">
          <FormPinInputComponent id="pin-numeric" name="pinNumeric" label="Kod numeryczny" value="0123" :length="4" />
          <FormPinInputComponent id="pin-alpha" name="pinAlpha" label="Kod alfanumeryczny" value="A1B2C3" type="alphanumeric" transform="uppercase" />
        </div>
      </StoryContent>
    `,
  }),
};

export const MaskedAndGrouped: Story = {
  args: {
    ...formPinInputDemoProps,
    dataTestId: 'form-pin-input-masked',
    description:
      'Maskowanie ogranicza podgląd kodu, ale nie zastępuje bezpiecznego przechowywania.',
    mask: true,
    separatorEvery: 3,
    value: '120045',
  },
  render: playgroundRender,
};

export const PasteAndKeyboard: Story = {
  render: () => ({
    components: { FormPinInputComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div data-pin-keyboard style="inline-size:30rem;max-inline-size:100%">
          <p>Wklej cały kod albo użyj strzałek, Home, End, Backspace i Delete.</p>
          <FormPinInputComponent data-test-id="form-pin-input-keyboard" id="pin-keyboard" name="pinKeyboard" label="Kod obsługiwany klawiaturą" description="Tab opuszcza grupę; strzałki zmieniają aktywną komórkę." />
        </div>
      </StoryContent>
    `,
  }),
};

export const ValidationAndStates: Story = {
  render: () => ({
    components: { FormPinInputComponent, StoryContent },
    setup: () => ({ settings: getSettings(meta) }),
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))">
          <FormPinInputComponent id="pin-required" name="pinRequired" label="Kod wymagany" value="" required />
          <FormPinInputComponent id="pin-error" name="pinError" label="Kod z błędem" value="1234" error="Kod wygasł. Wpisz nowy kod." />
          <FormPinInputComponent id="pin-readonly" name="pinReadonly" label="Tylko do odczytu" value="120045" readonly />
          <FormPinInputComponent id="pin-loading" name="pinLoading" label="Ładowanie" value="" loading />
          <FormPinInputComponent id="pin-disabled" name="pinDisabled" label="Niedostępny" value="120045" disabled />
        </div>
      </StoryContent>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: { FormPinInputComponent, StoryContent },
    setup() {
      const value = ref('');
      return { settings: getSettings(meta), value };
    },
    template: `
      <StoryContent :settings>
        <div style="display:grid;gap:.75rem;inline-size:30rem;max-inline-size:100%">
          <FormPinInputComponent v-model:value="value" id="pin-controlled" name="pinControlled" label="Kontrolowany kod" />
          <output>Wartość: {{ value || 'pusta' }}</output>
        </div>
      </StoryContent>
    `,
  }),
};

export const MobileAndLongCode: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({
    components: { FormPinInputComponent },
    setup: () => ({ formPinInputLongLabel }),
    template: `
      <div data-pin-mobile style="inline-size:19rem;max-inline-size:100%;padding-block:1rem">
        <FormPinInputComponent data-test-id="form-pin-input-mobile" id="pin-mobile" name="pinMobile" :label="formPinInputLongLabel" description="Dwanaście znaków jest dostępne przez kontrolowane przewijanie poziome." value="AB12CD34EF56" :length="12" type="alphanumeric" transform="uppercase" :separator-every="4" />
      </div>
    `,
  }),
};
