/** @jsxImportSource react */
import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  createKeyboardKeyAccessibleLabel,
  detectKeyboardPlatform,
  resolveKeyboardKeyCombination,
  type KeyboardKeyFormat,
  type KeyboardKeyPlatform,
  type KeyboardKeySize,
  type KeyboardKeySlotState,
  type ResolvedKeyboardKeyPlatform,
} from './keyboard-key.shared';

export type KeyboardKeyProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'aria-keyshortcuts' | 'aria-label' | 'children' | 'role' | 'size' | 'tabIndex'
> & {
  keys: string | readonly string[];
  platform?: KeyboardKeyPlatform;
  format?: KeyboardKeyFormat;
  size?: KeyboardKeySize;
  inline?: boolean;
  separator?: string;
  ariaLabel?: string;
  muted?: boolean;
  dataTestId?: string;
  renderKey?: (state: KeyboardKeySlotState) => ReactNode;
  renderSeparator?: (state: { index: number; separator: string }) => ReactNode;
};

export type {
  KeyboardKeyFormat,
  KeyboardKeyPlatform,
  KeyboardKeySize,
  KeyboardKeySlotState,
  ResolvedKeyboardKeyPlatform,
} from './keyboard-key.shared';

function detectClientPlatform(): ResolvedKeyboardKeyPlatform {
  if (typeof navigator === 'undefined') return 'generic';
  return detectKeyboardPlatform(navigator.userAgent, navigator.platform);
}

const KeyboardKey = forwardRef<HTMLSpanElement, KeyboardKeyProps>(function KeyboardKey(
  {
    keys,
    platform = 'auto',
    format = 'symbol',
    size = 's',
    inline = true,
    separator = '+',
    ariaLabel = '',
    muted = false,
    dataTestId,
    renderKey,
    renderSeparator,
    className,
    style,
    ...rest
  },
  ref,
): ReactElement {
  const [detectedPlatform, setDetectedPlatform] = useState<ResolvedKeyboardKeyPlatform>('generic');
  const resolvedPlatform = platform === 'auto' ? detectedPlatform : platform;
  const states = useMemo(
    () => resolveKeyboardKeyCombination(keys, resolvedPlatform, format),
    [format, keys, resolvedPlatform],
  );
  const accessibleLabel = createKeyboardKeyAccessibleLabel(states, ariaLabel);
  const resolvedTestId =
    dataTestId ??
    (rest as HTMLAttributes<HTMLSpanElement> & { 'data-testid'?: string })['data-testid'];
  const classes = [
    'peaui-keyboard-key',
    `peaui-keyboard-key--${inline ? 'inline' : 'block'}`,
    `peaui-keyboard-key--size-${size}`,
    muted && 'peaui-keyboard-key--muted',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    setDetectedPlatform(platform === 'auto' ? detectClientPlatform() : platform);
  }, [platform]);

  const renderKeycap = (state: KeyboardKeySlotState): ReactElement => (
    <kbd className="peaui-keyboard-key__key" data-key={state.key}>
      {renderKey?.(state) ?? state.visualLabel}
    </kbd>
  );

  return (
    <span
      {...rest}
      ref={ref}
      className={classes}
      style={style}
      data-format={format}
      data-inline={inline || undefined}
      data-muted={muted || undefined}
      data-platform={resolvedPlatform}
      data-testid={resolvedTestId}
    >
      <span className="peaui-keyboard-key__accessible">{accessibleLabel}</span>
      <span className="peaui-keyboard-key__visual" aria-hidden="true">
        {states[0] ? renderKeycap(states[0]) : null}
        {states.slice(1).map((state) => (
          <span className="peaui-keyboard-key__segment" key={`${state.index}-${state.token}`}>
            <span className="peaui-keyboard-key__separator">
              {renderSeparator?.({ index: state.index, separator }) ?? separator}
            </span>
            {renderKeycap(state)}
          </span>
        ))}
      </span>
    </span>
  );
});

KeyboardKey.displayName = 'KeyboardKey';

export default KeyboardKey;
