/** @jsxImportSource react */

import { type RuntimeProps, common, cx, text } from './runtime.shared';
import { iconCompressArrows, iconExpandArrows } from '../generated-static-icons';
import { type ForwardedRef, type ReactElement, useRef, useState, useEffect } from 'react';
import { Svg } from './svg.renderer';
import { acquireDocumentScrollLock } from '../../helpers/browser.helper';
import { collectFocusableElements, trapTabKey } from '../../helpers/focus.helper';

export function Fullscreen({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const root = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!active) return undefined;
    return acquireDocumentScrollLock('peaui-fullscreen-container--scroll-hidden');
  }, [active]);
  const toggle = (): void => {
    setActive((current) => !current);
    toggleRef.current?.focus();
  };
  const toggleLabel = active
    ? text(props, 'closeLabel', 'Zamknij tryb pełnoekranowy')
    : text(props, 'openLabel', 'Otwórz tryb pełnoekranowy');
  return (
    <div
      {...common(props)}
      onKeyDown={(event) => {
        if (event.defaultPrevented) return;
        if (active && event.key === 'Tab') {
          trapTabKey(
            event.nativeEvent,
            collectFocusableElements([root.current]),
            toggleRef.current,
          );
        }
        if (active && event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          setActive(false);
          toggleRef.current?.focus();
        }
      }}
      className={cx(
        'peaui-fullscreen-container',
        active && 'peaui-fullscreen-container--fullscreen',
        props.className,
      )}
      ref={(element) => {
        root.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
    >
      <div className="peaui-fullscreen-container__content">
        <div className="peaui-fullscreen-container__content-inner">{props.children}</div>
      </div>
      <div className="peaui-fullscreen-container__actions">
        <button
          aria-label={toggleLabel}
          ref={toggleRef}
          aria-pressed={active}
          className="peaui-fullscreen-container__toggle"
          type="button"
          onClick={toggle}
        >
          <Svg
            data={active ? iconCompressArrows : iconExpandArrows}
            className="peaui-fullscreen-container__toggle-icon"
            name={active ? 'compressArrows' : 'expandArrows'}
          />
          <span className="peaui-fullscreen-container__toggle-label">{toggleLabel}</span>
        </button>
      </div>
    </div>
  );
}
