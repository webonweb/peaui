/** @jsxImportSource react */
import { useFormReset } from './renderers/runtime.shared';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent as ReactClipboardEvent,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  createTagsInputMatcher,
  commitTagsInput,
  getTagsInputKey,
  getTagsInputLabel,
  isTagsInputItemDisabled,
  normalizeTagsInputMax,
  parseTagsInput,
  serializeTagsInputTag,
  type FormTagsInputCommitOptions,
  type FormTagsInputInvalidDetail,
  type FormTagsInputKeyGetter,
  type FormTagsInputLayout,
  type FormTagsInputMode,
  type FormTagsInputNormalizer,
  type FormTagsInputPlacement,
  type FormTagsInputSerializer,
  type FormTagsInputSuggestionProvider,
  type FormTagsInputTag,
  type FormTagsInputValidator,
} from '../components/form/FormTagsInput/tags-input.shared';
import type { ReactIconData } from './generated-icon-data';
import { iconCross } from './generated-static-icons';
const controlIcons: Readonly<Record<string, ReactIconData>> = { cross: iconCross };
import { getNativePopoverValue, useNativePopover } from './popover-overlayer.shared';

type RuntimeProps = Record<string, unknown> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const cx = (...values: Array<string | false | null | undefined>): string =>
  values
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

