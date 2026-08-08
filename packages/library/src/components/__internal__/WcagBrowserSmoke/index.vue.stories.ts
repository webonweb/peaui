import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import TableListComponent, { type TableColumn } from '../../data-display/TableList/index.vue';
import TreeListComponent, { type TreeListType } from '../../data-display/TreeList/index.vue';
import FormMultiSelectComponent from '../../form/FormMultiSelect/index.vue';
import FormSelectComponent from '../../form/FormSelect/index.vue';
import FormDatePickerComponent from '../../form/FormDatePicker/index.vue';
import FormYearPickerComponent from '../../form/FormYearPicker/index.vue';
import BreadcrumbsComponent from '../../navigation/Breadcrumbs/index.vue';
import DrawerPanelComponent from '../../overlayer/DrawerPanel/index.vue';
import ModalDialogComponent from '../../overlayer/ModalDialog/index.vue';

const selectOptions = [
  { label: 'Mazowieckie', value: 'mazowieckie' },
  { label: 'Pomorskie', value: 'pomorskie' },
  { label: 'Slaskie', value: 'slaskie' },
];

const multiSelectOptions = [
  { label: 'Mazowieckie', value: 'mazowieckie' },
  { label: 'Pomorskie', value: 'pomorskie' },
  { label: 'Slaskie', value: 'slaskie' },
  { label: 'Lodzkie', value: 'lodzkie' },
];

const breadcrumbItems = [
  { key: 'home', label: 'Start', path: '/' },
  { key: 'projects', label: 'Projekty', path: '/projekty' },
  { key: 'current', label: 'Biezaca strona' },
];

const tableColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'Nazwa',
    type: 'text',
    width: 220,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'text',
    width: 180,
  },
  {
    key: 'owners',
    label: 'Opiekunowie',
    type: 'array',
    width: 240,
  },
  {
    key: 'updatedAt',
    label: 'Aktualizacja',
    type: 'date',
    width: 200,
  },
  {
    key: 'actions',
    label: 'Akcje',
    resolve: () => [{ key: 'details', label: 'Szczegoly', icon: 'edit' }],
    width: 72,
  },
];

const tableRecords = [
  {
    id: '1',
    name: 'Certyfikat A',
    status: 'Roboczy',
    owners: ['Anna Nowak', 'Jan Kowalski'],
    updatedAt: '2026-03-29',
  },
  {
    id: '2',
    name: 'Certyfikat B',
    status: 'Opublikowany',
    owners: ['Ewa Zielinska'],
    updatedAt: '2026-03-27',
  },
];

const treeListData: TreeListType = {
  label: 'malopolskie',
  children: {
    krakowski: {
      label: 'krakowski',
      children: {
        skala: {
          label: 'skala',
          children: {},
        },
      },
    },
  },
};

