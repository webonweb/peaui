/** @jsxImportSource react */
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import KeyboardKey from '@/components/data-display/KeyboardKey';
import VirtualList from '@/components/data-display/VirtualList';
import EmptyState from '@/components/feedback/EmptyState';
import SpinnerLoader from '@/components/feedback/SpinnerLoader';
import ModalDialog from '@/components/overlayer/ModalDialog';

import {
  flattenCommandPaletteSections,
  getNextCommandPaletteActiveId,
  isCommandPaletteEditableTarget,
  matchesCommandPaletteShortcut,
  resolveCommandPaletteSections,
  type CommandPaletteCommand,
  type CommandPaletteExecutionErrorDetail,
  type CommandPaletteExecutionSuccessDetail,
  type CommandPaletteFilter,
  type CommandPaletteGroup,
  type CommandPaletteLevelChangeDetail,
  type CommandPaletteMode,
  type CommandPaletteResolvedCommand,
  type CommandPaletteSection,
  type CommandPaletteShortcut,
  type CommandPaletteTriggerState,
} from './command-palette.shared';

export type CommandPaletteHandle = {
  closePalette: () => void;
  focusSearch: () => void;
  openPalette: () => void;
};

export type CommandPaletteProps = {
  commands?: readonly CommandPaletteCommand[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (value: string) => void;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (value: string | null) => void;
  recentIds?: readonly string[];
  shortcut?: CommandPaletteShortcut;
  registerShortcut?: boolean;
  filter?: CommandPaletteFilter;
  groups?: readonly CommandPaletteGroup[];
  loading?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  closeOnExecute?: boolean;
  dataTestId?: string;
  mode?: CommandPaletteMode;
  virtual?: boolean;
  virtualThreshold?: number;
  virtualHeight?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  renderTrigger?: (state: CommandPaletteTriggerState) => ReactNode;
  header?: ReactNode;
  renderCommand?: (state: {
    active: boolean;
    command: CommandPaletteCommand;
    executing: boolean;
    query: string;
  }) => ReactNode;
  renderGroup?: (section: CommandPaletteSection) => ReactNode;
  empty?: ReactNode;
  loadingContent?: ReactNode;
  renderError?: (error: string) => ReactNode;
  footer?: ReactNode;
  renderBreadcrumb?: (path: readonly CommandPaletteCommand[], goBack: () => void) => ReactNode;
  onSelect?: (command: CommandPaletteCommand) => void;
  onExecute?: (command: CommandPaletteCommand) => void;
  onExecutionSuccess?: (detail: CommandPaletteExecutionSuccessDetail) => void;
  onExecutionError?: (detail: CommandPaletteExecutionErrorDetail) => void;
  onLevelChange?: (detail: CommandPaletteLevelChangeDetail) => void;
  className?: string;
  style?: CSSProperties;
};

export type {
  CommandPaletteCommand,
  CommandPaletteExecutionContext,
  CommandPaletteExecutionErrorDetail,
  CommandPaletteExecutionSuccessDetail,
  CommandPaletteFilter,
  CommandPaletteGroup,
  CommandPaletteLevelChangeDetail,
  CommandPaletteMode,
  CommandPaletteResolvedCommand,
  CommandPaletteSection,
  CommandPaletteShortcut,
  CommandPaletteTriggerState,
} from './command-palette.shared';

function useControlledState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const resolved = value === undefined ? internal : value;
  const setValue = useCallback(
    (next: T) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [onChange, value],
  );
  return [resolved, setValue];
}