const text = (props: RuntimeProps, name: string, fallback = ''): string => {
  const value = props[name];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

const bool = (props: RuntimeProps, name: string, fallback = false): boolean => {
  const value = props[name];
  return typeof value === 'boolean' ? value : fallback;
};

const call = (props: RuntimeProps, name: string, ...args: unknown[]): void => {
  const handler = props[name];
  if (typeof handler === 'function') (handler as (...values: unknown[]) => void)(...args);
};

const hasContent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== false && value !== '';

function TagsInputIcon({ className, name }: { className: string; name: string }): ReactElement {
  const icon = controlIcons[name] ?? controlIcons.info;
  return (
    <svg
      aria-hidden="true"
      className={cx('peaui-svg-icon', className)}
      dangerouslySetInnerHTML={{ __html: icon?.body ?? '' }}
      focusable="false"
      viewBox={icon?.viewBox ?? '0 0 24 24'}
    />
  );
}

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

export function FormTagsInputRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const generatedId = useId().replaceAll(':', '');
  const id = text(props, 'id', `peaui-form-tags-input-${generatedId}`);
  const name = text(props, 'name');
  const form = text(props, 'form') || undefined;
  const label = (props.labelContent ?? props.label) as ReactNode;
  const hint = props.hintContent as ReactNode;
  const description = (props.descriptionContent ?? props.description) as ReactNode;
  const error = (props.errorContent ?? props.error) as ReactNode;
  const placeholder = text(props, 'placeholder', 'Dodaj tag');
  const ariaLabel = text(props, 'aria-label') || text(props, 'ariaLabel') || name || 'Tagi';
  const layout = text(props, 'layout', 'inline') as FormTagsInputLayout;
  const mode = text(props, 'mode', 'freeform') as FormTagsInputMode;
  const placement = text(props, 'placement', 'auto') as FormTagsInputPlacement;
  const allowCreate = mode === 'freeform' && bool(props, 'allowCreate', true);
  const allowDuplicates = bool(props, 'allowDuplicates');
  const disabled = bool(props, 'disabled');
  const readonly = bool(props, 'readonly');
  const required = bool(props, 'required');
  const loading = bool(props, 'loading');
  const loadingLabel = text(props, 'loadingLabel', 'Ładowanie sugestii');
  const emptyLabel = text(props, 'emptyLabel', 'Brak pasujących sugestii');
  const max = typeof props.max === 'number' ? props.max : undefined;
  const normalizedMax = normalizeTagsInputMax(max);
  const separators = Array.isArray(props.separators)
    ? props.separators.filter((separator): separator is string => typeof separator === 'string')
    : [',', ';', '\n'];
  const suggestions = Array.isArray(props.suggestions)
    ? (props.suggestions as FormTagsInputTag[])
    : [];
  const disabledTags = Array.isArray(props.disabledTags)
    ? (props.disabledTags as Array<string | number>)
    : [];
  const normalizeTag = props.normalizeTag as FormTagsInputNormalizer | undefined;
  const validateTag = props.validateTag as FormTagsInputValidator | undefined;
  const getTagKey = props.getTagKey as FormTagsInputKeyGetter | undefined;
  const serializeTag = props.serializeTag as FormTagsInputSerializer | undefined;
  const suggestionProvider = props.suggestionProvider as
    FormTagsInputSuggestionProvider | undefined;
  const baseTestId = text(props, 'dataTestId') || text(props, 'data-testid') || undefined;
  const isValueControlled = Object.prototype.hasOwnProperty.call(props, 'value');
  const isInputControlled = Object.prototype.hasOwnProperty.call(props, 'inputValue');
  const [internalTags, setInternalTags] = useState<FormTagsInputTag[]>(() =>
    Array.isArray(props.defaultValue) ? (props.defaultValue as FormTagsInputTag[]) : [],
  );
  const [internalInput, setInternalInput] = useState(() => text(props, 'defaultInputValue'));
  let tags = internalTags;
  if (isValueControlled) {
    tags = Array.isArray(props.value) ? (props.value as FormTagsInputTag[]) : [];
  }
  const inputValue = isInputControlled ? text(props, 'inputValue') : internalInput;
  const [focused, setFocused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [selectedTagIndex, setSelectedTagIndex] = useState(-1);
  const [editingTagIndex, setEditingTagIndex] = useState(-1);
  const [internalSuggestions, setInternalSuggestions] = useState<readonly FormTagsInputTag[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [resolvedPlacement, setResolvedPlacement] = useState<'top' | 'bottom'>('bottom');
  const [triggerWidth, setTriggerWidth] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialResetTags = useRef([...internalTags]);
  const initialResetInput = useRef(internalInput);
  useFormReset(inputRef, () => {
    if (!isValueControlled) setInternalTags([...initialResetTags.current]);
    if (!isInputControlled) setInternalInput(initialResetInput.current);
    setSelectedTagIndex(-1);
    setEditingTagIndex(-1);
    setPanelOpen(false);
  });
  const tagButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const requestIdRef = useRef(0);
  const inputFocusFrameRef = useRef<number | null>(null);
  const hasLabel = hasContent(label);
  const hasDescription = hasContent(description);
  const hasError = hasContent(error);
  const effectiveLoading = loading || internalLoading;
  const blocked = disabled || loading;
  const atMax = tags.length >= normalizedMax;
  const hasSuggestionSource =
    Boolean(suggestionProvider) || suggestions.length > 0 || mode === 'suggestions-only';
  const sourceSuggestions = suggestionProvider ? internalSuggestions : suggestions;
  const showPanel = panelOpen && hasSuggestionSource;
  const panelRef = useNativePopover(showPanel);
  const inputId = `${id}-input`;
  const labelId = `label-${inputId}`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const listboxId = `${id}-suggestions`;
  const liveId = `${id}-status`;
  const anchorName = `--anchor-peaui-form-tags-input-${generatedId}`;

  const matchesSelectedTag = useMemo(
    () => createTagsInputMatcher(tags, getTagKey),
    [tags, getTagKey],
  );
  const filteredSuggestions = useMemo(() => {
    const query = inputValue.trim().toLocaleLowerCase();
    return sourceSuggestions.filter((suggestion) => {
      if (!allowDuplicates && matchesSelectedTag(suggestion)) {
        return false;
      }
      return !query || getTagsInputLabel(suggestion).toLocaleLowerCase().includes(query);
    });
  }, [allowDuplicates, inputValue, sourceSuggestions, matchesSelectedTag]);

  const describedIds = new Set(
    text(props, 'aria-describedby')
      .split(/\s+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  if (hasDescription) describedIds.add(descriptionId);
  if (hasError) describedIds.add(errorId);
  const describedBy = describedIds.size ? [...describedIds].join(' ') : undefined;
  const labelledBy = text(props, 'aria-labelledby') || (hasLabel ? labelId : undefined);
  const activeSuggestionId =
    activeSuggestionIndex >= 0 ? `${id}-suggestion-${activeSuggestionIndex}` : undefined;
  const commitOptions: FormTagsInputCommitOptions = {
    allowCreate,
    allowDuplicates,
    getTagKey,
    max,
    normalizeTag,
    suggestions: sourceSuggestions,
    validateTag,
  };

  const updateTags = (nextTags: FormTagsInputTag[]): void => {
    if (!isValueControlled) setInternalTags(nextTags);
    call(props, 'onValueChange', nextTags);
  };

  const updateInput = (nextInput: string): void => {
    if (!isInputControlled) setInternalInput(nextInput);
    call(props, 'onInputValueChange', nextInput);
    setSelectedTagIndex(-1);
  };

  const reportInvalid = (details: readonly FormTagsInputInvalidDetail[], event: Event): void => {
    details.forEach((detail) => call(props, 'onInvalidTag', detail, event));
    if (details[0]) setAnnouncement(details[0].message);
  };

  const closePanel = (): void => {
    setPanelOpen(false);
    setActiveSuggestionIndex(-1);
  };

  const cancelScheduledInputFocus = (): void => {
    if (inputFocusFrameRef.current === null) return;
    cancelAnimationFrame(inputFocusFrameRef.current);
    inputFocusFrameRef.current = null;
  };

  const scheduleInputFocus = (): void => {
    cancelScheduledInputFocus();
    inputFocusFrameRef.current = requestAnimationFrame(() => {
      inputFocusFrameRef.current = null;
      inputRef.current?.focus();
    });
  };

  const syncPlacement = (): void => {
    setTriggerWidth(controlRef.current?.getBoundingClientRect().width ?? triggerWidth);

    if (placement !== 'auto') {
      setResolvedPlacement(placement);
      return;
    }
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const availableBelow = window.innerHeight - rect.bottom;
    setResolvedPlacement(availableBelow < 240 && rect.top > availableBelow ? 'top' : 'bottom');
  };

  const isTagDisabled = (tag: FormTagsInputTag, index: number): boolean =>
    isTagsInputItemDisabled(tag, index, disabledTags, getTagKey);

  const commitInputs = (inputs: readonly string[], event: Event): boolean => {
    if (blocked || readonly || inputs.length === 0) return false;
    if (editingTagIndex >= 0) {
      const previous = tags[editingTagIndex];
      if (previous === undefined || isTagDisabled(previous, editingTagIndex)) return false;
      const remaining = tags.filter((_, index) => index !== editingTagIndex);
      const result = commitTagsInput(inputs.slice(0, 1), remaining, {
        ...commitOptions,
        max: undefined,
      });
      reportInvalid(result.invalid, event);
      const next = result.accepted[0];
      if (next === undefined) return false;
      const nextTags = [...tags];
      nextTags[editingTagIndex] = next;
      updateTags(nextTags);
      call(props, 'onEdit', previous, next, editingTagIndex, event);
      setAnnouncement(
        `Zmieniono tag ${getTagsInputLabel(previous)} na ${getTagsInputLabel(next)}.`,
      );
      setEditingTagIndex(-1);
      updateInput('');
      return true;
    }
    const result = commitTagsInput(inputs, tags, commitOptions);
    reportInvalid(result.invalid, event);
    if (result.maxReached && Number.isFinite(normalizedMax)) {
      call(props, 'onMaxReached', normalizedMax, event);
    }
    if (result.accepted.length === 0) return false;
    const startIndex = tags.length;
    updateTags(tags.concat(result.accepted));
    result.accepted.forEach((tag, offset) => call(props, 'onAdd', tag, startIndex + offset, event));
    updateInput('');
    setAnnouncement(
      result.accepted.length === 1
        ? `Dodano tag ${getTagsInputLabel(result.accepted[0] as FormTagsInputTag)}.`
        : `Dodano ${result.accepted.length} tagi.`,
    );
    return true;
  };

  const commitSuggestion = (index: number, event: Event): void => {
    const suggestion = filteredSuggestions[index];
    if (suggestion === undefined || isTagsInputItemDisabled(suggestion, index, [], getTagKey))
      return;
    const labelValue = getTagsInputLabel(suggestion);
    const existingTags =
      editingTagIndex >= 0 ? tags.filter((_, tagIndex) => tagIndex !== editingTagIndex) : tags;
    const result = commitTagsInput([labelValue], existingTags, {
      ...commitOptions,
      max: editingTagIndex >= 0 ? undefined : max,
      normalizeTag: () => suggestion,
    });
    reportInvalid(result.invalid, event);
    const accepted = result.accepted[0];
    if (accepted === undefined) return;
    if (editingTagIndex >= 0) {
      const previous = tags[editingTagIndex];
      if (previous === undefined) return;
      const nextTags = [...tags];
      nextTags[editingTagIndex] = accepted;
      updateTags(nextTags);
      call(props, 'onEdit', previous, accepted, editingTagIndex, event);
      setAnnouncement(`Zmieniono tag ${getTagsInputLabel(previous)} na ${labelValue}.`);
      setEditingTagIndex(-1);
    } else {
      const nextIndex = tags.length;
      updateTags(tags.concat(accepted));
      call(props, 'onAdd', accepted, nextIndex, event);
      setAnnouncement(`Dodano tag ${labelValue}.`);
    }
    updateInput('');
    closePanel();
  };

  const removeTag = (index: number, event: Event, focusAfter = true): void => {
    const tag = tags[index];
    if (tag === undefined || blocked || readonly || isTagDisabled(tag, index)) return;
    updateTags(tags.filter((_, tagIndex) => tagIndex !== index));
    setEditingTagIndex(-1);
    setSelectedTagIndex(-1);
    call(props, 'onRemove', tag, index, event);
    setAnnouncement(`Usunięto tag ${getTagsInputLabel(tag)}.`);
    if (focusAfter) scheduleInputFocus();
  };

  const beginEdit = (index: number): void => {
    const tag = tags[index];
    if (tag === undefined || blocked || readonly || isTagDisabled(tag, index)) return;
    setEditingTagIndex(index);
    setSelectedTagIndex(index);
    updateInput(getTagsInputLabel(tag));
    setPanelOpen(hasSuggestionSource);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const cancelEdit = (): void => {
    const previousIndex = editingTagIndex;
    setEditingTagIndex(-1);
    updateInput('');
    closePanel();
    if (previousIndex >= 0)
      requestAnimationFrame(() => tagButtonRefs.current[previousIndex]?.focus());
  };

  const focusTag = (index: number): void => {
    cancelScheduledInputFocus();
    const safeIndex = Math.min(tags.length - 1, Math.max(0, index));
    setSelectedTagIndex(safeIndex);
    tagButtonRefs.current[safeIndex]?.focus();
  };

  const handleTagKeyDown = (index: number, event: ReactKeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = event.key === 'ArrowLeft' ? index - 1 : index + 1;
      if (nextIndex >= tags.length) {
        setSelectedTagIndex(-1);
        inputRef.current?.focus();
      } else focusTag(nextIndex);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusTag(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }
    if (event.key === 'Enter' || event.key === 'F2') {
      event.preventDefault();
      beginEdit(index);
      return;
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      const nextFocusIndex = Math.min(index, tags.length - 2);
      removeTag(index, event.nativeEvent, false);
      requestAnimationFrame(() => {
        if (nextFocusIndex >= 0) focusTag(nextFocusIndex);
        else inputRef.current?.focus();
      });
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setSelectedTagIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.nativeEvent.isComposing || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!hasSuggestionSource) return;
      event.preventDefault();
      setPanelOpen(true);
      if (filteredSuggestions.length === 0) return;
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      let start = activeSuggestionIndex;
      if (activeSuggestionIndex < 0) start = direction === 1 ? -1 : 0;
      setActiveSuggestionIndex(
        (start + direction + filteredSuggestions.length) % filteredSuggestions.length,
      );
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (showPanel && activeSuggestionIndex >= 0) {
        commitSuggestion(activeSuggestionIndex, event.nativeEvent);
      } else if (inputValue.trim() && commitInputs([inputValue], event.nativeEvent)) closePanel();
      return;
    }
    if (event.key === 'Escape') {
      if (editingTagIndex >= 0) cancelEdit();
      else closePanel();
      return;
    }
    if (event.key === 'Backspace' && !inputValue) {
      event.preventDefault();
      const lastIndex = tags.length - 1;
      if (selectedTagIndex === lastIndex && lastIndex >= 0) removeTag(lastIndex, event.nativeEvent);
      else {
        setSelectedTagIndex(lastIndex);
        if (lastIndex >= 0)
          setAnnouncement(`Wybrano tag ${getTagsInputLabel(tags[lastIndex] as FormTagsInputTag)}.`);
      }
      return;
    }
    if (event.key === 'ArrowLeft' && !inputValue && tags.length > 0) {
      event.preventDefault();
      focusTag(tags.length - 1);
      return;
    }
    if (separators.includes(event.key) && inputValue.trim()) {
      event.preventDefault();
      commitInputs([inputValue], event.nativeEvent);
    }
  };

  const handlePaste = (event: ReactClipboardEvent<HTMLInputElement>): void => {
    if (blocked || readonly) return;
    const parts = parseTagsInput(event.clipboardData.getData('text'), separators);
    if (parts.length <= 1 && editingTagIndex < 0) return;
    event.preventDefault();
    commitInputs(parts, event.nativeEvent);
  };

  const handleFocusOut = (event: ReactFocusEvent<HTMLDivElement>): void => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))
      return;
    setFocused(false);
    closePanel();
    call(props, 'onBlur', event);
  };

  const onSearch = props.onSearch as ((query: string, requestId: number) => void) | undefined;
  const onInvalidTag = props.onInvalidTag as
    ((detail: FormTagsInputInvalidDetail, event: Event) => void) | undefined;

  useEffect(() => {
    tagButtonRefs.current.length = tags.length;
    if (selectedTagIndex >= tags.length) setSelectedTagIndex(-1);
    if (editingTagIndex >= tags.length) setEditingTagIndex(-1);
  }, [editingTagIndex, selectedTagIndex, tags.length]);

  useEffect(
    () => () => {
      if (inputFocusFrameRef.current !== null) {
        cancelAnimationFrame(inputFocusFrameRef.current);
        inputFocusFrameRef.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    if (!suggestionProvider || !focused) return;
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    setInternalLoading(true);
    onSearch?.(inputValue, requestId);
    void suggestionProvider(inputValue, controller.signal)
      .then((result) => {
        if (requestId === requestIdRef.current && !controller.signal.aborted) {
          setInternalSuggestions(Array.isArray(result) ? result : []);
          setActiveSuggestionIndex(-1);
        }
      })
      .catch((providerError: unknown) => {
        if (controller.signal.aborted) return;
        const detail: FormTagsInputInvalidDetail = {
          index: -1,
          input: inputValue,
          message:
            providerError instanceof Error
              ? providerError.message
              : 'Nie udało się pobrać sugestii.',
          reason: 'invalid',
        };
        onInvalidTag?.(detail, new Event('suggestion-error'));
        setAnnouncement(detail.message);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setInternalLoading(false);
      });
    return () => controller.abort();
  }, [focused, inputValue, onInvalidTag, onSearch, suggestionProvider]);

  const renderTag = props.renderTag;
  const renderTagContent = props.renderTagContent;
  const renderSuggestion = props.renderSuggestion;
  const emptySuggestionsContent = props.emptySuggestionsContent as ReactNode;
  const loadingContent = props.loadingContent as ReactNode;

  return (
    <div
      className={cx(
        'peaui-form-tags-input',
        `peaui-form-tags-input--${layout}`,
        `peaui-form-tags-input--placement-${resolvedPlacement}`,
        showPanel && 'peaui-form-tags-input--open',
        focused && 'peaui-form-tags-input--focused',
        disabled && 'peaui-form-tags-input--disabled',
        readonly && 'peaui-form-tags-input--readonly',
        loading && 'peaui-form-tags-input--loading',
        internalLoading && 'peaui-form-tags-input--searching',
        hasError && 'peaui-form-tags-input--invalid',
        atMax && 'peaui-form-tags-input--max',
        props.className,
      )}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
      data-loading={effectiveLoading || undefined}
      data-max-reached={atMax || undefined}
      data-readonly={readonly || undefined}
      data-testid={baseTestId}
      onBlur={handleFocusOut}
      ref={rootRef}
      style={
        {
          ...props.style,
          '--unique-anchor': anchorName,
          '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
        } as CSSProperties
      }
    >
      {hasLabel ? (
        <label
          className="peaui-form-label peaui-form-tags-input__label"
          htmlFor={inputId}
          id={labelId}
        >
          <span className="peaui-form-label__content">
            <span
              className={cx(
                'peaui-form-label__text',
                readonly && 'peaui-form-label__text--readonly',
              )}
            >
              {typeof props.renderLabel === 'function'
                ? (props.renderLabel as (state: { count: number }) => ReactNode)({
                    count: tags.length,
                  })
                : label}
            </span>
          </span>
          {hasContent(hint) || typeof props.renderHint === 'function' ? (
            <>
              <span className="peaui-info-tooltip" tabIndex={0}>
                <TagsInputIcon className="peaui-form-label__hint-icon" name="info" />
              </span>
              <span
                className="peaui-info-tooltip__content peaui-info-tooltip__content--placement-right"
                role="tooltip"
              >
                <span className="peaui-info-tooltip__description">
                  {typeof props.renderHint === 'function'
                    ? (props.renderHint as (state: { count: number; max?: number }) => ReactNode)({
                        count: tags.length,
                        max,
                      })
                    : hint}
                </span>
              </span>
            </>
          ) : null}
        </label>
      ) : null}

      <div
        className={cx(
          'peaui-popover-overlayer',
          'peaui-popover-overlayer--match-trigger-width',
          'peaui-form-tags-input__overlayer',
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events -- Clicking the wrapper only focuses the native input, which is reachable with Tab. */}
        <div
          aria-busy={effectiveLoading || undefined}
          aria-disabled={disabled || undefined}
          className="peaui-form-tags-input__control"
          data-testid={baseTestId ? `${baseTestId}-control` : undefined}
          onClick={() => inputRef.current?.focus()}
          ref={controlRef}
        >
          {props.prefixContent as ReactNode}
          {tags.length ? (
            <ul aria-label={`${ariaLabel}: wybrane tagi`} className="peaui-form-tags-input__tags">
              {tags.map((tag, index) => {
                const tagDisabled = isTagDisabled(tag, index);
                const state = {
                  disabled: tagDisabled,
                  editing: editingTagIndex === index,
                  index,
                  selected: selectedTagIndex === index,
                  tag,
                };
                let tagContent: ReactNode = (
                  <span className="peaui-form-tags-input__tag-label" title={getTagsInputLabel(tag)}>
                    {getTagsInputLabel(tag)}
                  </span>
                );
                if (typeof renderTagContent === 'function') {
                  tagContent = (
                    renderTagContent as (state: {
                      tag: FormTagsInputTag;
                      index: number;
                    }) => ReactNode
                  )({ tag, index });
                }
                if (typeof renderTag === 'function') {
                  tagContent = (
                    renderTag as (state: {
                      tag: FormTagsInputTag;
                      index: number;
                      selected: boolean;
                      editing: boolean;
                      disabled: boolean;
                    }) => ReactNode
                  )(state);
                }
                return (
                  <li
                    className={cx(
                      'peaui-form-tags-input__tag',
                      state.selected && 'peaui-form-tags-input__tag--selected',
                      state.editing && 'peaui-form-tags-input__tag--editing',
                      tagDisabled && 'peaui-form-tags-input__tag--disabled',
                    )}
                    key={getTagsInputKey(tag, index, getTagKey)}
                  >
                    <button
                      aria-disabled={tagDisabled || undefined}
                      aria-label={
                        tagDisabled
                          ? `Tag ${getTagsInputLabel(tag)} (niedostępny)`
                          : `Edytuj tag ${getTagsInputLabel(tag)}`
                      }
                      className="peaui-form-tags-input__tag-main"
                      disabled={blocked || readonly}
                      onClick={(event) => {
                        event.stopPropagation();
                        beginEdit(index);
                      }}
                      onKeyDown={(event) => handleTagKeyDown(index, event)}
                      ref={(element) => {
                        tagButtonRefs.current[index] = element;
                      }}
                      tabIndex={-1}
                      type="button"
                    >
                      {tagContent}
                    </button>
                    {!readonly && !tagDisabled ? (
                      <button
                        aria-label={`Usuń tag ${getTagsInputLabel(tag)}`}
                        className="peaui-form-tags-input__remove"
                        disabled={blocked}
                        onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                          event.stopPropagation();
                          removeTag(index, event.nativeEvent);
                        }}
                        type="button"
                      >
                        <TagsInputIcon
                          className="peaui-form-tags-input__remove-icon"
                          name="cross"
                        />
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
          <input
            aria-activedescendant={activeSuggestionId}
            aria-autocomplete={hasSuggestionSource ? 'list' : 'none'}
            aria-controls={hasSuggestionSource ? listboxId : undefined}
            aria-describedby={describedBy}
            aria-expanded={showPanel}
            aria-haspopup="listbox"
            aria-invalid={hasError || undefined}
            aria-label={labelledBy ? undefined : ariaLabel}
            aria-labelledby={labelledBy}
            aria-readonly={readonly || undefined}
            aria-required={required || undefined}
            autoCapitalize="none"
            autoComplete="off"
            className="peaui-form-tags-input__input"
            data-testid={baseTestId ? `${baseTestId}-input` : undefined}
            disabled={blocked}
            id={inputId}
            onChange={(event) => {
              updateInput(event.currentTarget.value);
              setActiveSuggestionIndex(-1);
              setPanelOpen(hasSuggestionSource);
              syncPlacement();
            }}
            onFocus={() => {
              setFocused(true);
              setPanelOpen(hasSuggestionSource);
              syncPlacement();
            }}
            onKeyDown={handleInputKeyDown}
            onPaste={handlePaste}
            placeholder={atMax && editingTagIndex < 0 ? '' : placeholder}
            readOnly={readonly || (atMax && editingTagIndex < 0)}
            ref={(element) => {
              inputRef.current = element;
              assignRef(forwardedRef, element);
            }}
            form={text(props, 'form') || undefined}
            required={required && tags.length === 0}
            role="combobox"
            spellCheck={false}
            type="text"
            value={inputValue}
          />
          {props.suffixContent as ReactNode}
          {effectiveLoading ? (
            <span aria-hidden="true" className="peaui-form-tags-input__spinner" />
          ) : null}
        </div>
      </div>

      <div
        className={cx(
          'peaui-popover-overlayer__content',
          `peaui-popover-overlayer__content--placement-${resolvedPlacement}`,
          'peaui-popover-overlayer__content--match-trigger-width',
          'peaui-form-tags-input__popover-content',
        )}
        hidden={!showPanel}
        popover={getNativePopoverValue()}
        ref={panelRef}
        style={
          {
            '--unique-anchor': anchorName,
            '--peaui-popover-overlayer-trigger-width': `${triggerWidth}px`,
          } as CSSProperties
        }
        onToggle={(event) => {
          if (event.nativeEvent.newState === 'closed' && panelOpen) closePanel();
        }}
      >
        <div className="peaui-form-tags-input__panel">
          {effectiveLoading ? (
            <div
              aria-busy="true"
              aria-label={`${ariaLabel}: sugestie`}
              className="peaui-form-tags-input__panel-state"
              id={listboxId}
              role="listbox"
            >
              {loadingContent ?? loadingLabel}
            </div>
          ) : null}
          {!effectiveLoading && filteredSuggestions.length > 0 ? (
            <ul
              aria-label={`${ariaLabel}: sugestie`}
              className="peaui-form-tags-input__listbox"
              id={listboxId}
              role="listbox"
            >
              {filteredSuggestions.map((suggestion, index) => {
                const suggestionDisabled = isTagsInputItemDisabled(
                  suggestion,
                  index,
                  [],
                  getTagKey,
                );
                const active = activeSuggestionIndex === index;
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- The combobox input owns focus and keyboard selection with aria-activedescendant.
                  <li
                    aria-disabled={suggestionDisabled || undefined}
                    aria-selected={active}
                    className={cx(
                      'peaui-form-tags-input__option',
                      active && 'peaui-form-tags-input__option--active',
                      suggestionDisabled && 'peaui-form-tags-input__option--disabled',
                    )}
                    id={`${id}-suggestion-${index}`}
                    key={getTagsInputKey(suggestion, index, getTagKey)}
                    onClick={(event) => commitSuggestion(index, event.nativeEvent)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                    role="option"
                  >
                    {typeof renderSuggestion === 'function'
                      ? (
                          renderSuggestion as (state: {
                            suggestion: FormTagsInputTag;
                            index: number;
                            active: boolean;
                          }) => ReactNode
                        )({ suggestion, index, active })
                      : getTagsInputLabel(suggestion)}
                  </li>
                );
              })}
            </ul>
          ) : null}
          {!effectiveLoading && filteredSuggestions.length === 0 ? (
            <div
              aria-label={`${ariaLabel}: sugestie`}
              className="peaui-form-tags-input__panel-state"
              id={listboxId}
              role="listbox"
            >
              {typeof props.renderEmptySuggestions === 'function'
                ? (props.renderEmptySuggestions as (state: { query: string }) => ReactNode)({
                    query: inputValue,
                  })
                : (emptySuggestionsContent ?? emptyLabel)}
            </div>
          ) : null}
        </div>
      </div>

      {name
        ? tags.map((tag, index) => (
            <input
              disabled={disabled}
              form={form}
              key={`form-${getTagsInputKey(tag, index, getTagKey)}`}
              name={name}
              type="hidden"
              value={serializeTagsInputTag(tag, index, serializeTag)}
            />
          ))
        : null}
      {hasDescription ? (
        <p className="peaui-form-tags-input__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {hasError ? (
        <p className="peaui-form-tags-input__error" id={errorId}>
          {error}
        </p>
      ) : null}
      <span aria-live="polite" className="peaui-form-tags-input__live" id={liveId} role="status">
        {effectiveLoading ? loadingLabel : announcement}
      </span>
    </div>
  );
}
