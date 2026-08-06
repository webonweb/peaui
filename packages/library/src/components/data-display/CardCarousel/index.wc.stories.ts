import { createStoryContent } from '@peaui/storybook-shell/src/components';
import type { Meta, StoryObj } from '@storybook/web-components';

import { CardCarouselElement, defineCardCarousel } from './index.wc';

defineCardCarousel();

const demoCards = [
  {
    category: 'Analiza',
    title: 'Bilans roczny',
    content: 'Zestawienie wskaznikow i podstawowych danych dla calego okresu.',
  },
  {
    category: 'Projekt',
    title: 'Modernizacja',
    content: 'Pakiet zmian z naciskiem na efektywnosc i przewidywany koszt.',
  },
  {
    category: 'Raport',
    title: 'Kontrola terenowa',
    content: 'Podsumowanie wynikow inspekcji z ostatniego etapu prac.',
  },
  {
    category: 'Dokument',
    title: 'Wytyczne',
    content: 'Zbior zasad i ograniczen dla zespolu wdrozeniowego.',
  },
  {
    category: 'Zestaw',
    title: 'Porownanie wariantow',
    content: 'Wspolne kryteria dla trzech mozliwych scenariuszy realizacji.',
  },
  {
    category: 'Monitoring',
    title: 'Stan wdrozenia',
    content: 'Aktualny postep z rozbiciem na glowne obszary odpowiedzialnosci.',
  },
];

type CardCarouselStoryArgs = {
  animationDelay?: number;
  ariaLabel?: string;
  dataTestId?: string;
  defaultVisibleSlides?: number;
  defualtVisibleSlides?: number;
  isNavigationDotsVisible?: boolean;
  isNavigationVisible?: boolean;
  withAnimation?: boolean;
};

