import { t, type TranslationKey } from '../i18n';
import type { DemoVariant } from '../types';
import { localizeDemoData } from './demo-localization';

function resolveActions() {
  return [
    { key: 'preview', label: 'Podgląd', icon: 'eye' },
    { key: 'edit', label: 'Edytuj', icon: 'edit' },
    { key: 'delete', label: 'Usuń', icon: 'cross' },
  ];
}

const statusDictionary = {
  Aktywny: 'green',
  Roboczy: 'orange',
  'Do weryfikacji': 'blue',
};

const records = [
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

const baseColumns = [
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
  {
    key: 'status',
    label: 'Status',
    type: 'tag',
    statusDictionary,
    width: 150,
  },
  { key: 'actions', label: 'Akcje', resolve: resolveActions, width: 90 },
];

const allColumnTypes = [
  { key: 'index', label: 'Lp.', type: 'index', width: 72 },
  ...baseColumns.slice(0, 3),
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
    key: 'status',
    label: 'Edycja inline',
    type: 'editAction',
    actionName: 'edit-inline',
    actionLabel: 'Edytuj',
    width: 150,
  },
  { key: 'placeholder', label: 'Rezerwa', type: 'empty', width: 100 },
];

function steps(record: Record<string, unknown>) {
  const progress = Number(record.progress ?? 0);
  return [
    { key: 'draft', label: 'Dane', status: progress >= 1 ? 'complete' : 'current' },
    {
      key: 'verification',
      label: 'Weryfikacja',
      status: progress >= 3 ? 'complete' : progress >= 2 ? 'current' : 'disabled',
    },
    { key: 'publication', label: 'Publikacja', status: progress >= 3 ? 'complete' : 'disabled' },
  ];
}

function variant(
  id: string,
  labelKey: TranslationKey,
  descriptionKey: TranslationKey,
  props: Record<string, unknown>,
): DemoVariant {
  return {
    id,
    label: t(labelKey),
    description: t(descriptionKey),
    props: localizeDemoData(props),
  };
}

export function getTableListDemoVariants(baseProps: Record<string, unknown>): DemoVariant[] {
  const common = {
    ...baseProps,
    id: 'applications',
    ariaLabel: 'Tabela wniosków',
    canCreate: false,
    columns: baseColumns,
    records,
  };

  return [
    variant('default', 'demo.default', 'tableList.demo.default', common),
    variant('row-selection', 'tableList.demo.selectionLabel', 'tableList.demo.selection', {
      ...common,
      canSelectRows: true,
      selectedRows: ['2'],
    }),
    variant('single-choice', 'tableList.demo.singleLabel', 'tableList.demo.single', {
      ...common,
      canSelectRows: false,
      canCheckRows: true,
      currentCheckedRow: '2',
    }),
    variant('multi-sort', 'tableList.demo.sortLabel', 'tableList.demo.sort', {
      ...common,
      canMultiSort: true,
      sortColumns: [{ name: 'ASC' }, { updatedAt: 'DESC' }],
      scroll: true,
    }),
    variant('column-types', 'tableList.demo.typesLabel', 'tableList.demo.types', {
      ...common,
      columns: allColumnTypes,
      scroll: true,
    }),
    variant('workflow', 'tableList.demo.workflowLabel', 'tableList.demo.workflow', {
      ...common,
      columns: [
        baseColumns[0],
        { key: 'stepper', label: 'Etapy', type: 'stepper', steps, width: 360 },
        { key: 'status', label: 'Szczegóły', type: 'expandable', width: 140 },
      ],
      isDetials: true,
    }),
    variant('column-layout', 'tableList.demo.layoutLabel', 'tableList.demo.layout', {
      ...common,
      columns: [
        { ...allColumnTypes[0], withLock: true },
        { ...baseColumns[0], withLock: true, border: 'right' },
        ...baseColumns.slice(1, 3),
        allColumnTypes[5],
        baseColumns[3],
      ],
      scroll: true,
    }),
    variant('column-visibility', 'tableList.demo.visibilityLabel', 'tableList.demo.visibility', {
      ...common,
      canHideColumns: true,
      columns: [
        { ...baseColumns[0], withLock: true },
        baseColumns[1],
        baseColumns[2],
        allColumnTypes[5],
        baseColumns[3],
      ],
    }),
    variant('editable', 'tableList.demo.editableLabel', 'tableList.demo.editable', {
      ...common,
      canCreate: true,
      canSelectRows: false,
      editable: true,
      columns: [
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
      ],
    }),
    variant('actions', 'tableList.demo.actionsLabel', 'tableList.demo.actions', {
      ...common,
      columns: [baseColumns[0], allColumnTypes[6], allColumnTypes[7], baseColumns[3]],
    }),
    variant('empty', 'tableList.demo.emptyLabel', 'tableList.demo.empty', {
      ...common,
      canCreate: true,
      emptyDescriptionInline: 'Brak rekordów spełniających kryteria.',
      records: [],
    }),
    variant('loading', 'tableList.demo.loadingLabel', 'tableList.demo.loading', {
      ...common,
      isLoading: true,
      scroll: true,
    }),
  ];
}
