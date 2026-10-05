import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import CardPanelComponent from '@/components/layout/CardPanel/index.vue';
import SvgIconComponent from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const legacyIconModules = import.meta.glob('../../../assets/icons/*.svg');
const legacyIconNames = Object.keys(legacyIconModules)
  .map((path) => path.split('/').pop()?.replace('.svg', ''))
  .filter((name): name is string => Boolean(name))
  .sort((left, right) => left.localeCompare(right));

const iconNames = [
  ...legacyIconNames,
  'core/accessibility',
  'core/check-circle',
  'core/calendar',
  'core/warning-triangle',
  'core/cloud-upload',
  'core/copy',
  'core/file-text',
  'core/heart',
  'core/menu',
  'core/search',
  'core/settings',
  'core/sparkles',
  'extended/building',
  'ring/ring-check',
  'tile/tile-check',
];

const copyTextToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

const meta: Meta<typeof SvgIconComponent> = {
  title: '1. Basic/SvgIcon',
  component: SvgIconComponent,
  parameters: {
    name: 'SvgIcon',
    description:
      'Komponent SvgIcon laduje ikone SVG dynamicznie na podstawie propu `name`. ' +
      'Pogrupowany katalog zawiera 1348 ikon PeaUI Outline Icons Mega 0.3.0. ' +
      'Wartosc propu musi odpowiadac nazwie pliku w katalogu `src/assets/icons`, bez rozszerzenia, ' +
      'np. `plus` dla ikony zgodnosci albo `core/sparkles` dla pogrupowanego katalogu PEAUI.',
    code: `
<script lang="ts" setup>
  import SvgIcon from "@peaui/ui/basic/SvgIcon";
</script>

<template>
  <SvgIcon
    name="plus"
    dataTestId="svg-icon"
  />
</template>
    `,
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      description:
        'Nazwa pliku SVG bez rozszerzenia. Komponent szuka ikony w katalogu src/assets/icons.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Opcjonalny atrybut data-testid przypinany do wyrenderowanej ikony.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: undefined },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SvgIconComponent>;

export const SvgIcon: Story = {
  render: (args) => ({
    components: { SvgIconComponent, StoryContent },
    setup() {
      return {
        args,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div
          style="
            display:flex;
            min-height:120px;
            align-items:center;
            justify-content:center;
            padding:24px;
          "
        >
          <SvgIconComponent
            v-if="args.name"
            v-bind="args"
          />

          <div
            v-else
            style="
              max-width:420px;
              color:#475569;
              font-size:14px;
              line-height:1.5;
              text-align:center;
            "
          >
            Ustaw prop <code>name</code> zgodnie z nazwa pliku SVG z katalogu
            <code>src/assets/icons</code>.
          </div>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    name: 'plus',
    dataTestId: 'svg-icon',
  },
};

export const IconsGallery: Story = {
  render: () => ({
    components: { SvgIconComponent, StoryContent, CardPanelComponent },
    setup() {
      const settings = getSettings(meta);
      const copiedName = ref<string | null>(null);
      let resetTimeout: number | undefined;

      const copyName = async (iconName: string) => {
        await copyTextToClipboard(iconName);
        copiedName.value = iconName;

        window.clearTimeout(resetTimeout);
        resetTimeout = window.setTimeout(() => {
          copiedName.value = null;
        }, 1500);
      };

      return {
        settings,
        iconNames,
        copiedName,
        copyName,
      };
    },
    template: `
      <StoryContent :settings>
        <div
          style="
            display:grid;
            grid-template-columns:repeat(4, minmax(0, 1fr));
            gap:16px;
          "
        >
          <CardPanelComponent
            v-for="iconName in iconNames"
            :key="iconName"
            as="article"
            size="s"
            backgroundColor="default"
            borderColor="grey"
            :isHoverEnabled="false"
            :isShadowEnabled="false"
            :ariaLabel="\`Ikona \${iconName}\`"
          >
            <div
              style="
                display:flex;
                min-height:148px;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                gap:12px;
                text-align:center;
              "
            >
              <div
                style="
                  display:flex;
                  min-height:40px;
                  align-items:center;
                  justify-content:center;
                "
              >
                <SvgIconComponent :name="iconName" />
              </div>

              <code
                style="
                  font-size:12px;
                  line-height:1.4;
                  word-break:break-word;
                "
              >
                {{ iconName }}
              </code>

              <button
                type="button"
                :aria-label="\`Skopiuj nazwe ikony \${iconName}\`"
                @click="copyName(iconName)"
                style="
                  cursor:pointer;
                  border:1px solid #cbd5e1;
                  border-radius:8px;
                  background:#fff;
                  padding:6px 10px;
                  color:#0f172a;
                  font-size:12px;
                  line-height:1.2;
                "
              >
                {{ copiedName === iconName ? 'Skopiowano' : 'Kopiuj nazwe' }}
              </button>
            </div>
          </CardPanelComponent>
        </div>
      </StoryContent>
    `,
  }),
};
