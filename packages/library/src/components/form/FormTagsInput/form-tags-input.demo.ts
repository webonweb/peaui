export const formTagsInputDemoSuggestions = [
  'Vue',
  'React',
  'Web Components',
  'TypeScript',
  'Dostępność',
  'Design system',
] as const;

export const formTagsInputDemoProps = {
  id: 'technologies',
  name: 'technologies',
  label: 'Technologie',
  description: 'Dodaj maksymalnie sześć technologii. Zatwierdź Enterem lub przecinkiem.',
  placeholder: 'Dodaj technologię',
  value: ['Vue', 'React'],
  suggestions: formTagsInputDemoSuggestions,
  max: 6,
} as const;

export const formTagsInputLongLabel =
  'Technologie, standardy dostępności i narzędzia używane przez wielojęzyczny zespół produktu';
