import type { ComponentType } from 'react';
import type { Component } from 'vue';

export interface ApiEntry {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface NamedApiEntry {
  name: string;
  description: string;
}

export interface ComponentApi {
  name: string;
  category: string;
  categoryLabel: string;
  importPath: string;
  props: readonly ApiEntry[];
  models: readonly ApiEntry[];
  events: readonly NamedApiEntry[];
  slots: readonly NamedApiEntry[];
}

export type FrameworkId = 'vue' | 'react' | 'web-components';

export interface FrameworkComponentApi extends ComponentApi {
  framework: FrameworkId;
  sourceName: string;
  tagName?: string;
  status: 'stable' | 'experimental';
}

export interface ComponentCopy {
  description: string;
  purpose: string[];
  input: string;
}

export interface ComponentDefinition extends ComponentApi {
  component: Component;
  slug: string;
  copy: ComponentCopy;
}

export interface FrameworkComponentDefinition extends FrameworkComponentApi {
  component?: Component;
  reactComponent?: ComponentType<Record<string, unknown>>;
  slug: string;
  copy: ComponentCopy;
}

export interface DemoPreset {
  props?: Record<string, unknown>;
  defaultSlot?: string | string[];
  slots?: Record<string, string>;
}

export interface DemoVariant {
  id: string;
  label: string;
  description: string;
  props: Record<string, unknown>;
}
