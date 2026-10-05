import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { ContextMenuRenderer } from '@/react/renderer-entries/context-menu.renderer-entry';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ContextMenuProps = PeauiReactProps<'ContextMenu'>;
export type ContextMenuHandle = HTMLElement & {
  openAt(point: { x: number; y: number; context?: unknown }): boolean;
  close(): void;
};

const ContextMenu = createDirectReactComponent(
  'ContextMenu',
  ContextMenuRenderer,
) as unknown as ForwardRefExoticComponent<
  PropsWithoutRef<ContextMenuProps> & RefAttributes<ContextMenuHandle>
>;

export default ContextMenu;
