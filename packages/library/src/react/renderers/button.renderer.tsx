/** @jsxImportSource react */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type RuntimeProps, text, bool, common, cx, callback, num, node } from './runtime.shared';
import { iconArrow, iconDownload } from '../generated-static-icons';
import { type ForwardedRef, type ReactElement, useRef, useState } from 'react';
import { ButtonActionRenderer } from './button-action.renderer';
import { Svg } from './svg.renderer';
import { Popover } from './popover';
import { Dialog } from './dialog';
import { FormContainerLeafRenderer } from './form-container.renderer';

export function ButtonRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const kind = text(props, '__name');

  if (kind === 'ButtonAction')
    return <ButtonActionRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'ButtonExport')
    return <ButtonExportLeafRenderer {...props} forwardedRef={forwardedRef} />;
  if (kind === 'SelectableCard')
    return <SelectableCardLeafRenderer {...props} forwardedRef={forwardedRef} />;
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  return (
    <button
      {...common(props)}
      aria-pressed={bool(props, 'active')}
      className={cx(
        `peaui-${kind.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, '')}`,
        bool(props, 'active') && 'is-active',
        props.className,
      )}
      disabled={disabled || readonly}
      ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
      type="button"
      onClick={() => callback(props, 'onClick')?.()}
    >
      {node(props, 'title') ? <strong>{node(props, 'title')}</strong> : null}
      {node(props, 'description') ? <span>{node(props, 'description')}</span> : null}
      {props.children}
      {node(props, 'additional')}
    </button>
  );
}

export function ButtonExportLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const [exportOpen, setExportOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<string | undefined>();
  const triggerRef = useRef<HTMLElement | null>(null);
  const size = text(props, 'size', 'm');
  const variant = text(props, 'variant', 'secondary');
  const disabled = bool(props, 'disabled');
  const closePrompt = (): void => {
    setPendingFormat(undefined);
    triggerRef.current?.focus();
  };
  const exportRecords = (format: string): void => {
    if (disabled) return;
    setExportOpen(false);
    if (num(props, 'selectedItemsCount') === 0 && !bool(props, 'forceExport')) {
      setPendingFormat(format);
    } else {
      callback(props, 'onExport')?.(format);
      triggerRef.current?.focus();
    }
  };
  return (
    <>
      <Popover
        kind="PopoverButton"
        forwardedRef={(element) => {
          triggerRef.current = element;
          if (typeof forwardedRef === 'function') forwardedRef(element);
          else if (forwardedRef) forwardedRef.current = element;
        }}
        props={{
          ...props,
          size,
          variant,
          disabled,
          className: cx('peaui-button-export', props.className),
          open: exportOpen,
          onOpenChange: setExportOpen,
          matchTriggerWidth: true,
          popupType: 'menu',
          children: (
            <>
              <Svg data={iconDownload} className="peaui-button-export__icon" name="download" />
              {props.children ?? 'Eksportuj'}
              {num(props, 'selectedItemsCount') > 0 ? (
                <span className="peaui-counter-badge peaui-counter-badge--variant-info peaui-counter-badge--size-m">
                  {num(props, 'selectedItemsCount')}
                </span>
              ) : null}
              <Svg data={iconArrow} className="peaui-button-export__arrow" name="arrow" />
            </>
          ),
          content: (
            <div className="peaui-button-export__content">
              <h3 className="peaui-button-export__content-sr-only">Akcje eksportu</h3>
              <ul className="peaui-button-export__content-list">
                {[
                  ['csv', 'Do CSV'],
                  ['xlsx', 'Do XLSX'],
                  ['pdf', 'Do PDF'],
                ].map(([format, label]) => (
                  <li key={format} className="peaui-button-export__content-item">
                    <button
                      aria-label={`${label}. Wyeksportuj rekordy do pliku ${format?.toUpperCase()}`}
                      className="peaui-button-export__content-button"
                      role="menuitem"
                      tabIndex={-1}
                      type="button"
                      onClick={() => {
                        if (format) exportRecords(format);
                      }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ),
        }}
      />
      <Dialog
        kind="ModalDialog"
        props={{
          open: pendingFormat !== undefined,
          onOpenChange: (open: boolean) => {
            if (!open) closePrompt();
          },
          header: 'Potwierdzenie eksportu',
          children: (
            <FormContainerLeafRenderer
              label="Potwierdzenie czy wyeksportować wszystkie rekordy"
              submitButtonLabel="Eksportuj"
              showCancelButton
              actionsPosition="bottom-right"
              onCancel={closePrompt}
              onSubmit={() => {
                if (pendingFormat !== undefined && !disabled)
                  callback(props, 'onExport')?.(pendingFormat);
                closePrompt();
              }}
            >
              <p>
                Czy na pewno chcesz wyeksportować wszystkie rekordy rejestru do pliku zewnętrznego?
              </p>
            </FormContainerLeafRenderer>
          ),
        }}
      />
    </>
  );
}

export function SelectableCardLeafRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  return (
    <div className="peaui-selectable-card__wrapper">
      <button
        {...common(props)}
        aria-pressed={bool(props, 'active')}
        className={cx(
          'peaui-selectable-card',
          bool(props, 'active') && 'peaui-selectable-card--is-active',
          disabled && 'peaui-selectable-card--is-disabled',
          readonly && 'peaui-selectable-card--is-readonly',
          Boolean(node(props, 'hint')) && 'peaui-selectable-card--with-hint',
          props.className,
        )}
        disabled={disabled}
        ref={forwardedRef as ForwardedRef<HTMLButtonElement>}
        type="button"
        onClick={() => !readonly && callback(props, 'onClick')?.()}
      >
        <div className="peaui-selectable-card__content">
          {node(props, 'title') ? (
            <strong className="peaui-selectable-card__content__title">
              {node(props, 'title')}
            </strong>
          ) : null}
          {node(props, 'description') ? (
            <p className="peaui-selectable-card__content__description">
              {node(props, 'description')}
            </p>
          ) : null}
        </div>
        <div className="peaui-selectable-card__additional">{node(props, 'additional')}</div>
      </button>
      {node(props, 'hint') ? (
        <span className="peaui-selectable-card__hint" title={text(props, 'hint')}>
          <Svg className="peaui-selectable-card__hint-icon" name="info" />
        </span>
      ) : null}
    </div>
  );
}
