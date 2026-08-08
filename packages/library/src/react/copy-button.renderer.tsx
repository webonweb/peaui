/** @jsxImportSource react */
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  normalizeCopyButtonResetDelay,
  resolveCopyButtonErrorStatus,
  type CopyButtonContent,
  type CopyButtonCopyDetail,
  type CopyButtonErrorDetail,
  type CopyButtonSize,
  type CopyButtonStatus,
  type CopyButtonStatusSlotState,
  type CopyButtonSuccessDetail,
  type CopyButtonTextResolver,
  type CopyButtonVariant,
} from '../components/data-entry/CopyButton/copy-button.shared';
import { copyToClipboard } from '../helpers/functions.helper';

type InternalButtonRenderer = (props: Record<string, unknown>, children: ReactNode) => ReactNode;
type InternalIconRenderer = (props: Record<string, unknown>) => ReactNode;

export type CopyButtonRuntimeProps = {
  text?: string;
  getText?: CopyButtonTextResolver;
  resetDelay?: number;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  loadingLabel?: string;
  content?: CopyButtonContent;
  variant?: CopyButtonVariant;
  size?: CopyButtonSize;
  loading?: boolean;
  disabled?: boolean;
  showStatus?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  dataTestId?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode);
  icon?: ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode);
  copiedIcon?: ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode);
  renderStatus?: (state: CopyButtonStatusSlotState) => ReactNode;
  onCopy?: (detail: CopyButtonCopyDetail) => void;
  onSuccess?: (detail: CopyButtonSuccessDetail) => void;
  onError?: (detail: CopyButtonErrorDetail) => void;
  onStatusChange?: (status: CopyButtonStatus) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
  forwardedRef?: ForwardedRef<HTMLElement>;
  __renderButton?: InternalButtonRenderer;
  __renderIcon?: InternalIconRenderer;
};

function renderSlot(
  slot: ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode),
  state: CopyButtonStatusSlotState,
): ReactNode {
  return typeof slot === 'function' ? slot(state) : slot;
}

function assignRef(
  ref: ForwardedRef<HTMLElement> | undefined,
  value: HTMLSpanElement | null,
): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function resolveStatusMessage(
  status: CopyButtonStatus,
  labels: Readonly<{ copied: string; error: string; loading: string }>,
): string {
  if (status === 'copying') return labels.loading;
  if (status === 'copied') return labels.copied;
  if (status === 'error' || status === 'unsupported') return labels.error;
  return '';
}

function resolveVisibleLabel(
  status: CopyButtonStatus,
  labels: Readonly<{ copied: string; idle: string; loading: string }>,
): string {
  if (status === 'copying') return labels.loading;
  if (status === 'copied') return labels.copied;
  return labels.idle;
}

