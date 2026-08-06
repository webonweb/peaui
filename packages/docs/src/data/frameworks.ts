import type { FrameworkId } from '../types';
import { localize } from '../i18n';

export interface FrameworkDefinition {
  id: FrameworkId;
  label: string;
  shortLabel: string;
  compactLabel: string;
  badge: string;
  description: string;
  availability: string;
}

type LocalizedFrameworkDefinition = Omit<FrameworkDefinition, 'availability' | 'description'> & {
  availability: { en: string; pl: string };
  description: { en: string; pl: string };
};

export const frameworkOrder: FrameworkId[] = ['vue', 'react', 'web-components'];

const frameworkDefinitions: Record<FrameworkId, LocalizedFrameworkDefinition> = {
  vue: {
    id: 'vue',
    label: 'Vue',
    shortLabel: 'Vue',
    compactLabel: 'Vue',
    badge: 'Vue 3',
    description: {
      en: 'The primary, complete library API with interactive examples and full API reference.',
      pl: 'Główne, kompletne API biblioteki z interaktywnymi przykładami i pełnym API.',
    },
    availability: { en: 'Stable', pl: 'Stabilne' },
  },
  react: {
    id: 'react',
    label: 'React',
    shortLabel: 'React',
    compactLabel: 'React',
    badge: 'React 19',
    description: {
      en: 'A complete catalog of 62 native React components with the same API, appearance and behavior as Vue.',
      pl: 'Pełny katalog 62 natywnych komponentów React z tym samym API, wyglądem i zachowaniem co Vue.',
    },
    availability: { en: 'Stable', pl: 'Stabilne' },
  },
  'web-components': {
    id: 'web-components',
    label: 'Web Components',
    shortLabel: 'Web Components',
    compactLabel: 'WC',
    badge: 'Custom Elements',
    description: {
      en: 'A complete Custom Elements catalog with rendering and behavior matching the Vue components 1:1.',
      pl: 'Pełny katalog Custom Elements z renderingiem i zachowaniem zgodnym 1:1 z komponentami Vue.',
    },
    availability: { en: 'Stable', pl: 'Stabilne' },
  },
};

export function getFrameworkDefinition(id: FrameworkId): FrameworkDefinition {
  const definition = frameworkDefinitions[id];
  return {
    ...definition,
    availability: localize(definition.availability),
    description: localize(definition.description),
  };
}

export const frameworks = Object.fromEntries(
  frameworkOrder.map((id) => [id, getFrameworkDefinition(id)]),
) as Record<FrameworkId, FrameworkDefinition>;

export function normalizeFramework(value: unknown): FrameworkId {
  const framework = String(value ?? 'vue');
  return frameworkOrder.includes(framework as FrameworkId) ? (framework as FrameworkId) : 'vue';
}

export function frameworkPath(framework: FrameworkId, suffix = 'start'): string {
  return `/${framework}/${suffix}`;
}
