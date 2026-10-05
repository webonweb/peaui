import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import CardPanel from './index';

const meta = {
  title: 'React/layout/CardPanel',
  component: CardPanel,
  args: getReactStoryArgs('CardPanel'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CardPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Link: Story = { args: { as: 'a', href: '#orders', children: 'Wszystkie zamówienia' } };

export const WithHeader: Story = { args: { header: 'Zamówienia', children: 'Lista zamówień' } };
