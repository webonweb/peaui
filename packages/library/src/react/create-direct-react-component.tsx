/** @jsxImportSource react */
import {
  createElement,
  forwardRef,
  type ComponentType,
  type CSSProperties,
  type ForwardedRef,
  type ReactNode,
} from 'react';

type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

type DirectRenderer = ComponentType<RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }>;

/** Creates a public, ref-aware component without importing the shared renderer registry. */
export function createDirectReactComponent(
  name: string,
  renderer: unknown,
): ComponentType<RuntimeProps> {
  const Renderer = renderer as DirectRenderer;
  const Component = forwardRef<HTMLElement, RuntimeProps>((props, ref) =>
    createElement(Renderer, { ...props, __name: name, forwardedRef: ref }),
  );

  Component.displayName = name;
  return Component;
}
