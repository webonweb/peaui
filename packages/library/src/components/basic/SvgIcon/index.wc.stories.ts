import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { SvgIconElement, defineSvgIcon } from './index.wc';

defineSvgIcon();

const iconModules = import.meta.glob('../../../assets/icons/*.svg');
const iconNames = Object.keys(iconModules)
  .map((path) => path.split('/').pop()?.replace('.svg', ''))
  .filter((name): name is string => Boolean(name))
  .sort((left, right) => left.localeCompare(right))
  .concat([
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
  ]);

type SvgIconStoryArgs = {
  dataTestId?: string;
  name: string;
};

const meta = {
  title: '1. Basic/SvgIcon',
  component: SvgIconElement.tagName,
  parameters: {
    name: 'SvgIcon',
    description:
      'Komponent SvgIcon laduje ikone SVG dynamicznie na podstawie propu `name`. ' +
      'Pogrupowany katalog zawiera 1348 ikon PeaUI Outline Icons Mega 0.3.0. ' +
      'Wartosc propu musi odpowiadac nazwie pliku w katalogu `src/assets/icons`, bez rozszerzenia, ' +
      'np. `plus` dla ikony zgodnosci albo `core/sparkles` dla pogrupowanego katalogu PEAUI.',
    code: `
<script type="module">
  import "@peaui/ui/basic/SvgIcon";
</script>

<peaui-svg-icon
  name="plus"
  data-testid="svg-icon"
></peaui-svg-icon>
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
} satisfies Meta<SvgIconStoryArgs>;

export default meta;

type Story = StoryObj<SvgIconStoryArgs>;

function getSettings(storyMeta: Meta<SvgIconStoryArgs>) {
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

function createSvgIcon(args: Partial<SvgIconStoryArgs> = {}): SvgIconElement {
  const element = document.createElement(SvgIconElement.tagName) as SvgIconElement;

  if (args.name !== undefined) {
    element.name = args.name;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  return element;
}

function createEmptyState(): HTMLDivElement {
  const element = document.createElement('div');

  element.style.maxWidth = '420px';
  element.style.color = '#475569';
  element.style.fontSize = '14px';
  element.style.lineHeight = '1.5';
  element.style.textAlign = 'center';
  element.innerHTML =
    'Ustaw prop <code>name</code> zgodnie z nazwa pliku SVG z katalogu <code>src/assets/icons</code>.';

  return element;
}

function createPreviewWrapper(content: Node): HTMLDivElement {
  const wrapper = document.createElement('div');

  wrapper.style.display = 'flex';
  wrapper.style.minHeight = '120px';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.padding = '24px';
  wrapper.appendChild(content);

  return wrapper;
}

async function copyTextToClipboard(text: string): Promise<void> {
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
}

export const SvgIcon: Story = {
  render: (args) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: createPreviewWrapper(args.name ? createSvgIcon(args) : createEmptyState()),
    }),
  args: {
    name: 'plus',
    dataTestId: 'svg-icon',
  },
};

export const IconsGallery: Story = {
  render: () => {
    const preview = document.createElement('div');

    preview.style.display = 'grid';
    preview.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
    preview.style.gap = '16px';

    for (const iconName of iconNames) {
      const card = document.createElement('article');
      const iconWrapper = document.createElement('div');
      const code = document.createElement('code');
      const button = document.createElement('button');

      card.setAttribute('aria-label', `Ikona ${iconName}`);
      card.style.display = 'flex';
      card.style.minHeight = '148px';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'center';
      card.style.gap = '12px';
      card.style.border = '1px solid #d7dce5';
      card.style.borderRadius = '12px';
      card.style.background = '#ffffff';
      card.style.padding = '20px 16px';
      card.style.textAlign = 'center';

      iconWrapper.style.display = 'flex';
      iconWrapper.style.minHeight = '40px';
      iconWrapper.style.alignItems = 'center';
      iconWrapper.style.justifyContent = 'center';
      iconWrapper.appendChild(
        createSvgIcon({
          name: iconName,
        }),
      );

      code.textContent = iconName;
      code.style.fontSize = '12px';
      code.style.lineHeight = '1.4';
      code.style.wordBreak = 'break-word';

      button.type = 'button';
      button.setAttribute('aria-label', `Skopiuj nazwe ikony ${iconName}`);
      button.textContent = 'Kopiuj nazwe';
      button.style.cursor = 'pointer';
      button.style.border = '1px solid #cbd5e1';
      button.style.borderRadius = '8px';
      button.style.background = '#ffffff';
      button.style.padding = '6px 10px';
      button.style.color = '#0f172a';
      button.style.fontSize = '12px';
      button.style.lineHeight = '1.2';

      let resetTimeout: number | undefined;

      button.addEventListener('click', async () => {
        await copyTextToClipboard(iconName);
        button.textContent = 'Skopiowano';

        window.clearTimeout(resetTimeout);
        resetTimeout = window.setTimeout(() => {
          button.textContent = 'Kopiuj nazwe';
        }, 1500);
      });

      card.append(iconWrapper, code, button);
      preview.appendChild(card);
    }

    return createStoryContent({
      settings: getSettings(meta),
      preview,
    });
  },
};
