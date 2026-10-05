import { nextTick, onBeforeUnmount, onMounted, type Ref } from 'vue';
import { observeControlReset } from '@/helpers/form-reset.helper';

/** Reset local drafts after the form owner has restored its model. */
export function useFormControlReset(
  control: Readonly<Ref<HTMLElement | null | undefined>>,
  reset: () => void,
): void {
  let active = true;
  let disconnect: (() => void) | undefined;
  onMounted(() => {
    if (!control.value) return;
    disconnect = observeControlReset(control.value, () => {
      void nextTick(() => {
        if (active) reset();
      });
    });
  });
  onBeforeUnmount(() => {
    active = false;
    disconnect?.();
  });
}
