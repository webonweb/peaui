/** @jsxImportSource react */
import type { CSSProperties, ReactElement } from 'react';
import type { ReactIconData } from '../generated-icon-data';
import { cx } from './runtime.shared';

export type SvgMarkupProps = {
  data?: ReactIconData;
  className?: string;
  dataTestId?: string;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  ariaHidden?: boolean | 'false' | 'true';
  role?: string;
  style?: CSSProperties;
  tabIndex?: number;
};

/** Pure SVG markup for bundled icons; does not load or initialize the icon catalog. */
export function renderSvgMarkup({
  data: icon,
  className,
  dataTestId,
  label,
  labelledBy,
  describedBy,
  ariaHidden,
  role,
  style,
  tabIndex,
}: SvgMarkupProps): ReactElement {
  const hasAccessibleName = Boolean(label || labelledBy);
  const isExplicitlyHidden = ariaHidden === true || ariaHidden === 'true';

  return (
    <svg
      aria-describedby={describedBy}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={cx('peaui-svg-icon', className)}
      data-testid={dataTestId}
      dangerouslySetInnerHTML={{ __html: icon?.body ?? '' }}
      fill={icon?.fill}
      focusable="false"
      role={role ?? (hasAccessibleName && !isExplicitlyHidden ? 'img' : undefined)}
      stroke={icon?.stroke}
      strokeLinecap={icon?.strokeLinecap}
      strokeLinejoin={icon?.strokeLinejoin}
      strokeWidth={icon?.strokeWidth}
      style={style}
      tabIndex={tabIndex}
      viewBox={icon?.viewBox ?? '0 0 24 24'}
    />
  );
}
