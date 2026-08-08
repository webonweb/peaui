import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';

import TableListComponent from './index.vue';

const { getSettings } = useSettingsStorie();

const actionMenuItems = [
  { key: 'edit', label: 'Edytuj', icon: 'edit' },
  { key: 'copy', label: 'Kopiuj', icon: 'copy' },
  { key: 'delete', label: 'Usun', icon: 'cross' },
];

const selectOptions = [
  { label: 'Formalny', value: 'Formalny' },
  { label: 'Techniczny', value: 'Techniczny' },
  { label: 'Kontrola', value: 'Kontrola' },
];

const multiselectOptions = [
  { label: 'Warszawa', value: 'warszawa' },
  { label: 'Kraków', value: 'krakow' },
  { label: 'Łódź', value: 'lodz' },
  { label: 'Wrocław', value: 'wroclaw' },
  { label: 'Poznań', value: 'poznan' },
  { label: 'Gdańsk', value: 'gdansk' },
  { label: 'Szczecin', value: 'szczecin' },
  { label: 'Bydgoszcz', value: 'bydgoszcz' },
  { label: 'Lublin', value: 'lublin' },
  { label: 'Białystok', value: 'bialystok' },
  { label: 'Katowice', value: 'katowice' },
  { label: 'Gdynia', value: 'gdynia' },
  { label: 'Częstochowa', value: 'czestochowa' },
  { label: 'Radom', value: 'radom' },
  { label: 'Sosnowiec', value: 'sosnowiec' },
  { label: 'Toruń', value: 'torun' },
  { label: 'Kielce', value: 'kielce' },
  { label: 'Rzeszów', value: 'rzeszow' },
  { label: 'Gliwice', value: 'gliwice' },
  { label: 'Zabrze', value: 'zabrze' },
  { label: 'Olsztyn', value: 'olsztyn' },
  { label: 'Bielsko-Biała', value: 'bielsko_biala' },
  { label: 'Bytom', value: 'bytom' },
  { label: 'Zielona Góra', value: 'zielona_gora' },
  { label: 'Rybnik', value: 'rybnik' },
  { label: 'Ruda Śląska', value: 'ruda_slaska' },
  { label: 'Opole', value: 'opole' },
  { label: 'Tychy', value: 'tychy' },
  { label: 'Gorzów Wielkopolski', value: 'gorzow_wielkopolski' },
  { label: 'Elbląg', value: 'elblag' },
  { label: 'Płock', value: 'plock' },
  { label: 'Wałbrzych', value: 'walbrzych' },
];

const COLUMN_WIDTHS = {
  actions: 80,
  actionType: 120,
  array: 200,
  date: 160,
  empty: 100,
  editAction: 200,
  index: 80,
  link: 170,
  name: 220,
  number: 110,
  select: 160,
  status: 120,
  stepper: 220,
  tag: 160,
} as const;

const tagStatusDictionary = {
  Aktywny: 'green',
  Roboczy: 'orange',
  'Do weryfikacji': 'orange',
} as const;

function buildStepperSteps(record: Record<string, any>) {
  const progress = Number(record.progress ?? 0);

  return [
    {
      key: 'draft',
      label: 'Roboczy',
      status: progress >= 1 ? 'complete' : 'current',
    },
    {
      key: 'verification',
      label: 'Weryfikacja',
      status: progress >= 3 ? 'complete' : progress >= 2 ? 'current' : 'disabled',
    },
    {
      key: 'publication',
      label: 'Publikacja',
      status: progress >= 3 ? 'complete' : 'disabled',
    },
  ];
}

function buildStepperStepsWithSeparate(record: Record<string, any>) {
  return buildStepperSteps(record).map((step) =>
    step.key === 'publication'
      ? {
          ...step,
          isSeparate: true,
        }
      : step,
  );
}

function buildExpandableSteps(record: Record<string, any>) {
  const steps = buildStepperSteps(record);

  return steps.map((step) => {
    if (step.key !== 'verification') {
      return step;
    }

    return {
      ...step,
      collapse: {
        activeElements: Number(record.progress ?? 0) >= 2 ? 2 : 1,
        count: 3,
      },
    };
  });
}

