import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import Breadcrumbs from './index';

const meta = {
  title: 'React/navigation/Breadcrumbs',
  component: Breadcrumbs,
  args: getReactStoryArgs('Breadcrumbs'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
