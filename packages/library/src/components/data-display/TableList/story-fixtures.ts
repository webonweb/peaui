export const tableListStoryRecords = [
  {
    id: '1',
    name: 'Wniosek Alfa',
    updatedAt: '2026-08-04',
    isPublished: true,
    status: 'Aktywny',
    owners: ['Anna Nowak', 'Jan Kowalski'],
    resourceLink: 'Szczegóły rekordu',
    progress: 3,
    category: 'Formalny',
    limit: 12,
  },
  {
    id: '2',
    name: 'Wniosek Beta',
    updatedAt: '2026-07-28',
    isPublished: false,
    status: 'Roboczy',
    owners: ['Ola Baran'],
    resourceLink: 'Podgląd sprawy',
    progress: 1,
    category: 'Techniczny',
    limit: 6,
  },
  {
    id: '3',
    name: 'Wniosek Gamma',
    updatedAt: '2026-07-21',
    isPublished: true,
    status: 'Do weryfikacji',
    owners: ['Jan Kowalski'],
    resourceLink: 'Zobacz wpis',
    progress: 2,
    category: 'Kontrola',
    limit: 9,
  },
];

const statusDictionary = {
  Aktywny: 'green',
  Roboczy: 'orange',
  'Do weryfikacji': 'blue',
};

export function resolveTableListStoryActions() {
  return [
    { key: 'preview', label: 'Podgląd', icon: 'eye' },
    { key: 'edit', label: 'Edytuj', icon: 'edit' },
    { key: 'delete', label: 'Usuń', icon: 'cross' },
  ];
}

export function resolveTableListStorySteps(record: Record<string, unknown>) {
  const progress = Number(record.progress ?? 0);
  let verificationStatus = 'disabled';

  if (progress >= 3) {
    verificationStatus = 'complete';
  } else if (progress >= 2) {
    verificationStatus = 'current';
  }

  return [
    { key: 'data', label: 'Dane', status: progress >= 1 ? 'complete' : 'current' },
    {
      key: 'verification',
      label: 'Weryfikacja',
      status: verificationStatus,
    },
    { key: 'publication', label: 'Publikacja', status: progress >= 3 ? 'complete' : 'disabled' },
  ];
}

export const tableListStoryColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    canCopy: true,
    canSort: true,
    hint: true,
    hintColumn: 'Pełna nazwa rekordu.',
    width: 220,
  },
  { key: 'updatedAt', label: 'Aktualizacja', type: 'date', canSort: true, width: 160 },
  { key: 'status', label: 'Status', type: 'tag', statusDictionary, width: 150 },
  { key: 'actions', label: 'Akcje', resolve: resolveTableListStoryActions, width: 90 },
];

export const tableListAllTypeColumns = [
  { key: 'index', label: 'Lp.', type: 'index', width: 72 },
  ...tableListStoryColumns.slice(0, 3),
  { key: 'isPublished', label: 'Opublikowany', type: 'status', width: 140 },
  { key: 'owners', label: 'Opiekunowie', type: 'array', width: 210 },
  { key: 'resourceLink', label: 'Powiązanie', type: 'link', width: 180 },
  {
    key: 'open',
    label: 'Szybka akcja',
    type: 'action',
    actionName: 'preview',
    actionLabel: 'Otwórz',
    width: 130,
  },
  {
    key: 'editAction',
    label: 'Edycja inline',
    type: 'editAction',
    actionName: 'edit-inline',
    actionLabel: 'Edytuj',
    width: 150,
  },
  { key: 'placeholder', label: 'Rezerwa', type: 'empty', width: 100 },
  { key: 'actions', label: 'Akcje', resolve: resolveTableListStoryActions, width: 90 },
];

export const tableListWorkflowColumns = [
  tableListStoryColumns[0],
  {
    key: 'stepper',
    label: 'Etapy',
    type: 'stepper',
    steps: resolveTableListStorySteps,
    width: 360,
  },
  { key: 'status', label: 'Szczegóły', type: 'expandable', width: 140 },
];

export const tableListEditableColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: 220,
    manage: { type: 'text', required: true, maxLength: 80, placeholder: 'Podaj nazwę' },
  },
  {
    key: 'limit',
    label: 'Limit',
    type: 'number',
    width: 120,
    manage: { type: 'number', integer: true, min: 0, max: 100, step: 1 },
  },
  {
    key: 'category',
    label: 'Kategoria',
    type: 'text',
    width: 170,
    manage: {
      type: 'select',
      required: true,
      options: [
        { label: 'Formalny', value: 'Formalny' },
        { label: 'Techniczny', value: 'Techniczny' },
        { label: 'Kontrola', value: 'Kontrola' },
      ],
    },
  },
];