const demoRecords = [
  {
    id: '1',
    name: 'Rekord Alfa',
    updatedAt: '2026-03-28',
    isPublished: true,
    workflowStatus: 'Aktywny',
    owners: ['Anna Nowak', 'Jan Kowalski'],
    resourceLink: 'Szczegoly rekordu',
    note: 'Komplet danych gotowy do publikacji.',
    progress: 2,
  },
  {
    id: '2',
    name: 'Rekord Beta',
    updatedAt: '2026-03-20',
    isPublished: false,
    workflowStatus: 'Roboczy',
    owners: ['Ola Baran'],
    resourceLink: 'Podglad sprawy',
    note: 'Wymaga jeszcze uzupelnienia danych.',
    progress: 1,
  },
  {
    id: '3',
    name: 'Rekord Gamma',
    updatedAt: '2026-03-11',
    isPublished: true,
    workflowStatus: 'Do weryfikacji',
    owners: ['Jan Kowalski', 'Anna Nowak'],
    resourceLink: 'Zobacz wpis',
    note: 'Czeka na akceptacje koncowa.',
    progress: 3,
  },
];

const editableRecords = [
  {
    id: '1',
    name: 'Wpis Alfa',
    limit: 12,
    category: 'Formalny',
    owners: ['Anna Nowak'],
  },
  {
    id: '2',
    name: 'Wpis Beta',
    limit: 6,
    category: 'Techniczny',
    owners: ['Jan Kowalski', 'Ola Baran'],
  },
];

function resolveDynamicCategoryOptions(record: Record<string, any>) {
  return Number(record.limit ?? 0) >= 10
    ? [
        { label: 'Formalny', value: 'Formalny' },
        { label: 'Techniczny', value: 'Techniczny' },
      ]
    : [
        { label: 'Kontrola', value: 'Kontrola' },
        { label: 'Monitoring', value: 'Monitoring' },
      ];
}

const editableDynamicRecords = [
  {
    id: '1',
    name: 'Wpis Alfa',
    limit: 12,
    category: 'Formalny',
  },
  {
    id: '2',
    name: 'Wpis Beta',
    limit: 6,
    category: 'Kontrola',
  },
];

const defaultColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    canCopy: true,
    canSort: true,
    hint: true,
    hintColumn: 'Pelna nazwa rekordu prezentowanego w tabeli.',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'updatedAt',
    label: 'Data aktualizacji',
    canSort: true,
    type: 'date',
    width: COLUMN_WIDTHS.date,
  },
  {
    key: 'isPublished',
    label: 'Opublikowany',
    type: 'status',
    width: COLUMN_WIDTHS.status,
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => actionMenuItems,
    width: COLUMN_WIDTHS.actions,
  },
];

const borderColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    border: 'right' as const,
    canCopy: true,
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'updatedAt',
    label: 'Data aktualizacji',
    type: 'date',
    width: COLUMN_WIDTHS.date,
  },
  {
    key: 'workflowStatus',
    label: 'Status workflow',
    border: 'left' as const,
    statusDictionary: tagStatusDictionary,
    type: 'tag',
    width: COLUMN_WIDTHS.tag,
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => actionMenuItems,
    width: COLUMN_WIDTHS.actions,
  },
];

const textColumns = [
  {
    key: 'name',
    label: 'Nazwa rekordu',
    canCopy: true,
    canSort: true,
    hint: true,
    hintColumn: 'Pelna nazwa obiektu.',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
];

const dateColumns = [
  {
    key: 'updatedAt',
    label: 'Data aktualizacji',
    canSort: true,
    type: 'date',
    width: COLUMN_WIDTHS.date,
  },
];

const statusColumns = [
  {
    key: 'isPublished',
    label: 'Opublikowany',
    type: 'status',
    width: COLUMN_WIDTHS.status,
  },
];

const tagColumns = [
  {
    key: 'workflowStatus',
    label: 'Status procesu',
    statusDictionary: tagStatusDictionary,
    type: 'tag',
    width: COLUMN_WIDTHS.tag,
  },
];

const arrayColumns = [
  {
    key: 'owners',
    label: 'Opiekunowie',
    type: 'array',
    width: COLUMN_WIDTHS.array,
  },
];

const linkColumns = [
  {
    key: 'resourceLink',
    label: 'Powiazanie',
    type: 'link',
    width: COLUMN_WIDTHS.link,
  },
];

const actionTypeColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'open',
    label: 'Szybka akcja',
    actionLabel: 'Otworz',
    type: 'action',
    width: COLUMN_WIDTHS.actionType,
  },
];

const editActionColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'workflowStatus',
    label: 'Status procesu',
    actionLabel: 'Edytuj inline',
    type: 'editAction',
    width: COLUMN_WIDTHS.editAction,
  },
];

const indexColumns = [
  {
    key: 'index',
    label: 'Lp.',
    type: 'index',
    width: COLUMN_WIDTHS.index,
  },
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
];

const emptyColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'placeholder',
    label: 'Rezerwa',
    type: 'empty',
    width: COLUMN_WIDTHS.empty,
  },
];

const stepperColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: 100,
  },
  {
    key: 'stepper',
    label: 'Etapy',
    type: 'stepper',
    steps: buildStepperSteps,
    width: 300,
  },
];

const expandableColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'stepper',
    label: 'Etapy',
    type: 'stepper',
    steps: buildExpandableSteps,
    width: COLUMN_WIDTHS.stepper,
  },
];

const expandableTypeColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'workflowStatus',
    label: 'Szczegoly',
    type: 'expandable',
    width: COLUMN_WIDTHS.tag,
  },
];

const actionsMenuColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => actionMenuItems,
    width: COLUMN_WIDTHS.actions,
  },
];

const lockableColumns = [
  {
    key: 'index',
    label: 'Lp.',
    type: 'index',
    width: COLUMN_WIDTHS.index,
    withLock: true,
  },
  {
    key: 'name',
    label: 'Nazwa rekordu',
    canCopy: true,
    canSort: true,
    hint: true,
    hintColumn: 'Kolumna demonstracyjna z aktywna blokada sticky.',
    type: 'text',
    width: COLUMN_WIDTHS.name,
    withLock: true,
  },
  {
    key: 'updatedAt',
    label: 'Data aktualizacji',
    canSort: true,
    type: 'date',
    width: COLUMN_WIDTHS.date,
    withLock: true,
  },
  {
    key: 'workflowStatus',
    label: 'Status procesu',
    statusDictionary: tagStatusDictionary,
    type: 'tag',
    width: COLUMN_WIDTHS.tag,
    withLock: true,
  },
  {
    key: 'owners',
    label: 'Opiekunowie',
    type: 'array',
    width: COLUMN_WIDTHS.array,
    withLock: true,
  },
  {
    key: 'resourceLink',
    label: 'Powiazanie',
    type: 'link',
    width: COLUMN_WIDTHS.link,
    withLock: true,
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => actionMenuItems,
    width: COLUMN_WIDTHS.actions,
  },
];

const columnVisibilityColumns = [
  {
    key: 'name',
    label: 'Nazwa rekordu',
    canCopy: true,
    canSort: true,
    type: 'text',
    width: COLUMN_WIDTHS.name,
    withLock: true,
  },
  {
    key: 'updatedAt',
    label: 'Data aktualizacji',
    canSort: true,
    type: 'date',
    width: COLUMN_WIDTHS.date,
    withLock: true,
  },
  {
    key: 'workflowStatus',
    label: 'Status procesu',
    statusDictionary: tagStatusDictionary,
    type: 'tag',
    width: COLUMN_WIDTHS.tag,
  },
  {
    key: 'owners',
    label: 'Opiekunowie',
    type: 'array',
    width: COLUMN_WIDTHS.array,
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => actionMenuItems,
    width: COLUMN_WIDTHS.actions,
  },
];

const allColumnTypesColumns = [
  {
    key: 'index',
    label: 'Lp.',
    type: 'index',
    width: COLUMN_WIDTHS.index,
  },
  ...textColumns,
  ...dateColumns,
  ...statusColumns,
  ...tagColumns,
  ...arrayColumns,
  ...linkColumns,
  {
    key: 'open',
    label: 'Akcja',
    actionLabel: 'Otworz',
    type: 'action',
    width: COLUMN_WIDTHS.actionType,
  },
  {
    key: 'workflowStatus',
    label: 'Akcja inline',
    actionLabel: 'Edytuj inline',
    type: 'editAction',
    width: COLUMN_WIDTHS.editAction,
  },
  {
    key: 'placeholder',
    label: 'Puste pole',
    type: 'empty',
    width: COLUMN_WIDTHS.empty,
  },
  {
    key: 'stepper',
    label: 'Etapy',
    type: 'stepper',
    steps: buildStepperSteps,
    width: COLUMN_WIDTHS.stepper,
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => actionMenuItems,
    width: COLUMN_WIDTHS.actions,
  },
];

const editableColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
    manage: {
      placeholder: 'Podaj nazwe',
      required: true,
      type: 'text',
    },
  },
  {
    key: 'limit',
    label: 'Limit',
    type: 'text',
    width: 150,
    manage: {
      integer: true,
      max: 99,
      min: 1,
      required: true,
      step: 1,
      type: 'number',
    },
  },
  {
    key: 'category',
    label: 'Kategoria',
    type: 'text',
    width: 250,
    manage: {
      options: selectOptions,
      placement: 'bottom',
      placeholder: 'Wybierz kategorie',
      required: true,
      type: 'select',
    },
  },
  {
    key: 'owners',
    label: 'Opiekunowie',
    type: 'array',
    width: COLUMN_WIDTHS.array,
    manage: {
      options: multiselectOptions,
      placement: 'bottom',
      placeholder: 'Wybierz opiekunow',
      required: true,
      type: 'multiselect',
    },
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => [
      { key: 'edit', label: 'Edytuj', icon: 'edit' },
      { key: 'delete', label: 'Usun', icon: 'cross' },
    ],
    width: COLUMN_WIDTHS.actions,
  },
];

const editableInlineColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    inline: true,
    type: 'editable',
    width: COLUMN_WIDTHS.name,
    manage: {
      maxLength: 64,
      placeholder: 'Podaj nazwe',
      required: true,
      type: 'text',
    },
  },
  {
    key: 'limit',
    label: 'Limit',
    inline: true,
    type: 'editable',
    width: COLUMN_WIDTHS.number,
    manage: {
      integer: true,
      max: 99,
      min: 1,
      required: true,
      step: 1,
      type: 'number',
    },
  },
  {
    key: 'category',
    label: 'Kategoria',
    inline: true,
    type: 'editable',
    width: COLUMN_WIDTHS.select,
    manage: {
      options: selectOptions,
      placement: 'bottom',
      placeholder: 'Wybierz kategorie',
      required: true,
      type: 'select',
    },
  },
];

const editableDynamicColumns = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: COLUMN_WIDTHS.name,
    manage: {
      placeholder: 'Podaj nazwe',
      required: true,
      type: 'text',
    },
  },
  {
    key: 'limit',
    label: 'Limit',
    type: 'text',
    width: 150,
    manage: {
      integer: true,
      max: 99,
      min: 1,
      required: true,
      step: 1,
      type: 'number',
    },
  },
  {
    key: 'category',
    label: 'Kategoria zalezna od limitu',
    type: 'text',
    width: 250,
    manage: {
      options: resolveDynamicCategoryOptions,
      placement: 'bottom',
      placeholder: 'Wybierz kategorie',
      required: true,
      type: 'select',
    },
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => [
      { key: 'edit', label: 'Edytuj', icon: 'edit' },
      { key: 'delete', label: 'Usun', icon: 'cross' },
    ],
    width: COLUMN_WIDTHS.actions,
  },
];

