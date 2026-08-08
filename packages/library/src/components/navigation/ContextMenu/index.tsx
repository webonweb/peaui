import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

import { createPeauiReactComponent } from '@/react/create-peaui-react-component';
import type { PeauiReactProps } from '@/react/generated-react-props';

export type ContextMenuProps = PeauiReactProps<'ContextMenu'>;
export type ContextMenuHandle = HTMLElement & {
  openAt(point: { x: number; y: number; context?: unknown }): boolean;
  close(): void;
};

const ContextMenu = createPeauiReactComponent(
  'ContextMenu',
) as unknown as ForwardRefExoticComponent<
  PropsWithoutRef<ContextMenuProps> & RefAttributes<ContextMenuHandle>
>;

export default ContextMenu;
