import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { getReactStoryArgs } from '@/react/story-args';
import CardCarousel from './index';
import ButtonAction from '../../data-entry/ButtonAction';

const meta = {
  title: 'React/data-display/CardCarousel',
  component: CardCarousel,
  args: getReactStoryArgs('CardCarousel'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CardCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DynamicSlides: Story = {
  render: function DynamicSlides() {
    const [cards, setCards] = useState(['A', 'B', 'C']);
    return (
      <div>
        <ButtonAction onClick={() => setCards(['A', 'X'])}>Zaktualizuj karty</ButtonAction>
        <CardCarousel defaultVisibleSlides={1}>
          {cards.map((key) => (
            <article key={key}>Karta {key}</article>
          ))}
        </CardCarousel>
      </div>
    );
  },
};

export const WithAnimation: Story = {
  args: { withAnimation: true, defaultVisibleSlides: 1, animationDelay: 2000 },
};
