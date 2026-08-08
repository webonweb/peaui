import { frameworkOrder } from '../data/frameworks';
import type { FrameworkId } from '../types';

export const FRAMEWORK_STORAGE_KEY = 'peaui-docs-framework';

export function isFrameworkId(value: unknown): value is FrameworkId {
  return frameworkOrder.includes(value as FrameworkId);
}

export function getPreferredFramework(): FrameworkId | null {
  if (typeof localStorage === 'undefined') return null;
  const saved = localStorage.getItem(FRAMEWORK_STORAGE_KEY);
  return isFrameworkId(saved) ? saved : null;
}

export function setPreferredFramework(framework: FrameworkId): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(FRAMEWORK_STORAGE_KEY, framework);
}
