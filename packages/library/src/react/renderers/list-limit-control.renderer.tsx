/** @jsxImportSource react */

import { type RuntimeProps, useModel, text, common, cx } from './runtime.shared';
import { type ForwardedRef, type ReactElement, useId } from 'react';
import { SelectRenderer } from './select.renderer';

export function ListLimitControlRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const [limit, setLimit] = useModel<number>(props, 'limit', 10);
  const list = Array.isArray(props.limitList)
    ? props.limitList.filter((item): item is number => typeof item === 'number')
    : [5, 10, 25, 50];
  const position = text(props, 'position', 'bottom');
  const generatedId = useId();
  const id = text(props, 'id') || generatedId;
  const labelId = `peaui-list-limit-control-label-${id}-${generatedId}`;

  return (
    <div
      {...common(props)}
      className={cx(
        'peaui-list-limit-control',
        `peaui-list-limit-control--position-${position}`,
        props.className,
      )}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      role="group"
      aria-labelledby={labelId}
    >
      <label id={labelId} className="peaui-list-limit-control__label" htmlFor={`page-size-${id}`}>
        {props.children ?? text(props, 'label')}
      </label>
      <SelectRenderer
        __name="FormSelect"
        className={cx(
          'peaui-list-limit-control__select',
          `peaui-list-limit-control__select--position-${position}`,
        )}
        id={`page-size-${id}`}
        aria-labelledby={labelId}
        name={`page-size-${id}`}
        options={list.map((item) => ({ label: String(item), value: item }))}
        placement={position}
        searchable={false}
        size="xs"
        value={String(limit)}
        onValueChange={(next: unknown) => setLimit(Number(next))}
      />
    </div>
  );
}
