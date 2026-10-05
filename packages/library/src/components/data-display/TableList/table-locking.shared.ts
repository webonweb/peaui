import { TABLE_LIST_DEFAULT_COLUMN_WIDTH, type TableLockedColumnMeta } from './shared';

export function buildTableLockedColumnsMap(
  visibleColumns: Array<{ key: string; width?: number; withLock?: boolean }>,
  lockedColumns: Record<string, boolean | undefined>,
  viewportLeft: number,
  viewportWidth: number,
  baseRightOffset = 0,
): Record<string, TableLockedColumnMeta> {
  const nextLockedColumns: Record<string, TableLockedColumnMeta> = {};
  const viewportRight = viewportLeft + viewportWidth;
  const lockedColumnsPositions = visibleColumns.map((column, index) => {
    const width = column.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH;
    const start = visibleColumns
      .slice(0, index)
      .reduce(
        (sum, currentColumn) => sum + (currentColumn.width ?? TABLE_LIST_DEFAULT_COLUMN_WIDTH),
        0,
      );

    return {
      column,
      end: start + width,
      start,
      width,
    };
  });
  const activeLockedColumns = lockedColumnsPositions.filter(
    ({ column }) => column.withLock === true && lockedColumns[column.key] === true,
  );
  let leftOffset = 0;
  let rightOffset = baseRightOffset;

  function assignLeft(columnKey: string, width: number): void {
    nextLockedColumns[columnKey] = {
      offset: leftOffset,
      side: 'left',
    };
    leftOffset += width;
  }

  function assignRight(columnKey: string, width: number): void {
    nextLockedColumns[columnKey] = {
      offset: rightOffset,
      side: 'right',
    };
    rightOffset += width;
  }

  function getPreferredSide({ end, start }: { end: number; start: number }): 'left' | 'right' {
    const leftBoundary = viewportLeft + leftOffset;
    const rightBoundary = viewportRight - rightOffset;

    if (start < leftBoundary) {
      return 'left';
    }

    if (end > rightBoundary) {
      return 'right';
    }

    const distanceToLeft = Math.abs(start - leftBoundary);
    const distanceToRight = Math.abs(rightBoundary - end);

    return distanceToLeft <= distanceToRight ? 'left' : 'right';
  }

  let leftIndex = 0;
  let rightIndex = activeLockedColumns.length - 1;

  while (leftIndex <= rightIndex) {
    const leftCandidate = activeLockedColumns[leftIndex];
    const rightCandidate = activeLockedColumns[rightIndex];

    if (leftCandidate === undefined || rightCandidate === undefined) {
      break;
    }

    const leftForced = leftCandidate.start < viewportLeft + leftOffset;
    const rightForced = rightCandidate.end > viewportRight - rightOffset;
    const preferLeft = getPreferredSide(leftCandidate) === 'left';
    const preferRight = getPreferredSide(rightCandidate) === 'right';

    if (leftIndex === rightIndex) {
      if (leftForced) {
        assignLeft(leftCandidate.column.key, leftCandidate.width);
      } else if (rightForced) {
        assignRight(rightCandidate.column.key, rightCandidate.width);
      } else if (preferLeft) {
        assignLeft(leftCandidate.column.key, leftCandidate.width);
      } else {
        assignRight(rightCandidate.column.key, rightCandidate.width);
      }

      break;
    }

    if (leftForced && rightForced) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      assignRight(rightCandidate.column.key, rightCandidate.width);
      leftIndex += 1;
      rightIndex -= 1;
      continue;
    }

    if (leftForced) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      leftIndex += 1;
      continue;
    }

    if (rightForced) {
      assignRight(rightCandidate.column.key, rightCandidate.width);
      rightIndex -= 1;
      continue;
    }

    if (preferLeft && preferRight) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      assignRight(rightCandidate.column.key, rightCandidate.width);
      leftIndex += 1;
      rightIndex -= 1;
      continue;
    }

    if (preferLeft) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      leftIndex += 1;
      continue;
    }

    if (preferRight) {
      assignRight(rightCandidate.column.key, rightCandidate.width);
      rightIndex -= 1;
      continue;
    }

    const leftOccupiedWidth = leftOffset;
    const rightOccupiedWidth = rightOffset - baseRightOffset;

    if (leftOccupiedWidth <= rightOccupiedWidth) {
      assignLeft(leftCandidate.column.key, leftCandidate.width);
      leftIndex += 1;
      continue;
    }

    assignRight(rightCandidate.column.key, rightCandidate.width);
    rightIndex -= 1;
  }

  return nextLockedColumns;
}
