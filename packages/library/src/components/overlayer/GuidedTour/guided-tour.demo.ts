import type { GuidedTourStep } from './guided-tour.shared';

export const guidedTourDemoSteps: GuidedTourStep[] = [
  {
    id: 'search',
    target: '[data-tour-target="search"]',
    title: 'Find anything quickly',
    description: 'Use search to jump directly to the information you need.',
    placement: 'bottom',
  },
  {
    id: 'actions',
    target: '[data-tour-target="actions"]',
    title: 'Continue your workflow',
    description: 'The most important actions stay available in this area.',
    placement: 'left',
  },
];