const meta: Meta = {
  title: 'Internal/WCAG Browser Smoke',
  component: TableListComponent,
  parameters: {
    docs: {
      disable: true,
    },
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const ModalDialog: Story = {
  render: () => ({
    components: { ModalDialogComponent },
    setup() {
      const open = ref(false);

      return { open };
    },
    template: `
      <div style="padding: 2rem; min-height: 100vh;">
        <button
          type="button"
          data-testid="modal-dialog-smoke-open"
          @click="open = true"
        >
          Otworz modal
        </button>

        <ModalDialogComponent
          v-model:open="open"
          ariaLabel="Modal smoke"
          dataTestId="modal-dialog-smoke"
        >
          <template #header>
            <h2 style="margin: 0;">Modal smoke</h2>
          </template>

          <p>Minimalny scenariusz dla testu browserowego.</p>
          <button
            type="button"
            autofocus
            data-testid="modal-dialog-smoke-focus-target"
          >
            Akcja w modalu
          </button>
        </ModalDialogComponent>
      </div>
    `,
  }),
};

export const FormSelect: Story = {
  render: () => ({
    components: { FormSelectComponent },
    setup() {
      const value = ref('');

      return {
        options: selectOptions,
        value,
      };
    },
    template: `
      <div style="padding: 2rem; max-width: 24rem;">
        <FormSelectComponent
          v-model:value="value"
          id="browser-select"
          name="browser-select"
          label="Wojewodztwo"
          :options="options"
          dataTestId="form-select-smoke"
        />
      </div>
    `,
  }),
};

export const FormDatePicker: Story = {
  render: () => ({
    components: { FormDatePickerComponent },
    setup() {
      const value = ref('2026-03-15');

      return { value };
    },
    template: `
      <div style="padding: 2rem; max-width: 24rem;">
        <FormDatePickerComponent
          v-model:value="value"
          id="browser-date"
          name="browser-date"
          label="Data budowy"
          minDate="2026-01-01"
          maxDate="2026-12-31"
          dataTestId="form-date-picker-smoke"
        />
      </div>
    `,
  }),
};

export const FormYearPicker: Story = {
  render: () => ({
    components: { FormYearPickerComponent },
    setup() {
      const value = ref(2024);

      return { value };
    },
    template: `
      <div style="padding: 2rem; max-width: 24rem;">
        <FormYearPickerComponent
          v-model:value="value"
          id="browser-year"
          name="browser-year"
          label="Rok budowy"
          :minYear="2020"
          :maxYear="2030"
          dataTestId="form-year-picker-smoke"
        />
      </div>
    `,
  }),
};

export const FormMultiSelect: Story = {
  render: () => ({
    components: { FormMultiSelectComponent },
    setup() {
      const value = ref(['mazowieckie']);

      return {
        options: multiSelectOptions,
        value,
      };
    },
    template: `
      <div style="padding: 2rem; max-width: 24rem;">
        <FormMultiSelectComponent
          v-model:value="value"
          id="browser-multiselect"
          name="browser-multiselect"
          label="Wojewodztwa"
          :options="options"
          searchable
          dataTestId="form-multiselect-smoke"
        />
      </div>
    `,
  }),
};

export const Breadcrumbs: Story = {
  render: () => ({
    components: { BreadcrumbsComponent },
    setup() {
      return {
        items: breadcrumbItems,
      };
    },
    template: `
      <div style="padding: 2rem;">
        <div style="width: 320px; max-width: 100%;">
          <BreadcrumbsComponent
            ariaLabel="Sciezka nawigacji"
            :items="items"
            dataTestId="breadcrumbs-smoke"
            separator="/"
          />
        </div>
      </div>
    `,
  }),
};

export const DrawerPanel: Story = {
  render: () => ({
    components: { DrawerPanelComponent },
    setup() {
      const open = ref(false);

      return { open };
    },
    template: `
      <div style="padding: 2rem; min-height: 100vh;">
        <button
          type="button"
          data-testid="drawer-panel-smoke-open"
          @click="open = true"
        >
          Otworz panel boczny
        </button>

        <DrawerPanelComponent
          v-model:open="open"
          ariaLabel="Panel boczny smoke"
          dataTestId="drawer-panel-smoke"
        >
          <template #header>
            <h2 style="margin: 0;">Panel boczny smoke</h2>
          </template>

          <p>Minimalny scenariusz dla testu browserowego.</p>
          <button
            type="button"
            autofocus
            data-testid="drawer-panel-smoke-focus-target"
          >
            Akcja w drawerze
          </button>
        </DrawerPanelComponent>
      </div>
    `,
  }),
};

export const TableList: Story = {
  render: () => ({
    components: { TableListComponent },
    setup() {
      const selectedRows = ref<string[]>([]);

      return {
        columns: tableColumns,
        records: tableRecords,
        selectedRows,
      };
    },
    template: `
      <div style="padding: 2rem;">
        <div style="width: 360px; max-width: 100%;">
          <TableListComponent
            ariaLabel="Tabela smoke"
            canHideColumns
            :columns="columns"
            dataTestId="table-list-smoke"
            :records="records"
            scroll
            :selectedRows="selectedRows"
            @on:select:row="selectedRows = $event"
          />
        </div>
      </div>
    `,
  }),
};

export const TreeList: Story = {
  render: () => ({
    components: { TreeListComponent },
    setup() {
      const tree = ref(treeListData);
      const removedId = ref('');

      return {
        tree,
        removedId,
      };
    },
    template: `
      <div style="box-sizing: border-box; padding: 2rem; width: 20rem; max-width: 100%;">
        <TreeListComponent
          v-model:tree="tree"
          canRemove
          dataTestId="tree-list-smoke"
          id="malopolskie"
          @on:remove="removedId = $event"
        >
          <template #default="{ level }">
            <span v-if="level === 3">(wszystkie gminy)</span>
          </template>
        </TreeListComponent>

        <p data-testid="tree-list-smoke-removed" style="margin: 1rem 0 0;">
          {{ removedId || 'brak usuniecia' }}
        </p>
      </div>
    `,
  }),
};
