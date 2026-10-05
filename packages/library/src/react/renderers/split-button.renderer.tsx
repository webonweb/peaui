/** @jsxImportSource react */

import { type RuntimeProps, text, bool, dataTest, node, cx, callback } from './runtime.shared';
import { iconArrowRounded } from '../generated-static-icons';
import { type ForwardedRef, type ReactElement, type ReactNode } from 'react';
import { type ReactDropdownMenuItem, DropdownMenuRenderer } from './dropdown-menu.renderer';
import { Svg } from './svg.renderer';

export function SplitButtonRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const root = 'peaui-split-button';
  const label = text(props, 'label', 'Akcja');
  const variant = text(props, 'variant', 'primary');
  const size = text(props, 'size', 'm');
  const disabled = bool(props, 'disabled');
  const loading = bool(props, 'loading');
  const menuLoading = bool(props, 'menuLoading');
  const primaryBlocked = disabled || bool(props, 'primaryDisabled') || loading;
  const menuBlocked = disabled || bool(props, 'menuDisabled');
  const menuAriaLabel = text(props, 'menuAriaLabel') || `Więcej opcji: ${label}`;
  const baseTestId = dataTest(props);
  const renderLabel = node(props, 'labelContent') ?? props.children ?? label;
  const renderIcon = node(props, 'iconContent');
  const renderMenuTriggerIcon = node(props, 'menuTriggerIconContent');
  const renderMenuItem = props.renderMenuItem as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;
  const renderMenuItemIcon = props.renderMenuItemIcon as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;
  const renderMenuItemShortcut = props.renderMenuItemShortcut as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;
  const renderGroupLabel = props.renderGroupLabel as
    ((item: ReactDropdownMenuItem, path: number[]) => ReactNode) | undefined;
  const renderTrigger = (): ReactElement => (
    <button
      aria-busy={menuLoading || undefined}
      aria-label={menuAriaLabel}
      className={cx(
        'peaui-button-action',
        'peaui-split-button__trigger',
        `peaui-button-action--size-${size}`,
        `peaui-button-action--variant-${variant}`,
        menuBlocked && 'peaui-button-action--is-disabled',
      )}
      data-testid={baseTestId ? `${baseTestId}-trigger` : undefined}
      disabled={menuBlocked}
      type="button"
    >
      <span aria-hidden="true" className="peaui-split-button__trigger-icon">
        {renderMenuTriggerIcon ?? <Svg data={iconArrowRounded} name="arrowRounded" />}
      </span>
    </button>
  );

  return (
    <div
      aria-label={text(props, 'ariaLabel') || label}
      className={cx(
        root,
        `${root}--variant-${variant}`,
        `${root}--size-${size}`,
        disabled && `${root}--disabled`,
        primaryBlocked && `${root}--primary-disabled`,
        menuBlocked && `${root}--menu-disabled`,
        loading && `${root}--loading`,
        menuLoading && `${root}--menu-loading`,
        props.open === true && `${root}--open`,
        props.className,
      )}
      data-testid={baseTestId}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      role="group"
      style={props.style}
    >
      <button
        aria-busy={loading || undefined}
        aria-label={label}
        className={cx(
          'peaui-button-action',
          'peaui-split-button__primary',
          `peaui-button-action--size-${size}`,
          `peaui-button-action--variant-${variant}`,
          primaryBlocked && 'peaui-button-action--is-disabled',
        )}
        data-testid={baseTestId ? `${baseTestId}-primary` : undefined}
        disabled={primaryBlocked}
        type={text(props, 'type', 'button') as 'button' | 'submit' | 'reset'}
        onClick={(event) => callback(props, 'onPrimaryClick')?.(event)}
      >
        {loading ? (
          <span aria-hidden="true" className="peaui-split-button__spinner" />
        ) : (
          (renderIcon ??
          (text(props, 'icon') ? (
            <Svg className="peaui-split-button__primary-icon" name={text(props, 'icon')} />
          ) : null))
        )}
        <span className="peaui-split-button__label">{renderLabel}</span>
      </button>
      {loading ? (
        <span className="peaui-split-button__status" role="status">
          {text(props, 'loadingLabel', 'Trwa wykonywanie głównej akcji')}
        </span>
      ) : null}
      <DropdownMenuRenderer
        align={text(props, 'menuAlign', 'end')}
        ariaLabel={menuAriaLabel}
        className="peaui-split-button__menu"
        closeOnSelect={props.closeOnSelect}
        dataTestId={baseTestId ? `${baseTestId}-dropdown` : undefined}
        defaultOpen={props.defaultOpen}
        disabled={menuBlocked}
        empty={node(props, 'emptyContent') ?? text(props, 'emptyLabel', 'Brak dostępnych akcji')}
        items={props.items}
        loading={menuLoading}
        loadingContent={
          node(props, 'menuLoadingContent') ?? text(props, 'menuLoadingLabel', 'Ładowanie menu…')
        }
        loop={props.loop}
        open={props.open}
        placement="bottom"
        renderGroupLabel={renderGroupLabel}
        renderItem={renderMenuItem}
        renderItemIcon={renderMenuItemIcon}
        renderItemShortcut={renderMenuItemShortcut}
        renderTrigger={renderTrigger}
        onOpenChange={(value: boolean) => callback(props, 'onOpenChange')?.(value)}
        onSelect={(item: ReactDropdownMenuItem, path: number[]) =>
          callback(props, 'onSelect')?.(item, path)
        }
      />
    </div>
  );
}
