/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type RuntimeProps, useModel, common, text, cx, node } from './runtime.shared';
import { type ForwardedRef, type ReactElement, useRef, useEffect, useMemo, useId } from 'react';
import { acquireDocumentScrollLock } from '../../helpers/browser.helper';
import { createDialogMotion } from '../../helpers/dialog-motion.helper';

export function Dialog({
  props,
  kind,
  forwardedRef,
}: {
  props: RuntimeProps;
  kind: string;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const [open, setOpen] = useModel<boolean>(props, 'open', false);
  const dialog = useRef<HTMLDialogElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);
  const releaseScrollLock = useRef<(() => void) | undefined>(undefined);
  const motion = useMemo(
    () => createDialogMotion(kind === 'DrawerPanel' ? kind : 'ModalDialog'),
    [kind],
  );
  const headerId = useId();
  const header = node(props, 'header');
  const releaseLock = (): void => {
    releaseScrollLock.current?.();
    releaseScrollLock.current = undefined;
  };
  useEffect(() => {
    const element = dialog.current;
    const content = inner.current;
    if (!element || !content) return;
    if (open) {
      if (kind === 'DrawerPanel' && !releaseScrollLock.current)
        releaseScrollLock.current = acquireDocumentScrollLock('peaui-drawer-panel--scroll-hidden');
      if (!element.open) element.showModal();
      motion.run(content, true);
    } else if (element.open) {
      motion.run(content, false, () => {
        if (element.open) element.close();
        releaseLock();
      });
    }
    return motion.cancel;
  }, [kind, open, motion]);
  useEffect(
    () => () => {
      motion.cancel();
      releaseLock();
    },
    [motion],
  );
  const root = kind === 'DrawerPanel' ? 'peaui-drawer-panel' : 'peaui-modal-dialog';
  return (
    <dialog
      {...common(props)}
      aria-label={text(props, 'aria-label') || text(props, 'ariaLabel') || undefined}
      aria-labelledby={text(props, 'aria-labelledby') || (header ? headerId : undefined)}
      className={cx(root, props.className)}
      ref={(element) => {
        dialog.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
      onCancel={(event) => {
        event.preventDefault();
        setOpen(false);
      }}
      onClose={(event) => {
        if (event.currentTarget.open) return;
        motion.cancel();
        releaseLock();
        setOpen(false);
      }}
    >
      <div ref={inner} className={`${root}__inner`}>
        {header ? (
          <header id={headerId} className={`${root}__header`}>
            {header}
          </header>
        ) : null}
        {props.children}
      </div>
    </dialog>
  );
}