const CommandPalette = forwardRef<CommandPaletteHandle, CommandPaletteProps>(
  function CommandPalette(
    {
      commands = [],
      open,
      defaultOpen = false,
      onOpenChange,
      query,
      defaultQuery = '',
      onQueryChange,
      activeId,
      defaultActiveId = null,
      onActiveIdChange,
      recentIds = [],
      shortcut = ['Mod', 'K'],
      registerShortcut = true,
      filter,
      groups = [],
      loading = false,
      placeholder = 'Type a command',
      ariaLabel = 'Command palette',
      closeOnExecute = true,
      dataTestId,
      mode = 'modal',
      virtual = false,
      virtualThreshold = 200,
      virtualHeight = 384,
      emptyTitle = 'No commands found',
      emptyDescription = 'Try another phrase.',
      renderTrigger,
      header,
      renderCommand,
      renderGroup,
      empty,
      loadingContent,
      renderError,
      footer,
      renderBreadcrumb,
      onSelect,
      onExecute,
      onExecutionSuccess,
      onExecutionError,
      onLevelChange,
      className,
      style,
    },
    forwardedRef,
  ): ReactElement {
    const [isOpen, setOpen] = useControlledState(open, defaultOpen, onOpenChange);
    const [searchQuery, setQuery] = useControlledState(query, defaultQuery, onQueryChange);
    const [currentActiveId, setActiveId] = useControlledState(
      activeId,
      defaultActiveId,
      onActiveIdChange,
    );
    const [path, setPath] = useState<CommandPaletteCommand[]>([]);
    const [executingId, setExecutingId] = useState<string | null>(null);
    const [executionError, setExecutionError] = useState('');
    const executionVersion = useRef(0);
    const previousFocus = useRef<HTMLElement | null>(null);
    const input = useRef<HTMLInputElement | null>(null);
    const root = useRef<HTMLDivElement | null>(null);
    const generatedId = useId().replaceAll(':', '');
    const listId = `peaui-command-palette-${generatedId}-list`;
    const currentCommands = useMemo(
      () => (path.length > 0 ? (path.at(-1)?.children ?? []) : commands),
      [commands, path],
    );
    const sections = useMemo(
      () =>
        resolveCommandPaletteSections({
          commands: currentCommands,
          filter,
          groups,
          query: searchQuery,
          recentIds: path.length ? [] : recentIds,
        }),
      [currentCommands, filter, groups, path.length, recentIds, searchQuery],
    );
    const results = useMemo(() => flattenCommandPaletteSections(sections), [sections]);
    const useVirtualList = virtual || results.length >= virtualThreshold;

    const optionId = (id: string): string =>
      `${listId}-option-${id.replace(/[^a-zA-Z0-9_-]/gu, '-')}`;
    const closePalette = (): void => setOpen(false);
    const openPalette = (): void => setOpen(true);
    const toggle = (): void => setOpen(!isOpen);
    const focusSearch = (): void => input.current?.focus();

    useImperativeHandle(forwardedRef, () => ({ closePalette, focusSearch, openPalette }));

    const emitLevelChange = (nextPath: CommandPaletteCommand[]): void => {
      const nextCommands = nextPath.length > 0 ? (nextPath.at(-1)?.children ?? []) : commands;
      onLevelChange?.({ commands: nextCommands, path: nextPath });
    };

    const enterLevel = (command: CommandPaletteCommand): void => {
      if (!command.children?.length) return;
      const nextPath = [...path, command];
      setPath(nextPath);
      setQuery('');
      setActiveId(null);
      emitLevelChange(nextPath);
    };

    const leaveLevel = (): void => {
      if (!path.length) return;
      const nextPath = path.slice(0, -1);
      setPath(nextPath);
      setQuery('');
      setActiveId(null);
      emitLevelChange(nextPath);
    };

    const executeCommand = async (command: CommandPaletteCommand): Promise<void> => {
      if (command.disabled === true || executingId !== null) return;
      onSelect?.(command);
      if ((command.children?.length ?? 0) > 0) {
        enterLevel(command);
        return;
      }

      const version = ++executionVersion.current;
      setExecutingId(command.id);
      setExecutionError('');
      onExecute?.(command);
      try {
        const result = await command.execute?.({ command, path, query: searchQuery });
        if (version !== executionVersion.current) return;
        onExecutionSuccess?.({ command, result });
        if (closeOnExecute === true) closePalette();
      } catch (error) {
        if (version !== executionVersion.current) return;
        setExecutionError(error instanceof Error ? error.message : 'Command failed');
        onExecutionError?.({ command, error });
      } finally {
        if (version === executionVersion.current) setExecutingId(null);
      }
    };

    const moveActive = (direction: 1 | -1 | 'first' | 'last'): void => {
      setActiveId(getNextCommandPaletteActiveId(results, currentActiveId, direction));
    };

    const handleKeyDown = (event: ReactKeyboardEvent): void => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveActive(event.key === 'ArrowDown' ? 1 : -1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        moveActive(event.key === 'Home' ? 'first' : 'last');
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const active = results.find(({ command }) => command.id === currentActiveId)?.command;
        if (active) void executeCommand(active);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        if (path.length > 0) leaveLevel();
        else closePalette();
      } else if (event.key === 'Backspace' && searchQuery.length === 0 && path.length > 0) {
        event.preventDefault();
        leaveLevel();
      }
    };

    useEffect(() => {
      if (
        !results.some(({ command }) => command.id === currentActiveId && command.disabled !== true)
      ) {
        setActiveId(getNextCommandPaletteActiveId(results, null, 'first'));
      }
    }, [currentActiveId, results, setActiveId]);

    useEffect(() => {
      if (isOpen) {
        previousFocus.current = document.activeElement as HTMLElement;
        requestAnimationFrame(focusSearch);
      } else {
        setPath([]);
        setExecutionError('');
        previousFocus.current?.focus();
        previousFocus.current = null;
      }
    }, [isOpen]);

    useEffect(() => {
      const listener = (event: KeyboardEvent): void => {
        if (
          !registerShortcut ||
          isCommandPaletteEditableTarget(event.target) ||
          !matchesCommandPaletteShortcut(event, shortcut)
        ) {
          return;
        }
        event.preventDefault();
        setOpen(!isOpen);
      };
      document.addEventListener('keydown', listener);
      return () => document.removeEventListener('keydown', listener);
    }, [isOpen, registerShortcut, setOpen, shortcut]);

    useEffect(
      () => () => {
        executionVersion.current += 1;
      },
      [],
    );

    const commandContent = (result: CommandPaletteResolvedCommand, active: boolean): ReactNode =>
      renderCommand?.({
        active,
        command: result.command,
        executing: executingId === result.command.id,
        query: searchQuery,
      }) ?? (
        <>
          <span className="peaui-command-palette__command-copy">
            <strong>{result.command.label}</strong>
            {result.command.description ? <small>{result.command.description}</small> : null}
          </span>
          {result.command.shortcut !== undefined ? (
            <KeyboardKey keys={result.command.shortcut} muted size="xs" />
          ) : null}
          {(result.command.children?.length ?? 0) > 0 ? (
            <span aria-hidden="true">&#8594;</span>
          ) : null}
          {executingId === result.command.id ? (
            <span className="peaui-command-palette__executing">Running</span>
          ) : null}
        </>
      );

    const commandRow = (
      result: CommandPaletteResolvedCommand,
      active: boolean,
      nestedInVirtualOption = false,
    ): ReactElement => {
      const ariaDisabled = nestedInVirtualOption
        ? undefined
        : result.command.disabled === true || undefined;

      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- The search input owns keyboard activation of this active descendant.
        <div
          id={optionId(result.command.id)}
          key={result.command.id}
          aria-disabled={ariaDisabled}
          aria-selected={nestedInVirtualOption ? undefined : active}
          className={[
            'peaui-command-palette__command',
            active && 'peaui-command-palette__command--active',
            result.command.disabled === true && 'peaui-command-palette__command--disabled',
          ]
            .filter(Boolean)
            .join(' ')}
          role={nestedInVirtualOption ? undefined : 'option'}
          onClick={() => void executeCommand(result.command)}
          onMouseDown={(event) => event.preventDefault()}
          onMouseMove={() => setActiveId(result.command.id)}
        >
          {commandContent(result, active)}
        </div>
      );
    };

    const panel = (
      <div
        ref={root}
        className={['peaui-command-palette__panel', className].filter(Boolean).join(' ')}
        style={style}
        data-testid={dataTestId}
        onKeyDown={handleKeyDown}
      >
        {path.length ? (
          <div className="peaui-command-palette__breadcrumb">
            {renderBreadcrumb?.(path, leaveLevel) ?? (
              <button type="button" className="peaui-command-palette__back" onClick={leaveLevel}>
                <span aria-hidden="true">&#8592;</span> {path.map(({ label }) => label).join(' / ')}
              </button>
            )}
          </div>
        ) : null}
        <div className="peaui-command-palette__search">
          <span aria-hidden="true" className="peaui-command-palette__search-icon">
            &#8981;
          </span>
          <input
            ref={input}
            type="search"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            role="combobox"
            aria-activedescendant={currentActiveId ? optionId(currentActiveId) : undefined}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded="true"
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            className="peaui-command-palette__input"
            data-testid={dataTestId ? `${dataTestId}-search-element` : undefined}
            placeholder={placeholder}
            value={searchQuery}
            onChange={(event) => {
              setExecutionError('');
              setQuery(event.currentTarget.value);
            }}
          />
        </div>
        <p
          className="peaui-command-palette__status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {loading ? 'Loading commands' : executionError || `${results.length} results`}
        </p>
        {renderPaletteResults()}
        {footer !== undefined && footer !== null ? (
          <footer className="peaui-command-palette__footer">{footer}</footer>
        ) : null}
      </div>
    );

    function renderPaletteResults(): ReactNode {
      if (loading) {
        return (
          <div className="peaui-command-palette__state">
            {loadingContent ?? (
              <SpinnerLoader dataTestId={dataTestId ? `${dataTestId}-loading` : undefined} />
            )}
          </div>
        );
      }

      if (executionError.length > 0) {
        return (
          <div className="peaui-command-palette__state" role="alert">
            {renderError?.(executionError) ?? executionError}
          </div>
        );
      }

      if (results.length === 0) {
        return (
          <div className="peaui-command-palette__state">
            {empty ?? (
              <EmptyState
                dataTestId={dataTestId ? `${dataTestId}-empty` : undefined}
                description={emptyDescription}
                title={emptyTitle}
              />
            )}
          </div>
        );
      }

      if (useVirtualList) {
        return (
          <div id={listId}>
            <VirtualList
              activeIndex={results.findIndex(({ command }) => command.id === currentActiveId)}
              ariaLabel={ariaLabel}
              dataTestId={dataTestId ? `${dataTestId}-virtual-list` : undefined}
              height={virtualHeight}
              itemKey={(_item, index) => results[index]?.command.id ?? index}
              itemLabel={(_item, index) => results[index]?.command.label ?? ''}
              items={results}
              itemSize={64}
              semanticRole="listbox"
              onActiveIndexChange={(index) =>
                setActiveId(index === null ? null : (results[index]?.command.id ?? null))
              }
              renderItem={({ index, active }) => {
                const result = results[index];
                return result ? commandRow(result, active, true) : null;
              }}
            />
          </div>
        );
      }

      return (
        <div id={listId} className="peaui-command-palette__list" role="listbox">
          {sections.map((section) => {
            const sectionId = `${listId}-group-${section.id.replace(/[^a-zA-Z0-9_-]/gu, '-')}`;
            return (
              <section
                key={section.id}
                className="peaui-command-palette__group"
                role="group"
                aria-labelledby={sectionId}
              >
                <div id={sectionId} className="peaui-command-palette__group-label">
                  {renderGroup?.(section) ?? section.label}
                </div>
                {section.commands.map((result) =>
                  commandRow(result, currentActiveId === result.command.id),
                )}
              </section>
            );
          })}
        </div>
      );
    }

    const triggerState: CommandPaletteTriggerState = {
      close: closePalette,
      open: isOpen,
      openPalette,
      toggle,
    };

    let paletteContent: ReactNode = null;
    if (mode === 'modal') {
      paletteContent = (
        <ModalDialog
          ariaLabel={ariaLabel}
          dataTestId={dataTestId ? `${dataTestId}-dialog` : undefined}
          header={header ?? ariaLabel}
          open={isOpen}
          onOpenChange={setOpen}
        >
          {isOpen ? panel : null}
        </ModalDialog>
      );
    } else if (isOpen) {
      paletteContent = (
        <section
          className="peaui-command-palette peaui-command-palette--embedded"
          role="dialog"
          aria-label={ariaLabel}
        >
          <header className="peaui-command-palette__embedded-header">{header ?? ariaLabel}</header>
          {panel}
        </section>
      );
    }

    return (
      <>
        {renderTrigger?.(triggerState)}
        {paletteContent}
      </>
    );
  },
);

CommandPalette.displayName = 'CommandPalette';

export default CommandPalette;
