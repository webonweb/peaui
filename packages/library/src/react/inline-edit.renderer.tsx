/** @jsxImportSource react */
import { Svg } from './renderers/svg.renderer';
import { iconEdit } from './generated-static-icons';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  areInlineEditValuesEqual,
  resolveInlineEditDisplayValue,
  resolveInlineEditValidation,
  type InlineEditActions,
  type InlineEditActivation,
  type InlineEditDisplay,
  type InlineEditEditor,
  type InlineEditInvalidDetail,
  type InlineEditOption,
  type InlineEditSaveDetail,
  type InlineEditSaveMode,
  type InlineEditSlotState,
  type InlineEditTabBehavior,
  type InlineEditValidate,
  type InlineEditValue,
} from '../components/data-entry/InlineEdit/inline-edit.shared';

type InternalFieldName = 'FormInput' | 'FormNumber' | 'FormSelect' | 'FormTextarea';
type InternalFieldRenderer = (name: InternalFieldName, props: Record<string, unknown>) => ReactNode;
type InternalButtonRenderer = (props: Record<string, unknown>, children: ReactNode) => ReactNode;

export type InlineEditRuntimeProps = {
  value?: InlineEditValue;
  defaultValue?: InlineEditValue;
  editing?: boolean;
  defaultEditing?: boolean;
  editor?: InlineEditEditor;
  editorProps?: Record<string, unknown>;
  activation?: InlineEditActivation;
  actions?: InlineEditActions;
  display?: InlineEditDisplay;
  tabBehavior?: InlineEditTabBehavior;
  saveMode?: InlineEditSaveMode;
  validate?: InlineEditValidate;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  emptyText?: string;
  editAriaLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  dataTestId?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  empty?: ReactNode;
  displayContent?: ReactNode;
  renderDisplay?: (value: InlineEditValue) => ReactNode;
  renderEditor?: (state: InlineEditSlotState) => ReactNode;
  renderActions?: (state: {
    cancel: () => void;
    dirty: boolean;
    loading: boolean;
    save: () => void;
  }) => ReactNode;
  renderError?: (message: string) => ReactNode;
  onValueChange?: (value: InlineEditValue) => void;
  onEditingChange?: (editing: boolean) => void;
  onEdit?: (value: InlineEditValue) => void;
  onSave?: (detail: InlineEditSaveDetail) => void;
  onCancel?: (value: InlineEditValue) => void;
  onInvalid?: (detail: InlineEditInvalidDetail) => void;
  onDraftChange?: (value: InlineEditValue) => void;
  'data-testid'?: string;
  forwardedRef?: ForwardedRef<HTMLElement>;
  __renderField?: InternalFieldRenderer;
  __renderButton?: InternalButtonRenderer;
};

function cx(...values: Array<string | false | undefined>): string {
  return values.filter((value): value is string => Boolean(value)).join(' ');
}

