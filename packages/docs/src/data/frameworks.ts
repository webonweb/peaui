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
      en: 'Native Vue 3 components with Composition API and TypeScript.',
      pl: 'Natywne komponenty Vue 3 wykorzystujące Composition API i TypeScript.',
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
      en: 'Native React components with fully typed APIs.',
      pl: 'Natywne komponenty React z w pełni typowanym API.',
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
      en: 'Framework-independent custom elements powered by the same design system.',
      pl: 'Niezależne od frameworka custom elements oparte na tym samym systemie projektowym.',
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