const meta: Meta<typeof TableListComponent> = {
  title: '2. Data Display/TableList',
  component: TableListComponent,
  parameters: {
    name: 'TableList',
    description:
      'Tabela danych z obsluga sortowania, zaznaczania, wyboru wiersza, edycji rekordow, rozwijania szczegolow oraz osobnymi wariantami dla wszystkich wspieranych typow kolumn. Obsluguje rowniez multisort dla maksymalnie 2 kolumn po ustawieniu canMultiSort oraz manager widocznosci kolumn w akcjach naglowka.',
    code: `
<script lang="ts" setup>
  import { ref } from "vue";
  import TableList from "@peaui/ui/data-display/TableList";

  const selectedRows = ref<string[]>([]);
  const sortColumn = ref("name");
  const sortType = ref<"ASC" | "DESC">("ASC");
</script>

<template>
  <TableList
    :columns="columns"
    :records="records"
    :selected-rows="selectedRows"
    :sort-column="sortColumn"
    :sort-type="sortType"
    ariaLabel="Tabela rekordow"
    dataTestId="table-list"
    @on:select:row="selectedRows = $event"
    @on:sort="sortColumn = $event"
  />
</template>
    `,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Etykieta aria-label dla tabeli i regionu przewijalnego.',
      table: { type: { summary: 'string' } },
    },
    canCheckRows: {
      control: { type: 'boolean' },
      description: 'Wlacza tryb pojedynczego wyboru wiersza za pomoca radio.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    canHideColumns: {
      control: { type: 'boolean' },
      description: 'Włacza tryb chowania kolumn',
      table: { type: { summary: 'boolean | undefined' } },
    },
    canMultiSort: {
      control: { type: 'boolean' },
      description:
        'Wlacza sortowanie po maksymalnie 2 kolumnach. W tym trybie komponent korzysta z propsa sortColumns i emituje on:sort jako tablice obiektow, np. [{ name: "ASC" }, { updatedAt: "DESC" }].',
      table: { type: { summary: 'boolean | undefined' } },
    },
    canCreate: {
      control: { type: 'boolean' },
      description: 'Pokazuje akcje tworzenia rekordu.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    canSelectRows: {
      control: { type: 'boolean' },
      description: 'Wlacza zaznaczanie wielu rekordow.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    columns: {
      control: false,
      description: 'Definicje kolumn tabeli.',
      table: { type: { summary: 'TableColumn[]' } },
    },
    dataTestId: {
      control: { type: 'text' },
      description: 'Bazowy data-testid dla komponentu i jego elementow potomnych.',
      table: { type: { summary: 'string | undefined' } },
    },
    editable: {
      control: { type: 'boolean' },
      description: 'Wlacza tryb edycji tabeli.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Pokazuje overlay ze SpinnerLoader na calosci tabeli.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    isDetails: {
      control: { type: 'boolean' },
      description: 'Wlacza wariant tabeli z rozwijanymi detalami.',
      table: { type: { summary: 'boolean | undefined' } },
    },
    records: {
      control: false,
      description: 'Lista rekordow do wyswietlenia.',
      table: { type: { summary: 'Record<string, any>[]' } },
    },
    sortColumns: {
      control: false,
      description:
        'Aktualny stan multisortowania w formacie Array<Record<string, "ASC" | "DESC">>. Uzywany tylko gdy canMultiSort=true.',
      table: { type: { summary: 'Array<Record<string, "ASC" | "DESC">> | undefined' } },
    },
    scroll: {
      control: { type: 'boolean' },
      description: 'Wlacza przewijanie pionowe i sticky header.',
      table: { type: { summary: 'boolean | undefined' } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TableListComponent>;
type TableSortDirection = 'ASC' | 'DESC';
type TableSortState = Record<string, TableSortDirection>;

type RenderOptions = {
  withDetails?: boolean;
};

function cloneRecords<T>(records: T): T {
  return JSON.parse(JSON.stringify(records)) as T;
}

function getFirstSortableColumn(columns: Array<Record<string, any>>): string {
  const firstSortableColumn = columns.find((column) => column.canSort);
  return firstSortableColumn ? firstSortableColumn.subKey || firstSortableColumn.key : 'name';
}

function createSingleSortState(
  column: string,
  direction: TableSortDirection = 'ASC',
): TableSortState {
  return { [column]: direction };
}

function createRender(options: RenderOptions = {}) {
  return (args: any) => ({
    components: { StoryContent, TableListComponent },
    setup() {
      const selectedRows = ref<string[]>([]);
      const checkedRow = ref<string | number | undefined>(undefined);
      const recordsModel = ref<any[]>([]);
      const sortColumn = ref('name');
      const sortColumns = ref<TableSortState[]>([]);
      const sortType = ref<TableSortDirection>('ASC');
      const withDetails = options.withDetails ?? false;

      watch(
        () => args.records,
        (nextRecords) => {
          recordsModel.value = cloneRecords(nextRecords ?? []);
          selectedRows.value = [];
          checkedRow.value = undefined;
        },
        { deep: true, immediate: true },
      );

      watch(
        () => ({
          canMultiSort: args.canMultiSort,
          columns: args.columns,
          sortColumns: args.sortColumns,
        }),
        (nextState) => {
          const firstSortableColumn = getFirstSortableColumn(nextState.columns ?? []);

          sortColumn.value = firstSortableColumn;
          sortType.value = 'ASC';
          sortColumns.value =
            nextState.canMultiSort &&
            Array.isArray(nextState.sortColumns) &&
            nextState.sortColumns.length
              ? cloneRecords(nextState.sortColumns)
              : nextState.canMultiSort && firstSortableColumn
                ? [createSingleSortState(firstSortableColumn)]
                : [];
        },
        { deep: true, immediate: true },
      );

      function handleSort(sort: string | TableSortState[]) {
        if (Array.isArray(sort)) {
          sortColumns.value = sort;
          return;
        }

        if (sortColumn.value === sort) {
          sortType.value = sortType.value === 'ASC' ? 'DESC' : 'ASC';
          return;
        }

        sortColumn.value = sort;
        sortType.value = 'ASC';
      }

      function handleAction(
        recordId: string | number | undefined,
        action: string,
        currentRecord?: Record<string, any>,
      ) {
        if (action === 'delete') {
          recordsModel.value = recordsModel.value.filter((record) => {
            return String(record.id) !== String(currentRecord?.id ?? recordId);
          });
          return;
        }

        if (action === 'copy' && currentRecord) {
          recordsModel.value = recordsModel.value.concat({
            ...cloneRecords(currentRecord),
            id: String(recordsModel.value.length + 1),
            name: `${currentRecord.name} kopia`,
          });
        }
      }

      function handleCreateRecord() {
        recordsModel.value = [
          {
            id: '1',
            name: 'Nowy rekord',
            updatedAt: '2026-03-29',
            isPublished: false,
            workflowStatus: 'Roboczy',
            owners: ['Anna Nowak'],
            resourceLink: 'Podglad nowego rekordu',
            note: 'Dodany ze stanu pustego.',
            progress: 1,
          },
        ];
      }

      function handleSubmit(record: Record<string, any>) {
        const normalizedRecord = {
          ...record,
        };
        const recordIndex =
          normalizedRecord.id === undefined ? undefined : Number(normalizedRecord.id);

        delete normalizedRecord.id;

        if (recordIndex !== undefined && !Number.isNaN(recordIndex)) {
          recordsModel.value.splice(recordIndex, 1, {
            ...recordsModel.value[recordIndex],
            ...normalizedRecord,
          });
          return;
        }

        recordsModel.value = recordsModel.value.concat({
          ...normalizedRecord,
          id: String(recordsModel.value.length + 1),
        });
      }

      return {
        args,
        checkedRow,
        handleAction,
        handleCreateRecord,
        handleSort,
        handleSubmit,
        recordsModel,
        selectedRows,
        settings: getSettings(meta),
        sortColumn,
        sortColumns,
        sortType,
        withDetails,
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 700px; max-width: 100%; min-width: 0; overflow: hidden;">
          <TableListComponent
            v-bind="args"
            :currentCheckedRow="checkedRow"
            :records="recordsModel"
            :selectedRows="selectedRows"
            :sortColumn="sortColumn"
            :sortColumns="sortColumns"
            :sortType="sortType"
            @on:action="handleAction"
            @on:check:row="checkedRow = $event.id"
            @on:createRecord="handleCreateRecord"
            @on:select:row="selectedRows = $event"
            @on:sort="handleSort"
            @on:submit="handleSubmit"
          >
            <template #hint.name>
              Podpowiedz dla kolumny tekstowej.
            </template>

            <template v-if="withDetails" #details-record="{ record }">
              <div>
                <strong>{{ record.name }}</strong>
                <p>{{ record.note }}</p>
                <p>Opiekunowie: {{ record.owners.join(", ") }}</p>
              </div>
            </template>
          </TableListComponent>
        </div>
      </StoryContent>
    `,
  });
}

function createEditableColumnsRender() {
  return (args: any) => ({
    components: { StoryContent, TableListComponent },
    setup() {
      const recordsModel = ref<any[]>([]);

      watch(
        () => args.records,
        (nextRecords) => {
          recordsModel.value = cloneRecords(nextRecords ?? []);
        },
        { deep: true, immediate: true },
      );

      function handleUpdateRecord(nextRecord: Record<string, any>) {
        recordsModel.value = recordsModel.value.map((record) =>
          String(record.id) === String(nextRecord.id) ? { ...record, ...nextRecord } : record,
        );
      }

      const editableColumns = [
        {
          key: 'name',
          label: 'Nazwa',
          type: 'editable',
          width: 150,
          manage: {
            maxLength: 64,
            placeholder: 'Podaj nazwe',
            required: true,
            type: 'text',
            onUpdate: handleUpdateRecord,
          },
        },
        {
          key: 'limit',
          label: 'Limit',
          type: 'editable',
          width: 200,
          manage: {
            integer: true,
            max: 99,
            min: 1,
            required: true,
            step: 1,
            type: 'number',
            onUpdate: handleUpdateRecord,
          },
        },
        {
          key: 'category',
          label: 'Kategoria',
          type: 'editable',
          width: 300,
          manage: {
            options: selectOptions,
            placement: 'bottom',
            placeholder: 'Wybierz kategorie',
            required: true,
            type: 'select',
            onUpdate: handleUpdateRecord,
          },
        },
      ];

      return {
        args,
        editableColumns,
        recordsModel,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 700px; max-width: 100%; min-width: 0; overflow: hidden;">
          <TableListComponent
            v-bind="args"
            :columns="editableColumns"
            :records="recordsModel"
          />
        </div>
      </StoryContent>
    `,
  });
}

function createEditableInlineColumnsRender(visibleKeys?: string[]) {
  return (args: any) => ({
    components: { StoryContent, TableListComponent },
    setup() {
      const recordsModel = ref<any[]>([]);

      watch(
        () => args.records,
        (nextRecords) => {
          recordsModel.value = cloneRecords(nextRecords ?? []);
        },
        { deep: true, immediate: true },
      );

      function handleUpdateRecord(nextRecord: Record<string, any>) {
        recordsModel.value = recordsModel.value.map((record) =>
          String(record.id) === String(nextRecord.id) ? { ...record, ...nextRecord } : record,
        );

        return nextRecord;
      }

      const currentEditableInlineColumns = editableInlineColumns
        .filter((column) => !visibleKeys || visibleKeys.includes(column.key))
        .map((column) => ({
          ...column,
          manage: column.manage
            ? {
                ...column.manage,
                onUpdate: handleUpdateRecord,
              }
            : column.manage,
        }));

      return {
        args,
        currentEditableInlineColumns,
        recordsModel,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings="settings">
        <div style="width: 700px; max-width: 100%; min-width: 0; overflow: hidden;">
          <TableListComponent
            v-bind="args"
            :columns="currentEditableInlineColumns"
            :records="recordsModel"
          />
        </div>
      </StoryContent>
    `,
  });
}

export const Default: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela rekordow',
    columns: defaultColumns,
    dataTestId: 'table-list-default',
    records: demoRecords,
    scroll: true,
  },
};

export const SelectableRows: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela rekordow z zaznaczaniem',
    canSelectRows: true,
    columns: defaultColumns,
    dataTestId: 'table-list-selectable',
    records: demoRecords,
  },
};

export const MultiSort: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela rekordow z multisortowaniem',
    canMultiSort: true,
    columns: defaultColumns,
    dataTestId: 'table-list-multi-sort',
    records: demoRecords,
    sortColumns: [{ name: 'ASC' }, { updatedAt: 'DESC' }],
    scroll: true,
  },
};

export const CheckableRows: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela rekordow z wyborem pojedynczego wiersza',
    canCheckRows: true,
    canSelectRows: false,
    columns: defaultColumns,
    dataTestId: 'table-list-checkable',
    records: demoRecords,
  },
};

export const ColumnBorders: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela rekordow z granicami kolumn',
    columns: borderColumns,
    dataTestId: 'table-list-borders',
    records: demoRecords,
  },
};

export const TextColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna tekstowa',
    columns: textColumns,
    dataTestId: 'table-list-text',
    records: demoRecords,
  },
};

export const DateColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna daty',
    columns: dateColumns,
    dataTestId: 'table-list-date',
    records: demoRecords,
  },
};

export const StatusColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna statusu logicznego',
    columns: statusColumns,
    dataTestId: 'table-list-status',
    records: demoRecords,
  },
};

export const TagColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna tagow statusu',
    columns: tagColumns,
    dataTestId: 'table-list-tag',
    records: demoRecords,
  },
};

export const ArrayColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna tablicowa',
    columns: arrayColumns,
    dataTestId: 'table-list-array',
    records: demoRecords,
  },
};

export const LinkColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna linku',
    columns: linkColumns,
    dataTestId: 'table-list-link',
    records: demoRecords,
  },
};

export const ActionTypeColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z szybka akcja w kolumnie',
    columns: actionTypeColumns,
    dataTestId: 'table-list-action-type',
    records: demoRecords,
  },
};

export const EditActionColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z akcja edycji inline w kolumnie',
    columns: editActionColumns,
    dataTestId: 'table-list-edit-action',
    records: demoRecords,
  },
};

export const IndexColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna indeksu',
    columns: indexColumns,
    dataTestId: 'table-list-index',
    records: demoRecords,
  },
};

export const EmptyColumnType: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z pusta kolumna',
    columns: emptyColumns,
    dataTestId: 'table-list-empty-column',
    records: demoRecords,
  },
};

export const StepperColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna etapow',
    columns: stepperColumns,
    dataTestId: 'table-list-stepper',
    records: demoRecords,
  },
};

export const StepperColumnWithSeparateStep: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z kolumna etapow, oddzielnym krokiem i separatorem wizualnym',
    columns: [
      {
        key: 'name',
        label: 'Nazwa',
        type: 'text',
        width: 100,
      },
      {
        key: 'stepper',
        label: 'Etapy',
        type: 'stepper',
        steps: buildStepperStepsWithSeparate,
        width: 300,
      },
    ],
    dataTestId: 'table-list-stepper-separate',
    records: demoRecords,
  },
};

export const ActionsMenuColumn: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z menu akcji',
    columns: actionsMenuColumns,
    dataTestId: 'table-list-actions-menu',
    records: demoRecords,
  },
};

export const LockableColumns: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z blokowanymi kolumnami',
    columns: lockableColumns,
    dataTestId: 'table-list-lockable',
    records: demoRecords,
    scroll: true,
  },
};

export const ColumnVisibilityManager: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela z managerem widocznosci kolumn',
    canHideColumns: true,
    columns: columnVisibilityColumns,
    dataTestId: 'table-list-column-visibility',
    records: demoRecords,
  },
};

export const AllColumnTypes: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela ze wszystkimi typami kolumn',
    columns: allColumnTypesColumns,
    dataTestId: 'table-list-all-types',
    records: demoRecords,
    scroll: true,
  },
};

export const EditableTable: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela edytowalna',
    canCreate: true,
    canSelectRows: false,
    columns: editableColumns,
    dataTestId: 'table-list-editable',
    editable: true,
    records: editableRecords,
  },
};

export const EditableDynamicOptions: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela edytowalna z opcjami zaleznymi od rekordu',
    canCreate: true,
    canSelectRows: false,
    columns: editableDynamicColumns,
    dataTestId: 'table-list-editable-dynamic-options',
    editable: true,
    records: editableDynamicRecords,
  },
};

export const EditableColumns: Story = {
  render: createEditableColumnsRender(),
  args: {
    ariaLabel: 'Tabela z kolumnami editable',
    columns: [],
    dataTestId: 'table-list-editable-columns',
    records: editableRecords,
  },
};

export const EditableInlineColumns: Story = {
  render: createEditableInlineColumnsRender(),
  args: {
    ariaLabel: 'Tabela z kolumnami editable inline',
    canSelectRows: false,
    columns: [],
    dataTestId: 'table-list-editable-inline',
    records: editableRecords,
  },
};

export const EditableInlineSelect: Story = {
  render: createEditableInlineColumnsRender(['name', 'category']),
  args: {
    ariaLabel: 'Tabela z inline editable select',
    canSelectRows: false,
    columns: [],
    dataTestId: 'table-list-editable-inline-select',
    records: editableRecords,
  },
};

export const ExpandableRows: Story = {
  render: createRender({ withDetails: true }),
  args: {
    ariaLabel: 'Tabela z rozwijanymi szczegolami',
    columns: expandableColumns,
    dataTestId: 'table-list-expandable',
    isDetails: true,
    records: demoRecords,
  },
};

export const ExpandableColumnType: Story = {
  render: createRender({ withDetails: true }),
  args: {
    ariaLabel: 'Tabela z kolumna expandable',
    columns: expandableTypeColumns,
    dataTestId: 'table-list-expandable-column',
    isDetails: true,
    records: demoRecords,
  },
};

export const EmptyState: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Pusta tabela rekordow',
    canCreate: true,
    columns: defaultColumns,
    dataTestId: 'table-list-empty',
    records: [],
  },
};

export const Loading: Story = {
  render: createRender(),
  args: {
    ariaLabel: 'Tabela rekordow w trakcie ladowania',
    columns: defaultColumns,
    dataTestId: 'table-list-loading',
    isLoading: true,
    records: demoRecords,
    scroll: true,
  },
};