function assignRef(ref: ForwardedRef<HTMLElement> | undefined, value: HTMLDivElement | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function useControlledState<T>(
  controlled: T | undefined,
  initial: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [local, setLocal] = useState(initial);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : local;
  const setValue = (next: T): void => {
    if (!isControlled) setLocal(next);
    onChange?.(next);
  };
  return [value, setValue];
}

export function InlineEditRenderer(props: InlineEditRuntimeProps): ReactElement {
  const root = 'peaui-inline-edit';
  const editor = props.editor ?? 'text';
  const activation = props.activation ?? 'button';
  const actions = props.actions ?? 'both';
  const display = props.display ?? 'inline';
  const tabBehavior = props.tabBehavior ?? 'commit';
  const saveMode = props.saveMode ?? 'sync';
  const loading = props.loading ?? false;
  const disabled = props.disabled ?? false;
  const readonly = props.readonly ?? false;
  const generatedId = useId().replaceAll(':', '');
  const editorId = `${root}-${generatedId}-editor`;
  const instructionsId = `${editorId}-instructions`;
  const errorId = `${editorId}-error`;
  const [value, setValue] = useControlledState(
    props.value,
    props.defaultValue,
    props.onValueChange,
  );
  const [editing, setEditing] = useControlledState(
    props.editing,
    props.defaultEditing ?? false,
    props.onEditingChange,
  );
  const [draft, setDraft] = useState<InlineEditValue>(value);
  const [validationError, setValidationError] = useState<string>();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const previousEditing = useRef(false);
  const options = Array.isArray(props.editorProps?.options)
    ? (props.editorProps.options as InlineEditOption[])
    : [];
  const activeError = validationError ?? props.error?.trim() ?? undefined;
  const dirty = !areInlineEditValuesEqual(draft, value);
  const blocked = disabled || readonly || loading;
  const displayValue = resolveInlineEditDisplayValue(value, editor, options);
  const baseTestId = props.dataTestId ?? props['data-testid'];

  const focusEditor = (): void => {
    const host = editorRef.current;
    host
      ?.querySelector<HTMLElement>(
        '[data-inline-edit-control], input:not([disabled]), textarea:not([disabled]), [role="combobox"], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      ?.focus();
  };

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useLayoutEffect(() => {
    const wasEditing = previousEditing.current;
    previousEditing.current = editing;
    if (editing && !wasEditing) {
      setDraft(value);
      setValidationError(undefined);
      focusEditor();
    } else if (!editing && wasEditing) {
      setValidationError(undefined);
      triggerRef.current?.focus();
    }
  }, [editing, value]);

  const updateDraft = (next: InlineEditValue): void => {
    if (loading) return;
    setDraft(next);
    setValidationError(undefined);
    props.onDraftChange?.(next);
  };

  const startEditing = (): void => {
    if (blocked || editing) return;
    setDraft(value);
    setValidationError(undefined);
    setEditing(true);
    props.onEdit?.(value);
  };

  const save = (): void => {
    if (blocked) return;
    const message = resolveInlineEditValidation(props.validate, draft);
    if (message) {
      setValidationError(message);
      props.onInvalid?.({ message, previousValue: value, value: draft });
      queueMicrotask(focusEditor);
      return;
    }

    const detail = { previousValue: value, value: draft };
    props.onSave?.(detail);
    if (saveMode === 'async') return;
    setValue(draft);
    setEditing(false);
  };

  const cancel = (): void => {
    if (loading) return;
    setDraft(value);
    setValidationError(undefined);
    props.onCancel?.(value);
    setEditing(false);
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
      return;
    }
    if (event.key === 'Tab') {
      if (tabBehavior === 'stay') event.preventDefault();
      else if (tabBehavior === 'commit') save();
      else cancel();
      return;
    }
    if (actions === 'buttons') return;
    const requestsSave =
      editor === 'textarea'
        ? event.key === 'Enter' && (event.ctrlKey || event.metaKey)
        : event.key === 'Enter' && !event.shiftKey;
    if (!requestsSave) return;
    event.preventDefault();
    save();
  };

  const describedBy = activeError ? `${instructionsId} ${errorId}` : instructionsId;
  const fieldProps: Record<string, unknown> = {
    ...props.editorProps,
    'aria-describedby': describedBy,
    'aria-invalid': activeError ? 'true' : undefined,
    ariaLabel: props.editAriaLabel ?? 'Edytuj wartość',
    dataTestId: baseTestId ? `${baseTestId}-editor` : undefined,
    disabled: disabled || loading,
    error: activeError,
    id: editorId,
    name: editorId,
    options,
    readonly,
    value: draft,
    onValueChange: updateDraft,
  };

  const renderField = (): ReactNode => {
    if (editor === 'custom') {
      return props.renderEditor?.({ draft, error: activeError, loading, updateDraft });
    }
    const fieldNames: Record<Exclude<InlineEditEditor, 'custom'>, InternalFieldName> = {
      number: 'FormNumber',
      select: 'FormSelect',
      text: 'FormInput',
      textarea: 'FormTextarea',
    };
    const name = fieldNames[editor];
    return props.__renderField?.(name, fieldProps);
  };

  const renderButton = (
    kind: 'edit' | 'save' | 'cancel',
    label: string,
    variant: 'ghost' | 'primary' | 'secondary',
    buttonDisabled: boolean,
    onClick: () => void,
  ): ReactNode => {
    const buttonProps = {
      ariaLabel: kind === 'edit' ? label : undefined,
      className: `${root}__${kind === 'edit' ? 'edit-button' : 'action'}`,
      dataTestId: baseTestId ? `${baseTestId}-${kind}` : undefined,
      disabled: buttonDisabled,
      forwardedRef: kind === 'edit' ? triggerRef : undefined,
      onClick,
      onKeyDown:
        kind === 'edit'
          ? (event: KeyboardEvent<HTMLButtonElement>) => {
              if (event.key !== 'F2') return;
              event.preventDefault();
              startEditing();
            }
          : undefined,
      size: 'xs',
      variant,
    };
    return props.__renderButton?.(
      buttonProps,
      kind === 'edit' ? (
        <>
          <Svg data={iconEdit} name="edit" className={`${root}__button-icon`} />
          <span>{label}</span>
        </>
      ) : (
        label
      ),
    );
  };

  let componentState = 'display';
  if (editing) componentState = dirty ? 'editing-dirty' : 'editing-clean';
  if (activeError) componentState = 'invalid';
  if (loading) componentState = 'saving';

  return (
    <div
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      className={cx(
        root,
        `${root}--${display}`,
        `${root}--activation-${activation}`,
        editing && `${root}--editing`,
        dirty && `${root}--dirty`,
        Boolean(activeError) && `${root}--invalid`,
        loading && `${root}--loading`,
        disabled && `${root}--disabled`,
        readonly && `${root}--readonly`,
        props.className,
      )}
      data-state={componentState}
      data-testid={baseTestId}
      ref={(element) => {
        rootRef.current = element;
        assignRef(props.forwardedRef, element);
      }}
      style={props.style}
    >
      {!editing ? (
        <>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- The adjacent native Edit button provides keyboard activation; text clicks are a pointer shortcut. */}
          <span
            className={`${root}__display`}
            data-activatable={activation !== 'button' ? 'true' : undefined}
            onClick={activation === 'click' ? startEditing : undefined}
            onDoubleClick={activation === 'dblclick' ? startEditing : undefined}
          >
            {displayValue
              ? (props.renderDisplay?.(value) ??
                props.displayContent ??
                props.children ?? <span className={`${root}__value`}>{displayValue}</span>)
              : (props.empty ?? (
                  <span className={`${root}__empty`}>{props.emptyText ?? 'Brak wartości'}</span>
                ))}
          </span>
          {!readonly
            ? renderButton(
                'edit',
                props.editAriaLabel ?? 'Edytuj wartość',
                'ghost',
                disabled,
                startEditing,
              )
            : null}
        </>
      ) : (
        <div className={`${root}__editing`} ref={editorRef} onKeyDown={handleEditorKeyDown}>
          <div className={`${root}__editor`}>
            {renderField()}
            {editor === 'custom' && activeError ? (
              <p className={`${root}__error`} id={errorId} role="alert">
                {props.renderError?.(activeError) ?? activeError}
              </p>
            ) : null}
          </div>
          {actions === 'buttons' || actions === 'both' ? (
            <div className={`${root}__actions`}>
              {props.renderActions?.({ cancel, dirty, loading, save }) ?? (
                <>
                  {renderButton(
                    'save',
                    loading
                      ? (props.loadingLabel ?? 'Zapisywanie zmian')
                      : (props.saveLabel ?? 'Zapisz'),
                    'primary',
                    blocked || !dirty,
                    save,
                  )}
                  {renderButton(
                    'cancel',
                    props.cancelLabel ?? 'Anuluj',
                    'secondary',
                    loading,
                    cancel,
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      )}
      <span className={`${root}__sr-only`} id={instructionsId}>
        Escape anuluje edycję.{' '}
        {editor === 'textarea'
          ? 'Control lub Command z Enter zapisuje zmianę.'
          : 'Enter zapisuje zmianę.'}
      </span>
      {loading ? (
        <span aria-live="polite" className={`${root}__sr-only`} role="status">
          {props.loadingLabel ?? 'Zapisywanie zmian'}
        </span>
      ) : null}
    </div>
  );
}
