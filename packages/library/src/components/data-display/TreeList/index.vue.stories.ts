import StoryContent from '@peaui/storybook-shell/src/components/StoryContent.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, watch } from 'vue';
import TreeListComponent, { type TreeListType } from './index.vue';

import { useSettingsStorie } from '@peaui/storybook-shell/stories.helper';

const { getSettings } = useSettingsStorie();

const sampleTree: TreeListType = {
  label: 'malopolskie',
  children: {
    krakowski: {
      label: 'krakowski',
      children: {
        skala: {
          label: 'skala',
          children: {},
        },
        slomniki: {
          label: 'slomniki',
          children: {},
        },
      },
    },
    oswiecimski: {
      label: 'oswiecimski',
      children: {},
    },
  },
};

const additionalRoots: Array<{ id: string; tree: TreeListType }> = [
  {
    id: 'mal',
    tree: sampleTree,
  },
  {
    id: 'swk',
    tree: {
      label: 'swietokrzyskie',
      children: {},
    },
  },
];

function cloneTree(tree: TreeListType): TreeListType {
  return {
    label: tree.label,
    children: Object.fromEntries(
      Object.entries(tree.children ?? {}).map(([key, child]) => [key, cloneTree(child)]),
    ),
  };
}

function createAdditionalRoots(): Array<{ id: string; tree: TreeListType }> {
  return additionalRoots.map((item) => ({
    id: item.id,
    tree: cloneTree(item.tree),
  }));
}

const meta: Meta<typeof TreeListComponent> = {
  title: '2. Data Display/TreeList',
  component: TreeListComponent,
  parameters: {
    name: 'TreeList',
    description:
      'Hierarchiczna lista obszarow z rozwijanymi galeziami. Zachowuje aktualna logike komponentu, ale korzysta z semantycznych przyciskow dla galezi, list dla zagniezdzen i poprawnych relacji ARIA.',
    code: `
<script lang="ts" setup>
  import TreeList from "@peaui/ui/data-display/TreeList";

  const tree = {
    label: "malopolskie",
    children: {
      krakowski: {
        label: "krakowski",
        children: {
          skala: { label: "skala", children: {} }
        }
      }
    }
  };
</script>

<template>
  <TreeList :tree="tree" dataTestId="tree-list">
    <template #default="{ level }">
      {{ level === 3 ? "(wszystkie gminy)" : "" }}
    </template>
  </TreeList>
</template>
    `,
  },
  argTypes: {
    tree: {
      control: { type: 'object' },
      description: 'Struktura drzewa przekazywana do v-model:tree.',
      table: {
        type: { summary: 'TreeListType' },
        defaultValue: { summary: 'sampleTree' },
        required: true,
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Blokuje rozwijanie danej galezi.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
        required: false,
      },
    },
    canRemove: {
      control: { type: 'boolean' },
      description: 'Pokazuje dodatkowy przycisk usuwania galezi.',
      table: {
        type: { summary: 'boolean | undefined' },
        defaultValue: { summary: 'false' },
        required: false,
      },
    },
    dataTestId: {
      control: { type: 'text' },
      description:
        'Bazowy data-testid. Komponent generuje dodatkowo: -trigger, -label, -content, -remove i -child-{index}.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: undefined },
        required: false,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TreeListComponent>;

export const TreeList: Story = {
  render: (args) => ({
    components: { StoryContent, TreeListComponent },
    setup() {
      const tree = ref(cloneTree(args.tree!));

      watch(
        () => args.tree,
        (nextTree) => {
          tree.value = cloneTree(nextTree!);
        },
        {
          deep: true,
        },
      );

      return {
        args,
        tree,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div style="max-width: 28rem;">
          <TreeListComponent v-bind="args" v-model:tree="tree">
            <template #default="{ level }">
              <span v-if="level === 1">(wszystkie powiaty i gminy)</span>
              <span v-if="level === 2">(wszystkie gminy)</span>
            </template>
          </TreeListComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    tree: sampleTree,
    disabled: false,
    canRemove: false,
    dataTestId: 'tree-list',
  },
};

export const WithRemoveAction: Story = {
  render: (args) => ({
    components: { StoryContent, TreeListComponent },
    setup() {
      const removedId = ref('');
      const roots = ref(createAdditionalRoots());

      return {
        args,
        removedId,
        roots,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div style="display: grid; gap: 1rem; max-width: 32rem;">
          <TreeListComponent
            v-for="(item, index) in roots"
            :key="item.id"
            :id="item.id"
            :tree="item.tree"
            :canRemove="args.canRemove"
            :dataTestId="\`tree-list-remove-\${index}\`"
            @on:remove="removedId = $event"
          >
            <template #default="{ level }">
              <span v-if="level === 1">(wszystkie powiaty i gminy)</span>
              <span v-else-if="level === 2">(wszystkie gminy)</span>
            </template>
          </TreeListComponent>

          <p style="margin: 0;">Ostatnio usunieto: {{ removedId || 'brak' }}</p>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    canRemove: true,
  },
};

export const DisabledBranch: Story = {
  render: (args) => ({
    components: { StoryContent, TreeListComponent },
    setup() {
      const tree = ref(cloneTree(args.tree!));

      watch(
        () => args.tree,
        (nextTree) => {
          tree.value = cloneTree(nextTree!);
        },
        {
          deep: true,
        },
      );

      return {
        args,
        tree,
        settings: getSettings(meta),
      };
    },
    template: `
      <StoryContent :settings>
        <div style="max-width: 28rem;">
          <TreeListComponent v-bind="args" v-model:tree="tree">
            <template #default="{ level }">
              <span v-if="level === 3">(wszystkie gminy)</span>
            </template>
          </TreeListComponent>
        </div>
      </StoryContent>
    `,
  }),
  args: {
    tree: sampleTree,
    disabled: true,
    canRemove: false,
    dataTestId: 'tree-list-disabled',
  },
};
