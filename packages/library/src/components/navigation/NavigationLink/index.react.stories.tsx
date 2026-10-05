import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import NavigationLink from './index';

const meta = {
  title: 'React/navigation/NavigationLink',
  component: NavigationLink,
  args: getReactStoryArgs('NavigationLink'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NavigationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DownloadLink: Story = {
  args: {
    path: '#report',
    children: 'Download report',
    target: '_blank',
    rel: 'noopener',
    download: 'report.txt',
  },
};
