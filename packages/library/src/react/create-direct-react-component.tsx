/** @jsxImportSource react */
import {
  createElement,
  forwardRef,
  type ComponentType,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
} from 'react';
import type { PeauiReactProps, ReactComponentName } from './generated-react-props';

export type DirectRendererProps<
  Name extends ReactComponentName,
  Handle = HTMLElement,
> = PeauiReactProps<Name> & {
  forwardedRef?: ForwardedRef<Handle>;
  __name?: Name;
};

/** Creates a public, ref-aware component without importing the shared renderer registry. */
export function createDirectReactComponent<Name extends ReactComponentName, Handle = HTMLElement>(
  name: Name,
  Renderer: ComponentType<DirectRendererProps<Name, Handle>>,
): ForwardRefExoticComponent<PropsWithoutRef<PeauiReactProps<Name>> & RefAttributes<Handle>> {
  const Component = forwardRef<Handle, PeauiReactProps<Name>>((props, ref) =>
    createElement(Renderer, {
      ...(props as PeauiReactProps<Name>),
      __name: name,
      forwardedRef: ref,
    }),
  );

  Component.displayName = name;
  return Component as ForwardRefExoticComponent<
    PropsWithoutRef<PeauiReactProps<Name>> & RefAttributes<Handle>
  >;
}