export function CopyButtonRenderer(props: CopyButtonRuntimeProps): ReactElement {
  const root = 'peaui-copy-button';
  const label = props.label ?? 'Kopiuj';
  const copiedLabel = props.copiedLabel ?? 'Skopiowano';
  const errorLabel = props.errorLabel ?? 'Nie udało się skopiować';
  const loadingLabel = props.loadingLabel ?? 'Kopiowanie';
  const content = props.content ?? 'icon-text';
  const loading = props.loading ?? false;
  const [internalStatus, setInternalStatus] = useState<CopyButtonStatus>('idle');
  const internalStatusRef = useRef<CopyButtonStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestId = useRef(0);
  const mounted = useRef<boolean>(true);
  const status: CopyButtonStatus = loading ? 'copying' : internalStatus;
  const busy = status === 'copying';
  const nativelyDisabled = Boolean(props.disabled) || loading;
  const blocked = nativelyDisabled || busy;
  const statusMessage = resolveStatusMessage(status, {
    copied: copiedLabel,
    error: errorLabel,
    loading: loadingLabel,
  });
  const visibleLabel = resolveVisibleLabel(status, {
    copied: copiedLabel,
    idle: label,
    loading: loadingLabel,
  });
  const slotState: CopyButtonStatusSlotState = { message: statusMessage, status };
  const testId = props.dataTestId ?? props['data-testid'];
  const accessibleName = props['aria-label'] ?? props.ariaLabel ?? label;

  const clearResetTimer = (): void => {
    if (resetTimer.current === undefined) return;
    clearTimeout(resetTimer.current);
    resetTimer.current = undefined;
  };

  const updateStatus = (next: CopyButtonStatus): void => {
    if (!mounted.current || internalStatusRef.current === next) return;
    internalStatusRef.current = next;
    setInternalStatus(next);
    props.onStatusChange?.(next);
  };

  const scheduleReset = (): void => {
    clearResetTimer();
    const delay = normalizeCopyButtonResetDelay(props.resetDelay ?? 2000);
    if (delay === 0) return;
    resetTimer.current = setTimeout(() => {
      resetTimer.current = undefined;
      updateStatus('idle');
    }, delay);
  };

  const handleCopy = async (): Promise<void> => {
    if (blocked) return;
    clearResetTimer();
    const activeRequest = ++requestId.current;
    const isStaleRequest = (): boolean => !mounted.current || activeRequest !== requestId.current;
    updateStatus('copying');
    let text: string | undefined;

    try {
      const resolved = props.getText ? await props.getText() : (props.text ?? '');
      if (typeof resolved !== 'string') {
        throw new TypeError('CopyButton text resolver must return a string');
      }
      if (isStaleRequest()) return;
      text = resolved;
      props.onCopy?.({ text });
      const method = await copyToClipboard(text);
      if (isStaleRequest()) return;
      updateStatus('copied');
      props.onSuccess?.({ method, text });
      scheduleReset();
    } catch (error) {
      if (isStaleRequest()) return;
      const errorStatus = resolveCopyButtonErrorStatus(error);
      updateStatus(errorStatus);
      props.onError?.({ error, status: errorStatus, text });
      scheduleReset();
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestId.current += 1;
      clearResetTimer();
    };
  }, []);

  const icon =
    status === 'copied'
      ? (renderSlot(props.copiedIcon, slotState) ??
        props.__renderIcon?.({ __name: 'SvgIcon', 'aria-hidden': true, name: 'clipboard-check' }))
      : (renderSlot(props.icon, slotState) ??
        props.__renderIcon?.({ __name: 'SvgIcon', 'aria-hidden': true, name: 'copy' }));

  const buttonContent = (
    <>
      {busy ? <span aria-hidden="true" className={`${root}__spinner`} /> : null}
      {!busy && content !== 'text' ? (
        <span aria-hidden="true" className={`${root}__icon`}>
          {icon}
        </span>
      ) : null}
      {content !== 'icon' ? (
        <span className={`${root}__label`}>
          {renderSlot(props.children, slotState) ?? visibleLabel}
        </span>
      ) : null}
    </>
  );

  return (
    <span
      className={[
        root,
        `${root}--content-${content}`,
        `${root}--status-${status}`,
        props.showStatus === true ? `${root}--with-status` : '',
        props.className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-status={status}
      data-testid={testId}
      ref={(element) => assignRef(props.forwardedRef, element)}
      style={props.style}
    >
      {props.__renderButton?.(
        {
          __name: 'ButtonAction',
          'aria-busy': busy || undefined,
          'aria-describedby': props['aria-describedby'],
          'aria-disabled': blocked || undefined,
          'aria-label': props['aria-labelledby'] === undefined ? accessibleName : undefined,
          'aria-labelledby': props['aria-labelledby'],
          className: `${root}__button`,
          dataTestId: testId ? `${testId}-button` : undefined,
          disabled: nativelyDisabled,
          onClick: () => void handleCopy(),
          size: props.size ?? 'm',
          type: props.type ?? 'button',
          variant: props.variant ?? 'secondary',
        },
        buttonContent,
      )}
      <span
        aria-atomic="true"
        aria-live={status === 'error' || status === 'unsupported' ? 'assertive' : 'polite'}
        className={`${root}__status${props.showStatus === true ? '' : ` ${root}__status--sr-only`}`}
        role={status === 'error' || status === 'unsupported' ? 'alert' : 'status'}
      >
        {props.renderStatus?.(slotState) ?? statusMessage}
      </span>
    </span>
  );
}
