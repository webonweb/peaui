<script lang="ts">
import { defineComponent, h, type Component, type PropType, type VNode } from 'vue';
import { t } from '../i18n';

function renderSlotValue(value: string | string[], name: string): VNode | VNode[] {
  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      h('article', { class: 'docs-demo-card', key: `${name}-${index}` }, [
        h('span', { class: 'docs-demo-card__eyebrow' }, t('demo.example', { number: index + 1 })),
        h('strong', entry),
        h('p', t('demo.interactiveItem')),
      ]),
    );
  }

  if (name === 'default') return h('span', { class: 'docs-demo-content' }, value);
  return h('span', { class: `docs-demo-slot docs-demo-slot--${name}` }, value);
}

export default defineComponent({
  name: 'LiveRenderer',
  props: {
    component: { type: [Object, Function] as PropType<Component>, required: true },
    bindings: { type: Object as PropType<Record<string, unknown>>, required: true },
    slotContent: {
      type: Object as PropType<Record<string, string | string[]>>,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      const slots = Object.fromEntries(
        Object.entries(props.slotContent)
          .filter(([, value]) => Array.isArray(value) || Boolean(value))
          .map(([name, value]) => [name, () => renderSlotValue(value, name)]),
      );

      return h(props.component, props.bindings, slots);
    };
  },
});
</script>