const meta = {
  title: '2. Data Display/CardCarousel',
  component: CardCarouselElement.tagName,
  parameters: {
    name: 'CardCarousel',
    description:
      'Karuzela kart z przewijaniem poziomym, obsluga klawiatury, pointer drag oraz nawigacja przyciskami i kropkami.',
    code: `
<script type="module">
  import "@peaui/ui/data-display/CardCarousel";
</script>

<peaui-card-carousel aria-label="Karuzela kart" data-testid="card-carousel">
  <article
    style="display:grid; gap:0.75rem; padding:1rem; border:1px solid var(--peaui-color-grey-200); border-radius:0.75rem; background-color:var(--peaui-color-grey-0);"
  >
    <p>Krotki opis pierwszej karty.</p>
  </article>
</peaui-card-carousel> 
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Etykieta aria-label regionu karuzeli.',
      table: { type: { summary: 'string | undefined' } },
    },
    animationDelay: {
      control: { type: 'number' },
      description: 'Czas w milisekundach pomiedzy automatycznym przejsciem do kolejnego widoku.',
      table: { type: { summary: 'number | undefined' } },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid dla karuzeli i elementow sterowania.',
      table: { type: { summary: 'string | undefined' } },
    },
    defaultVisibleSlides: {
      control: { type: 'number' },
      description: 'Docelowa liczba widocznych kart na szerokich ekranach.',
      table: { type: { summary: 'number | undefined' } },
    },
    isNavigationDotsVisible: {
      control: { type: 'boolean' },
      description: 'Pokazuje lub ukrywa paginacje w formie kropek.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    isNavigationVisible: {
      control: { type: 'boolean' },
      description: 'Pokazuje lub ukrywa przyciski poprzednia/nastepna.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    withAnimation: {
      control: { type: 'boolean' },
      description: 'Automatycznie przewija karuzele co 2 sekundy o jeden widok.',
      table: { type: { summary: 'boolean | undefined' } },
    },
  },
} satisfies Meta<CardCarouselStoryArgs>;

export default meta;

type Story = StoryObj<CardCarouselStoryArgs>;

function getSettings(storyMeta: Meta<CardCarouselStoryArgs>) {
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

function createCard(card: (typeof demoCards)[number]): HTMLElement {
  const article = document.createElement('article');
  const badge = document.createElement('span');
  const title = document.createElement('strong');
  const content = document.createElement('p');

  article.style.display = 'grid';
  article.style.gap = '0.75rem';
  article.style.padding = '1rem';
  article.style.border = '1px solid var(--peaui-color-grey-200)';
  article.style.borderRadius = '0.75rem';
  article.style.backgroundColor = 'var(--peaui-color-grey-0)';
  article.style.boxShadow =
    '0 0 0 1px color-mix(in srgb, var(--peaui-color-grey-100) 60%, transparent)';

  title.textContent = card.title;
  title.style.fontSize = '1rem';
  title.style.lineHeight = '1.5rem';
  title.style.color = 'var(--peaui-color-grey-800)';

  content.textContent = card.content;
  content.style.margin = '0';
  content.style.color = 'var(--peaui-color-grey-600)';

  article.append(title, content);

  return article;
}

function createCardCarousel(
  args: Partial<CardCarouselStoryArgs> = {},
  cards = demoCards,
): CardCarouselElement {
  const element = document.createElement(CardCarouselElement.tagName) as CardCarouselElement;
  element.style.width = '100%';
  element.style.maxWidth = '100%';
  element.style.minWidth = '0';

  if (args.ariaLabel !== undefined) {
    element.ariaLabel = args.ariaLabel;
  }

  if (args.animationDelay !== undefined) {
    element.animationDelay = args.animationDelay;
  }

  if (args.dataTestId !== undefined) {
    element.dataTestId = args.dataTestId;
  }

  if (args.defaultVisibleSlides !== undefined) {
    element.defaultVisibleSlides = args.defaultVisibleSlides;
  }

  if (args.defualtVisibleSlides !== undefined) {
    element.defualtVisibleSlides = args.defualtVisibleSlides;
  }

  if (args.isNavigationDotsVisible !== undefined) {
    element.isNavigationDotsVisible = args.isNavigationDotsVisible;
  }

  if (args.isNavigationVisible !== undefined) {
    element.isNavigationVisible = args.isNavigationVisible;
  }

  if (args.withAnimation !== undefined) {
    element.withAnimation = args.withAnimation;
  }

  cards.forEach((card) => {
    element.appendChild(createCard(card));
  });

  return element;
}

function createRender(cards = demoCards) {
  return (args: Partial<CardCarouselStoryArgs>) =>
    createStoryContent({
      settings: getSettings(meta),
      preview: (() => {
        const wrapper = document.createElement('div');

        wrapper.style.padding = '1.5rem';
        wrapper.style.boxSizing = 'border-box';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '100%';
        wrapper.style.minWidth = '0';
        wrapper.appendChild(createCardCarousel(args, cards));

        return wrapper;
      })(),
    });
}

export const CardCarousel: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Karuzela kart z przykladami',
    animationDelay: 2000,
    dataTestId: 'card-carousel',
    defaultVisibleSlides: 4,
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
    withAnimation: false,
  },
};

export const SingleVisibleSlide: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Karuzela kart z pojedynczym widokiem',
    animationDelay: 2000,
    dataTestId: 'card-carousel-single',
    defaultVisibleSlides: 1,
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
    withAnimation: false,
  },
};

export const WithoutDots: Story = {
  render: createRender(demoCards.slice(0, 5)),
  args: {
    ariaLabel: 'Karuzela kart bez kropek',
    animationDelay: 2000,
    dataTestId: 'card-carousel-without-dots',
    defaultVisibleSlides: 3,
    isNavigationDotsVisible: false,
    isNavigationVisible: true,
    withAnimation: false,
  },
};

export const WithoutArrowsWithDots: Story = {
  render: createRender(demoCards.slice(0, 5)),
  args: {
    ariaLabel: 'Karuzela kart tylko z kropkami',
    animationDelay: 2000,
    dataTestId: 'card-carousel-without-arrows',
    defaultVisibleSlides: 3,
    isNavigationDotsVisible: true,
    isNavigationVisible: false,
    withAnimation: false,
  },
};

export const WithAnimation: Story = {
  render: createRender(demoCards.slice(0, 5)),
  args: {
    ariaLabel: 'Karuzela kart z autoplay',
    animationDelay: 2000,
    dataTestId: 'card-carousel-with-animation',
    defaultVisibleSlides: 3,
    isNavigationDotsVisible: true,
    isNavigationVisible: true,
    withAnimation: true,
  },
};
