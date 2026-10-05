import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

import TreeList, { type TreeListType } from './index.vue';

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  template: '<svg :data-icon="name" />',
});

function createTree(): TreeListType {
  return {
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
}

function mountComponent(props: Record<string, unknown> = {}) {
  return mount(TreeList, {
    props: {
      tree: createTree(),
      ...props,
    },
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
      },
    },
    slots: {
      default: `
        <template #default="{ level }">
          <span class="tree-slot">Poziom {{ level }}</span>
        </template>
      `,
    },
  });
}

describe('TreeList (index.vue)', () => {
  it('renders root with UIKIT class and button semantics for branch nodes', () => {
    const wrapper = mountComponent({
      dataTestId: 'tree-list',
    });

    const root = wrapper.get('[data-testid="tree-list"]');
    expect(root.classes()).toContain('peaui-tree-list');
    expect(root.classes()).toContain('peaui-tree-list--level-1');

    const trigger = wrapper.get('[data-testid="tree-list-trigger"]');
    expect(trigger.element.tagName.toLowerCase()).toBe('button');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(trigger.attributes('aria-controls')).toBeTruthy();

    const label = wrapper.get('[data-testid="tree-list-label"]');
    expect(label.text()).toBe('Malopolskie');
  });

  it('toggles nested content and updates aria-expanded when clicking a branch trigger', async () => {
    const wrapper = mountComponent({
      dataTestId: 'tree-list',
    });

    expect(wrapper.find('[data-testid="tree-list-content"]').exists()).toBe(false);

    const trigger = wrapper.get('[data-testid="tree-list-trigger"]');
    await trigger.trigger('click');

    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('[data-testid="tree-list-content"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="tree-list-child-0-trigger"]').text()).toContain('Krakowski');
  });

  it('renders leaf slot content only for nodes without children', async () => {
    const wrapper = mountComponent({
      dataTestId: 'tree-list',
    });

    await wrapper.get('[data-testid="tree-list-trigger"]').trigger('click');
    await wrapper.get('[data-testid="tree-list-child-0-trigger"]').trigger('click');

    const leaf = wrapper.get('[data-testid="tree-list-child-0-child-0"]');

    expect(leaf.get('[data-testid="tree-list-child-0-child-0-label"]').text()).toBe('Skala');
    expect(leaf.text()).toContain('Poziom 3');
    expect(leaf.find('[data-testid="tree-list-child-0-child-0-trigger"]').exists()).toBe(false);
  });

  it('does not toggle a disabled branch and keeps disabled state on the trigger', async () => {
    const wrapper = mountComponent({
      dataTestId: 'tree-list',
      disabled: true,
    });

    const trigger = wrapper.get('[data-testid="tree-list-trigger"]');

    expect(trigger.attributes('disabled')).toBeDefined();

    await trigger.trigger('click');

    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(wrapper.find('[data-testid="tree-list-content"]').exists()).toBe(false);
  });

  it('emits on:remove with node id and exposes aria-label for the remove button', async () => {
    const wrapper = mount(TreeList, {
      props: {
        tree: {
          label: 'mazowieckie',
          children: {},
        },
        id: 'maz',
        canRemove: true,
        dataTestId: 'tree-list',
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
        },
      },
    });

    const removeButton = wrapper.get('[data-testid="tree-list-remove"]');

    expect(removeButton.attributes('aria-label')).toBe('Usun galaz Mazowieckie');

    await removeButton.trigger('click');

    expect(wrapper.emitted('on:remove')).toEqual([['maz']]);
  });

  it('forwards attrs to the root element and prefers dataTestId prop over attr data-testid', () => {
    const wrapper = mountComponent({
      dataTestId: 'tree-list',
      id: 'root-node',
    });

    const wrapperWithAttrs = mount(TreeList, {
      props: {
        tree: createTree(),
        dataTestId: 'tree-list',
      },
      attrs: {
        class: 'external-class',
        'data-testid': 'from-attr',
        'data-qa': 'tree-root',
        'aria-label': 'Lista obszarow',
      },
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);

    const root = wrapperWithAttrs.get('[data-testid="tree-list"]');
    expect(root.attributes('data-qa')).toBe('tree-root');
    expect(root.attributes('aria-label')).toBe('Lista obszarow');
    expect(root.classes()).toContain('external-class');
  });

  it('uses aria-labelledby on the nested list to reference the parent label', async () => {
    const wrapper = mountComponent({
      dataTestId: 'tree-list',
    });

    await wrapper.get('[data-testid="tree-list-trigger"]').trigger('click');

    const label = wrapper.get('[data-testid="tree-list-label"]');
    const content = wrapper.get('[data-testid="tree-list-content"]');

    expect(content.attributes('aria-labelledby')).toBe(label.attributes('id'));
  });
});
