/** @jsxImportSource react */
/* eslint-disable no-nested-ternary */
import {
  type RuntimeProps,
  useModel,
  common,
  cx,
  text,
  bool,
  num,
  callback,
} from './runtime.shared';
import { iconArrow, iconClose, iconTrial, iconTrialCurve } from '../generated-static-icons';
import { type ReactElement, type ReactNode, type ForwardedRef, useState, useId } from 'react';
import { Svg } from './svg.renderer';

export function Tree({
  props,
  forwardedRef,
}: {
  props: RuntimeProps;
  forwardedRef?: ForwardedRef<HTMLElement>;
}): ReactElement {
  const [tree] = useModel<unknown>(props, 'tree', []);
  const items = Array.isArray(tree) ? tree : [tree];
  return (
    <div
      {...common(props)}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      className={cx('peaui-tree-list-catalog', props.className)}
    >
      {items.map((entry, index) => {
        const record = typeof entry === 'object' && entry !== null ? (entry as RuntimeProps) : {};
        return (
          <TreeNode
            key={text(record, 'id', String(index))}
            canRemove={bool(props, 'canRemove')}
            disabled={bool(props, 'disabled') || bool(record, 'disabled')}
            isLast={index === items.length - 1}
            level={num(props, 'level', 1)}
            record={record}
            nodeKey={
              text(record, 'id') || text(props, 'id', Array.isArray(tree) ? String(index) : '')
            }
            leafContent={props.children}
            onRemove={(id) => callback(props, 'onRemove')?.(id)}
          />
        );
      })}
    </div>
  );
}

export function TreeNode({
  nodeKey,
  leafContent,
  record,
  level,
  isLast,
  disabled,
  canRemove,
  onRemove,
}: {
  nodeKey: string;
  leafContent?: ReactNode;
  record: RuntimeProps;
  level: number;
  isLast: boolean;
  disabled: boolean;
  canRemove: boolean;
  onRemove: (id: string) => void;
}): ReactElement {
  const rawChildren = record.children;
  const children = Array.isArray(rawChildren)
    ? rawChildren.map((child, index) => [String(index), child] as const)
    : typeof rawChildren === 'object' && rawChildren !== null
      ? Object.entries(rawChildren)
      : [];
  const hasChildren = children.length > 0;
  const [open, setOpen] = useState(false);
  const contentId = `tree-content-${useId()}`;
  const label = text(record, 'label') || text(record, 'name', 'Element');
  const root = 'peaui-tree-list';
  return (
    <div
      className={cx(
        root,
        `${root}--level-${level}`,
        hasChildren ? `${root}--branch` : `${root}--leaf`,
        disabled && `${root}--disabled`,
      )}
    >
      <div
        className={cx(
          `${root}__row`,
          `${root}__row--level-${level}`,
          disabled && `${root}__row--disabled`,
        )}
      >
        {level === 2 ? (
          <Svg
            data={isLast ? iconTrialCurve : iconTrial}
            className={`${root}__connector ${root}__connector--level-two`}
            name={isLast ? 'trialCurve' : 'trial'}
          />
        ) : null}
        {level === 3 ? (
          <Svg
            data={isLast ? iconTrialCurve : iconTrial}
            className={`${root}__connector ${root}__connector--level-three`}
            name={isLast ? 'trialCurve' : 'trial'}
          />
        ) : null}
        {hasChildren ? (
          <button
            aria-expanded={open}
            aria-controls={contentId}
            className={cx(`${root}__toggle`, disabled && `${root}__toggle--disabled`)}
            disabled={disabled}
            type="button"
            onClick={() => setOpen((current) => !current)}
          >
            <Svg
              data={iconArrow}
              className={cx(
                `${root}__toggle-icon`,
                open ? `${root}__toggle-icon--open` : `${root}__toggle-icon--closed`,
              )}
              name="arrow"
            />
            <span className={cx(`${root}__label`, level === 1 && `${root}__label--emphasized`)}>
              {label}
            </span>
          </button>
        ) : (
          <div className={`${root}__leaf-content`}>
            <span className={`${root}__label`}>{label}</span>
            <span className={`${root}__leaf-meta`}>{leafContent}</span>
          </div>
        )}
        {canRemove ? (
          <button
            aria-label={`Usuń ${label}`}
            className={`${root}__remove`}
            disabled={disabled}
            type="button"
            onClick={() => onRemove(nodeKey)}
          >
            <Svg data={iconClose} className={`${root}__remove-icon`} name="close" />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <div className={`${root}__content`}>
          {level === 1 ? <span aria-hidden="true" className={`${root}__branch-line`} /> : null}
          <ul className={`${root}__children`} id={contentId}>
            {children.map(([childKey, child], index) => {
              const childRecord =
                typeof child === 'object' && child !== null ? (child as RuntimeProps) : {};
              return (
                <li key={childKey} className={`${root}__child`}>
                  <TreeNode
                    canRemove={canRemove}
                    disabled={disabled || bool(childRecord, 'disabled')}
                    isLast={index === children.length - 1}
                    level={level + 1}
                    record={childRecord}
                    nodeKey={
                      Array.isArray(rawChildren) ? text(childRecord, 'id', childKey) : childKey
                    }
                    leafContent={leafContent}
                    onRemove={onRemove}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
