import { onBeforeUpdate, shallowRef, useSlots, type Ref, type InjectionKey } from 'vue';

/** Invalidates slot-content inspection in nested Vue controls hosted by a WC. */
export const NATIVE_SLOT_VERSION: InjectionKey<Readonly<Ref<number>>> = Symbol(
  'peaui-native-slot-version',
);

/** Slot objects are not reactive, so cached presence must follow component updates. */
export function useSlotPresence(name: string): Readonly<Ref<boolean>> {
  const slots = useSlots();
  const present = shallowRef(Boolean(slots[name]));
  onBeforeUpdate(() => {
    present.value = Boolean(slots[name]);
  });
  return present;
}
