/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';

import { getReactStoryArgs } from '@/react/story-args';
import FullscreenContainer from './index';
import ButtonAction from '@/components/data-entry/ButtonAction/index';

const meta = {
  title: 'React/layout/FullscreenContainer',
  component: FullscreenContainer,
  args: getReactStoryArgs('FullscreenContainer'),
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FullscreenContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const KeyboardInteraction: Story = {
  render: (args) => (
    <div>
      <ButtonAction>Przed kontenerem</ButtonAction>
      <FullscreenContainer {...args}>
        <ButtonAction>Akcja w kontenerze</ButtonAction>
        <p>
          Po otwarciu pełnego ekranu Tab pozostaje wewnątrz. Escape zamyka widok i przywraca fokus.
        </p>
      </FullscreenContainer>
      <ButtonAction>Za kontenerem</ButtonAction>
    </div>
  ),
};
