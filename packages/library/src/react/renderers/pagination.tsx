/** @jsxImportSource react */
import { type RuntimeProps, num, useModel, cx, common, text } from './runtime.shared';
import { iconArrowRounded, iconDoubleArrowRounded } from '../generated-static-icons';
import { type ForwardedRef, type ReactElement, useMemo } from 'react';
import { Svg } from './svg.renderer';
import { getPaginationRange } from '../../components/navigation/PaginationControl/pagination.shared';

export function Pagination({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const totalPages = num(props, 'totalPages', 1);
  const [page, setPage] = useModel<number>(props, 'page', 1);
  const range = useMemo(() => getPaginationRange(totalPages, page), [page, totalPages]);
  const { total, current, pages, leading: showLeading, trailing: showTrailing } = range;
  const pageButton = (item: number): ReactElement => (
    <button
      key={item}
      aria-current={item === current ? 'page' : undefined}
      className={cx(
        'peaui-pagination-control__button',
        'peaui-pagination-control__button--page',
        item === current && 'peaui-pagination-control__button--current',
      )}
      disabled={item === current}
      type="button"
      onClick={() => setPage(item)}
    >
      {item}
    </button>
  );
  return (
    <nav
      {...common(props)}
      aria-label={text(props, 'ariaLabel', 'Paginacja')}
      className={cx('peaui-pagination-control', props.className)}
      data-current-page={current}
      data-total-pages={total}
      ref={forwardedRef}
    >
      <div className="peaui-pagination-control__controls peaui-pagination-control__controls--start">
        <button
          aria-label="Przejdź do pierwszej strony"
          className="peaui-pagination-control__button"
          disabled={current === 1}
          type="button"
          onClick={() => setPage(1)}
        >
          <Svg
            data={iconDoubleArrowRounded}
            className="peaui-pagination-control__icon peaui-pagination-control__icon--first"
            name="doubleArrowRounded"
          />
        </button>
        <button
          aria-label="Przejdź do poprzedniej strony"
          className="peaui-pagination-control__button"
          disabled={current === 1}
          type="button"
          onClick={() => setPage(current - 1)}
        >
          <Svg
            data={iconArrowRounded}
            className="peaui-pagination-control__icon peaui-pagination-control__icon--previous"
            name="arrowRounded"
          />
        </button>
      </div>
      <div className="peaui-pagination-control__pages">
        {showLeading ? pageButton(1) : null}
        {range.leadingGap ? (
          <div aria-hidden="true" className="peaui-pagination-control__ellipsis">
            ...
          </div>
        ) : null}
        {pages.map(pageButton)}
        {range.trailingGap ? (
          <div aria-hidden="true" className="peaui-pagination-control__ellipsis">
            ...
          </div>
        ) : null}
        {showTrailing ? pageButton(total) : null}
      </div>
      <div className="peaui-pagination-control__controls peaui-pagination-control__controls--end">
        <button
          aria-label="Przejdź do kolejnej strony"
          className="peaui-pagination-control__button"
          disabled={current === total}
          type="button"
          onClick={() => setPage(current + 1)}
        >
          <Svg
            data={iconArrowRounded}
            className="peaui-pagination-control__icon peaui-pagination-control__icon--next"
            name="arrowRounded"
          />
        </button>
        <button
          aria-label="Przejdź do ostatniej strony"
          className="peaui-pagination-control__button"
          disabled={current === total}
          type="button"
          onClick={() => setPage(total)}
        >
          <Svg
            data={iconDoubleArrowRounded}
            className="peaui-pagination-control__icon peaui-pagination-control__icon--last"
            name="doubleArrowRounded"
          />
        </button>
      </div>
    </nav>
  );
}
