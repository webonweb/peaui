import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import NavigationCard from './index';

const meta = {
  title: 'React/navigation/NavigationCard',
  component: NavigationCard,
  args: getReactStoryArgs('NavigationCard'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DownloadLink: Story = {
  args: {
    path: '#report',
    title: 'Download report',
    description: 'Report file',
    target: '_blank',
    rel: 'noopener',
    download: 'report.txt',
  },
};
