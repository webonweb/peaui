import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { format, resolveConfig } from 'prettier';

const generatedFiles = new Map();
function writeGeneratedFile(file, source) {
  generatedFiles.set(file, source);
}

const libraryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsRoot = path.join(libraryRoot, 'src/components');
const reactRoot = path.join(libraryRoot, 'src/react');
const docsApiFile = path.resolve(libraryRoot, '../docs/src/generated/component-api.ts');

function readComponentApi() {
  const source = fs.readFileSync(docsApiFile, 'utf8');
  const sourceFile = ts.createSourceFile(
    docsApiFile,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === 'generatedComponentApi' &&
        declaration.initializer
      ) {
        const value = readLiteral(declaration.initializer);
        if (Array.isArray(value)) return value;
      }
    }
  }

  throw new Error('Nie udało się odczytać wygenerowanego API komponentów Vue.');
}

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function readLiteral(expression) {
  const current = unwrapExpression(expression);
  if (ts.isArrayLiteralExpression(current)) {
    return current.elements.map((element) => readLiteral(element));
  }
  if (ts.isObjectLiteralExpression(current)) {
    return Object.fromEntries(
      current.properties.map((property) => {
        if (!ts.isPropertyAssignment(property)) {
          throw new Error('Nieobsługiwana właściwość w wygenerowanym API Vue.');
        }
        const name = property.name;
        if (!ts.isIdentifier(name) && !ts.isStringLiteral(name) && !ts.isNumericLiteral(name)) {
          throw new Error('Nieobsługiwana nazwa właściwości w wygenerowanym API Vue.');
        }
        return [name.text, readLiteral(property.initializer)];
      }),
    );
  }
  if (ts.isStringLiteral(current) || ts.isNoSubstitutionTemplateLiteral(current)) {
    return current.text;
  }
  if (ts.isNumericLiteral(current)) return Number(current.text);
  if (current.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (current.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (current.kind === ts.SyntaxKind.NullKeyword) return null;
  if (
    ts.isPrefixUnaryExpression(current) &&
    current.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(current.operand)
  ) {
    return -Number(current.operand.text);
  }
  throw new Error('Nieobsługiwana wartość w wygenerowanym API Vue.');
}

function toPublicName(sourceName) {
  return sourceName;
}

function toCamelCase(value) {
  return value.replace(/[-:]([a-z])/g, (_, character) => character.toUpperCase());
}

function toPascalCase(value) {
  const camel = toCamelCase(value.replace(/^on:/, ''));
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function getCallbackName(eventName) {
  if (eventName === 'update:open') return 'onOpenChange';
  if (eventName === 'on:dblclick') return 'onRowDoubleClick';
  if (eventName === 'keydown') return 'onKeyDown';
  if (eventName === 'pointerdown') return 'onPointerDown';
  return `on${toPascalCase(eventName)}`;
}

function normalizeType(type, propertyName = '', componentName = '') {
  if (componentName === 'FormFileUpload' && propertyName === 'valueMode')
    return 'FileUploadValueMode';
  if (['FormSelect', 'FormMultiSelect'].includes(componentName) && propertyName === 'valueMode')
    return 'SelectValueMode';
  if (['FormSelect', 'FormMultiSelect'].includes(componentName) && propertyName === 'labels')
    return 'Partial<PeauiSelectLabels>';
  if (componentName === 'KeyboardKey') {
    if (propertyName === 'keys') return 'string | readonly string[]';
    if (propertyName === 'platform') return "'auto' | 'windows' | 'mac' | 'linux' | 'generic'";
    if (propertyName === 'format') return "'symbol' | 'text'";
    if (propertyName === 'size') return "'xs' | 's' | 'm'";
  }
  if (componentName === 'ScrollArea') {
    if (propertyName === 'type') return "'native' | 'styled'";
    if (propertyName === 'orientation') return "'vertical' | 'horizontal' | 'both'";
    if (propertyName === 'scrollbarVisibility') return "'auto' | 'always' | 'hover'";
  }
  if (componentName === 'FormRatingInput') {
    if (propertyName === 'value') return 'number | null';
    if (propertyName === 'step') return '0.5 | 1';
    if (propertyName === 'size') return "'s' | 'm' | 'l'";
    if (propertyName === 'labels') return 'Readonly<Record<string, string>>';
    if (propertyName === 'getLabel') {
      return '(value: number | null, max: number) => string | undefined';
    }
  }
  if (componentName === 'FormTagsInput') {
    if (propertyName === 'value') return 'PeauiFormTagsInputTag[]';
    if (propertyName === 'suggestions') return 'ReadonlyArray<PeauiFormTagsInputTag>';
    if (propertyName === 'disabledTags') return 'ReadonlyArray<string | number>';
    if (propertyName === 'separators') return 'ReadonlyArray<string>';
    if (propertyName === 'mode') return "'freeform' | 'suggestions-only'";
    if (propertyName === 'layout') return "'inline' | 'stacked'";
    if (propertyName === 'placement') return "'auto' | 'top' | 'bottom'";
    if (propertyName === 'normalizeTag') return 'PeauiFormTagsInputNormalizer';
    if (propertyName === 'validateTag') return 'PeauiFormTagsInputValidator';
    if (propertyName === 'getTagKey') return 'PeauiFormTagsInputKeyGetter';
    if (propertyName === 'serializeTag') return 'PeauiFormTagsInputSerializer';
    if (propertyName === 'suggestionProvider') return 'PeauiFormTagsInputSuggestionProvider';
  }
  if (componentName === 'FormPinInput') {
    if (propertyName === 'type') return "'numeric' | 'alphanumeric'";
    if (propertyName === 'size') return "'s' | 'm' | 'l'";
    if (propertyName === 'inputmode') {
      return "'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'";
    }
    if (propertyName === 'transform') return 'PeauiFormPinInputTransform';
  }
  if (componentName === 'FormColorPicker') {
    if (['savedColors', 'recentColors'].includes(propertyName)) {
      return 'ReadonlyArray<PeauiFormColorPickerSwatch>';
    }
    if (propertyName === 'format') return "'hex' | 'rgb' | 'hsl'";
    if (propertyName === 'variant') return "'popover' | 'inline'";
    if (propertyName === 'density') return "'compact' | 'full'";
    if (propertyName === 'placement') return "'top' | 'bottom'";
  }
  if (componentName === 'FormDateTimePicker') {
    if (['value', 'min', 'max'].includes(propertyName)) {
      return 'PeauiLocalDateTimeValue | undefined';
    }
    if (propertyName === 'variant') return "'single-input' | 'split-input'";
    if (propertyName === 'layout') return "'side-by-side' | 'stacked'";
    if (propertyName === 'placement') return "'top' | 'bottom'";
    if (propertyName === 'dateFormat') return "'iso' | 'locale'";
    if (propertyName === 'format') return "'12h' | '24h'";
    if (propertyName === 'isDateTimeDisabled') {
      return '(value: PeauiLocalDateTimeValue) => boolean';
    }
  }
  if (componentName === 'FormDateRangePicker') {
    if (propertyName === 'value') return 'PeauiDateRangeValue | undefined';
    if (propertyName === 'presets') return 'ReadonlyArray<PeauiDateRangePreset>';
    if (propertyName === 'calendars') return '1 | 2';
    if (propertyName === 'variant') return "'single-input' | 'two-inputs'";
    if (propertyName === 'selectionOrder') return "'swap' | 'reject' | 'resetEnd'";
    if (propertyName === 'placement') return "'top' | 'bottom'";
    if (propertyName === 'dateFormat') return "'iso' | 'locale'";
    if (propertyName === 'format') return 'PeauiDateRangeFormatter';
    if (propertyName === 'parse') return 'PeauiDateRangeParser';
    if (propertyName === 'isDateDisabled') return '(date: string) => boolean';
  }
  if (componentName === 'FormTimePicker') {
    if (propertyName === 'variant') return "'input' | 'segmented'";
    if (propertyName === 'panelMode') return "'dropdown' | 'spinbutton'";
    if (propertyName === 'placement') return "'top' | 'bottom'";
    if (propertyName === 'format') return "'12h' | '24h'";
    if (propertyName === 'parse') return 'PeauiTimePickerParser';
    if (propertyName === 'formatValue') return 'PeauiTimePickerFormatter';
  }
  if (componentName === 'SegmentedControl' && propertyName === 'items') {
    return 'PeauiSegmentedControlItem[]';
  }
  if (componentName === 'SegmentedControl' && propertyName === 'value') {
    return 'PeauiSegmentedControlModelValue';
  }
  if (componentName === 'ToggleGroup' && propertyName === 'items') {
    return 'PeauiToggleGroupItem[]';
  }
  if (componentName === 'ToggleGroup' && propertyName === 'value') {
    return 'PeauiToggleGroupModelValue';
  }
  if (componentName === 'AvatarGroup' && propertyName === 'items') {
    return 'PeauiAvatarGroupItem[]';
  }
  if (
    ['ContextMenu', 'DropdownMenu', 'SplitButton'].includes(componentName) &&
    propertyName === 'items'
  ) {
    return 'PeauiDropdownMenuItem[]';
  }
  if (componentName === 'MenuBar' && propertyName === 'menus') {
    return 'PeauiMenuBarMenu[]';
  }
  if (componentName === 'ContextMenu' && propertyName === 'density') {
    return "'compact' | 'comfortable'";
  }
  if (componentName === 'AvatarGroup' && propertyName === 'itemKey') {
    return 'keyof PeauiAvatarGroupItem | ((item: PeauiAvatarGroupItem, index: number) => string | number)';
  }
  if (propertyName === 'columns')
    return ['GridItem', 'GridSection'].includes(componentName) ? 'number' : 'PeauiTableColumn[]';
  if (propertyName === 'records') return 'PeauiRecord[]';
  if (['items', 'options', 'tabs'].includes(propertyName)) return 'PeauiOption[]';
  if (propertyName === 'tree') return 'PeauiTreeNode | PeauiTreeNode[]';
  if (propertyName === 'image') return 'string | File | Blob | undefined';
  if (propertyName === 'file') return 'FormFileUploadValue | File | undefined';
  if (propertyName === 'sortColumns') return 'PeauiSortDescriptor[]';
  if (propertyName === 'sortType') return "'asc' | 'desc' | undefined";
  if (propertyName === 'value' && type.includes('DatePickerRangeValue')) {
    return 'string | PeauiPickerRangeValue<string> | undefined';
  }
  if (propertyName === 'value' && type.includes('YearPickerRangeValue')) {
    return 'number | PeauiPickerRangeValue<number> | undefined';
  }
  const normalized = type
    .replace(/\bany\b/g, 'unknown')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\|\s*/, '');

  if (
    /^(?:string|number|boolean|unknown|null|undefined|File|Date)(?:\[\])?(?:\s*\|\s*(?:string|number|boolean|unknown|null|undefined|File|Date)(?:\[\])?)*$/.test(
      normalized,
    )
  ) {
    return normalized;
  }

  if (/^(?:'[^']+'\s*\|\s*)*'[^']+'$/.test(normalized)) return normalized;
  if (/^string\[\]$|^number\[\]$|^File\[\]$|^unknown\[\]$/.test(normalized)) return normalized;
  if (/^Record<string, unknown>(?:\[\])?$/.test(normalized)) return normalized;

  return 'unknown';
}

function renderProperty(name, type, required, description) {
  const propertyName = /^[A-Za-z_$][\w$]*$/.test(name) ? name : JSON.stringify(name);
  const optional = required ? '' : '?';
  return `    /** ${description.replace(
    /\*\//g,
    '* /',
  )} */\n    ${propertyName}${optional}: ${type};`;
}

function renderProps(api) {
  const entries = [];

  for (const prop of api.props) {
    entries.push(
      renderProperty(
        prop.name,
        normalizeType(prop.type, prop.name, api.name),
        prop.required,
        prop.description,
      ),
    );
  }

  for (const model of api.models) {
    const name = toCamelCase(model.name);
    const type = normalizeType(model.type, name, api.name);
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    entries.push(renderProperty(name, type, false, model.description));
    entries.push(
      renderProperty(
        `default${capitalized}`,
        type,
        false,
        `Początkowa niekontrolowana wartość właściwości ${name}.`,
      ),
    );
    entries.push(
      renderProperty(
        `on${capitalized}Change`,
        `(value: ${type}) => void`,
        false,
        `Callback React wywoływany po zmianie właściwości ${name}.`,
      ),
    );
  }

  for (const event of api.events) {
    const callbackName = getCallbackName(event.name);

    if (['onClick', 'onKeyDown', 'onPointerDown'].includes(callbackName)) continue;
    if (entries.some((entry) => entry.includes(` ${callbackName}?`))) continue;
    const dropdownEventTypes = {
      select: '(item: PeauiDropdownMenuItem, path: number[]) => void',
      checkedChange: '(item: PeauiDropdownMenuItem, checked: boolean, path: number[]) => void',
      valueChange: '(item: PeauiDropdownMenuItem, value: unknown, path: number[]) => void',
      openChange: '(value: boolean) => void',
      escape: '() => void',
      outsideClick: '() => void',
    };
    const contextMenuEventTypes = {
      open: '(detail: PeauiContextMenuOpenDetail) => void',
      close: '(reason: PeauiContextMenuCloseReason) => void',
      select: '(item: PeauiDropdownMenuItem, path: number[], context: unknown) => void',
      checkedChange:
        '(item: PeauiDropdownMenuItem, checked: boolean, path: number[], context: unknown) => void',
      valueChange:
        '(item: PeauiDropdownMenuItem, value: unknown, path: number[], context: unknown) => void',
      contextChange: '(context: unknown) => void',
      longPressCancel: '(reason: PeauiContextMenuLongPressCancelReason) => void',
    };
    const menuBarEventTypes = {
      select: '(item: PeauiDropdownMenuItem, path: number[], menu: PeauiMenuBarMenu) => void',
      focusChange: '(menu: PeauiMenuBarMenu, index: number) => void',
      checkedChange:
        '(item: PeauiDropdownMenuItem, checked: boolean, path: number[], menu: PeauiMenuBarMenu) => void',
      valueChange:
        '(item: PeauiDropdownMenuItem, value: unknown, path: number[], menu: PeauiMenuBarMenu) => void',
    };
    const toggleGroupEventTypes = {
      change:
        '(value: PeauiToggleGroupModelValue, item: PeauiToggleGroupItem, event: MouseEvent<HTMLButtonElement>) => void',
      focusChange: '(item: PeauiToggleGroupItem, index: number) => void',
    };
    const segmentedControlEventTypes = {
      change:
        '(value: PeauiSegmentedControlValue, item: PeauiSegmentedControlItem, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void',
      focusChange: '(item: PeauiSegmentedControlItem, index: number) => void',
    };
    const splitButtonEventTypes = {
      primaryClick: '(event: MouseEvent<HTMLButtonElement>) => void',
      select: '(item: PeauiDropdownMenuItem, path: number[]) => void',
    };
    const formTimePickerEventTypes = {
      change: '(value: string | undefined, parts: PeauiTimePickerParts | undefined) => void',
      invalid: '(detail: PeauiTimePickerInvalidDetail) => void',
      open: '() => void',
      close: '() => void',
    };
    const formDateTimePickerEventTypes = {
      apply: '(value: PeauiLocalDateTimeValue) => void',
      cancel: '() => void',
      change: '(value: PeauiLocalDateTimeValue | undefined) => void',
      close: '() => void',
      dateChange: '(date: string | undefined) => void',
      invalid: '(detail: PeauiDateTimePickerInvalidDetail) => void',
      open: '() => void',
      timeChange: '(time: string | undefined) => void',
    };
    const formDateRangePickerEventTypes = {
      apply: '(value: [string, string]) => void',
      cancel: '() => void',
      change: '(value: PeauiDateRangeValue | undefined) => void',
      close: '() => void',
      endChange: '(value: string | undefined) => void',
      invalid: '(detail: PeauiDateRangePickerInvalidDetail) => void',
      monthChange: '(value: { month: number; year: number }) => void',
      open: '() => void',
      startChange: '(value: string | undefined) => void',
    };
    const formColorPickerEventTypes = {
      change: '(value: string) => void',
      close: '() => void',
      commit: '(value: string) => void',
      eyedropperError: '(detail: PeauiFormColorPickerEyedropperErrorDetail) => void',
      eyedropperStart: '() => void',
      invalid: '(detail: PeauiFormColorPickerInvalidDetail) => void',
      open: '() => void',
    };
    const formPinInputEventTypes = {
      blur: '(event: ReactFocusEvent<HTMLDivElement>) => void',
      change: '(value: string, event: Event) => void',
      complete: '(value: string, event: Event) => void',
      focus: '(event: ReactFocusEvent<HTMLInputElement>, index: number) => void',
      invalidInput: '(detail: PeauiFormPinInputInvalidDetail, event: Event) => void',
    };
    const formTagsInputEventTypes = {
      add: '(tag: PeauiFormTagsInputTag, index: number, event: Event) => void',
      remove: '(tag: PeauiFormTagsInputTag, index: number, event: Event) => void',
      edit: '(previous: PeauiFormTagsInputTag, next: PeauiFormTagsInputTag, index: number, event: Event) => void',
      invalidTag: '(detail: PeauiFormTagsInputInvalidDetail, event: Event) => void',
      search: '(query: string, requestId: number) => void',
      maxReached: '(max: number, event: Event) => void',
    };
    const formRatingInputEventTypes = {
      blur: '(event: ReactFocusEvent<HTMLInputElement>) => void',
      change: '(value: number | null, event: Event) => void',
      clear: '(event: Event) => void',
      focus: '(event: ReactFocusEvent<HTMLInputElement>) => void',
      previewChange: '(value: number | null) => void',
    };
    const eventType =
      api.name === 'FormRatingInput' && formRatingInputEventTypes[event.name]
        ? formRatingInputEventTypes[event.name]
        : api.name === 'FormTagsInput' && formTagsInputEventTypes[event.name]
          ? formTagsInputEventTypes[event.name]
          : api.name === 'FormPinInput' && formPinInputEventTypes[event.name]
            ? formPinInputEventTypes[event.name]
            : api.name === 'FormColorPicker' && formColorPickerEventTypes[event.name]
              ? formColorPickerEventTypes[event.name]
              : api.name === 'AvatarGroup' && event.name === 'select'
                ? '(item: PeauiAvatarGroupItem, index: number) => void'
                : api.name === 'AvatarGroup' && event.name === 'overflowClick'
                  ? '(items: PeauiAvatarGroupItem[]) => void'
                  : api.name === 'ContextMenu' && contextMenuEventTypes[event.name]
                    ? contextMenuEventTypes[event.name]
                    : api.name === 'MenuBar' && menuBarEventTypes[event.name]
                      ? menuBarEventTypes[event.name]
                      : api.name === 'ToggleGroup' && toggleGroupEventTypes[event.name]
                        ? toggleGroupEventTypes[event.name]
                        : api.name === 'SegmentedControl' && segmentedControlEventTypes[event.name]
                          ? segmentedControlEventTypes[event.name]
                          : api.name === 'SplitButton' && splitButtonEventTypes[event.name]
                            ? splitButtonEventTypes[event.name]
                            : api.name === 'FormTimePicker' && formTimePickerEventTypes[event.name]
                              ? formTimePickerEventTypes[event.name]
                              : api.name === 'FormDateTimePicker' &&
                                  formDateTimePickerEventTypes[event.name]
                                ? formDateTimePickerEventTypes[event.name]
                                : api.name === 'FormDateRangePicker' &&
                                    formDateRangePickerEventTypes[event.name]
                                  ? formDateRangePickerEventTypes[event.name]
                                  : api.name === 'DropdownMenu' && dropdownEventTypes[event.name]
                                    ? dropdownEventTypes[event.name]
                                    : '(...args: unknown[]) => void';
    entries.push(renderProperty(callbackName, eventType, false, event.description));
  }

  for (const slot of api.slots) {
    if (slot.name === 'default') continue;
    if (slot.name.includes('[')) {
      if (!entries.some((entry) => entry.includes(' renderCell?'))) {
        entries.push(
          renderProperty(
            'renderCell',
            '(columnKey: string, record: PeauiRecord, rowIndex: number) => ReactNode',
            false,
            'Renderuje niestandardową zawartość komórki tabeli.',
          ),
        );
      }
      continue;
    }
    const rawName = toCamelCase(slot.name.replace(/[^A-Za-z0-9-]/g, '-'));
    const avatarGroupSlotNames = {
      item: 'renderItem',
      overflow: 'renderOverflow',
      popoverItem: 'renderPopoverItem',
    };
    const dropdownMenuSlotNames = {
      trigger: 'renderTrigger',
      item: 'renderItem',
      itemIcon: 'renderItemIcon',
      itemShortcut: 'renderItemShortcut',
      groupLabel: 'renderGroupLabel',
      loading: 'loadingContent',
    };
    const contextMenuSlotNames = {
      trigger: 'renderTarget',
      item: 'renderItem',
      itemIcon: 'renderItemIcon',
      itemShortcut: 'renderItemShortcut',
      groupLabel: 'renderGroupLabel',
      loading: 'loadingContent',
    };
    const menuBarSlotNames = {
      menuTrigger: 'renderMenuTrigger',
      item: 'renderItem',
      groupLabel: 'renderGroupLabel',
      shortcut: 'renderShortcut',
    };
    const formSwitchToggleSlotNames = {
      label: 'labelContent',
      description: 'descriptionContent',
      error: 'errorContent',
      thumb: 'renderThumb',
      onLabel: 'onLabelContent',
      offLabel: 'offLabelContent',
    };
    const toggleButtonSlotNames = {
      icon: 'iconContent',
      pressedIcon: 'pressedIconContent',
    };
    const toggleGroupSlotNames = {
      item: 'renderItem',
      label: 'labelContent',
      error: 'errorContent',
    };
    const segmentedControlSlotNames = {
      item: 'renderItem',
      itemIcon: 'renderItemIcon',
      indicator: 'renderIndicator',
    };
    const splitButtonSlotNames = {
      label: 'labelContent',
      icon: 'iconContent',
      menuTriggerIcon: 'menuTriggerIconContent',
      menuItem: 'renderMenuItem',
      menuItemIcon: 'renderMenuItemIcon',
      menuItemShortcut: 'renderMenuItemShortcut',
      groupLabel: 'renderGroupLabel',
      empty: 'emptyContent',
      menuLoading: 'menuLoadingContent',
    };
    const formTimePickerSlotNames = {
      trigger: 'renderTrigger',
      hourOption: 'renderHourOption',
      minuteOption: 'renderMinuteOption',
      secondOption: 'renderSecondOption',
      periodOption: 'renderPeriodOption',
      footer: 'footerContent',
      error: 'errorContent',
      description: 'descriptionContent',
    };
    const formDateTimePickerSlotNames = {
      trigger: 'renderTrigger',
      date: 'renderDate',
      time: 'renderTime',
      timeZone: 'renderTimeZone',
      footer: 'footerContent',
      error: 'errorContent',
      description: 'descriptionContent',
    };
    const formColorPickerSlotNames = {
      trigger: 'renderTrigger',
      swatch: 'renderSwatch',
      savedColor: 'renderSavedColor',
      recentColor: 'renderRecentColor',
      footer: 'renderFooter',
      error: 'errorContent',
      description: 'descriptionContent',
      hint: 'hintContent',
    };
    const formPinInputSlotNames = {
      label: 'labelContent',
      hint: 'hintContent',
      separator: 'renderSeparator',
      description: 'descriptionContent',
      error: 'errorContent',
    };
    const formTagsInputSlotNames = {
      label: 'renderLabel',
      hint: 'renderHint',
      tag: 'renderTag',
      tagContent: 'renderTagContent',
      suggestion: 'renderSuggestion',
      emptySuggestions: 'renderEmptySuggestions',
      loading: 'loadingContent',
      prefix: 'prefixContent',
      suffix: 'suffixContent',
      description: 'descriptionContent',
      error: 'errorContent',
    };
    const formRatingInputSlotNames = {
      icon: 'renderIcon',
      label: 'labelContent',
      valueLabel: 'renderValueLabel',
      description: 'descriptionContent',
      error: 'errorContent',
    };
    const keyboardKeySlotNames = {
      key: 'renderKey',
      separator: 'renderSeparator',
    };
    const name =
      api.name === 'KeyboardKey'
        ? (keyboardKeySlotNames[rawName] ?? rawName)
        : api.name === 'FormRatingInput'
          ? (formRatingInputSlotNames[rawName] ?? rawName)
          : api.name === 'FormTagsInput'
            ? (formTagsInputSlotNames[rawName] ?? rawName)
            : api.name === 'FormPinInput'
              ? (formPinInputSlotNames[rawName] ?? rawName)
              : api.name === 'FormColorPicker'
                ? (formColorPickerSlotNames[rawName] ?? rawName)
                : api.name === 'Avatar' && rawName === 'status'
                  ? 'statusContent'
                  : api.name === 'AvatarGroup'
                    ? (avatarGroupSlotNames[rawName] ?? rawName)
                    : api.name === 'ContextMenu'
                      ? (contextMenuSlotNames[rawName] ?? rawName)
                      : api.name === 'MenuBar'
                        ? (menuBarSlotNames[rawName] ?? rawName)
                        : api.name === 'FormSwitchToggle'
                          ? (formSwitchToggleSlotNames[rawName] ?? rawName)
                          : api.name === 'ToggleButton'
                            ? (toggleButtonSlotNames[rawName] ?? rawName)
                            : api.name === 'ToggleGroup'
                              ? (toggleGroupSlotNames[rawName] ?? rawName)
                              : api.name === 'SegmentedControl'
                                ? (segmentedControlSlotNames[rawName] ?? rawName)
                                : api.name === 'SplitButton'
                                  ? (splitButtonSlotNames[rawName] ?? rawName)
                                  : api.name === 'FormTimePicker'
                                    ? (formTimePickerSlotNames[rawName] ?? rawName)
                                    : api.name === 'FormDateTimePicker'
                                      ? (formDateTimePickerSlotNames[rawName] ?? rawName)
                                      : api.name === 'DropdownMenu'
                                        ? (dropdownMenuSlotNames[rawName] ?? rawName)
                                        : rawName;
    if (!name || entries.some((entry) => entry.includes(` ${name}?`))) continue;
    const slotType =
      api.name === 'KeyboardKey' && name === 'renderKey'
        ? "(state: { accessibleLabel: string; index: number; key: string; platform: 'windows' | 'mac' | 'linux' | 'generic'; token: string; visualLabel: string }) => ReactNode"
        : api.name === 'KeyboardKey' && name === 'renderSeparator'
          ? '(state: { index: number; separator: string }) => ReactNode'
          : api.name === 'FormRatingInput' && name === 'renderIcon'
            ? '(state: { fill: 0 | 50 | 100; index: number; value: number | null }) => ReactNode'
            : api.name === 'FormRatingInput' && name === 'renderValueLabel'
              ? '(state: { text: string; value: number | null }) => ReactNode'
              : api.name === 'FormTagsInput' && name === 'renderLabel'
                ? '(state: { count: number }) => ReactNode'
                : api.name === 'FormTagsInput' && name === 'renderHint'
                  ? '(state: { count: number; max?: number }) => ReactNode'
                  : api.name === 'FormTagsInput' && name === 'renderTag'
                    ? '(state: { tag: PeauiFormTagsInputTag; index: number; selected: boolean; editing: boolean; disabled: boolean }) => ReactNode'
                    : api.name === 'FormTagsInput' && name === 'renderTagContent'
                      ? '(state: { tag: PeauiFormTagsInputTag; index: number }) => ReactNode'
                      : api.name === 'FormTagsInput' && name === 'renderSuggestion'
                        ? '(state: { suggestion: PeauiFormTagsInputTag; index: number; active: boolean }) => ReactNode'
                        : api.name === 'FormTagsInput' && name === 'renderEmptySuggestions'
                          ? '(state: { query: string }) => ReactNode'
                          : api.name === 'FormPinInput' && name === 'renderSeparator'
                            ? '(state: { index: number }) => ReactNode'
                            : api.name === 'FormColorPicker' && name === 'renderTrigger'
                              ? '(state: { color: string; open: boolean; toggle: () => void }) => ReactNode'
                              : api.name === 'FormColorPicker' && name === 'renderSwatch'
                                ? '(state: { color: string }) => ReactNode'
                                : api.name === 'FormColorPicker' &&
                                    ['renderSavedColor', 'renderRecentColor'].includes(name)
                                  ? '(state: { color: PeauiFormColorPickerSwatch; index: number }) => ReactNode'
                                  : api.name === 'FormColorPicker' && name === 'renderFooter'
                                    ? '(state: { color: string }) => ReactNode'
                                    : api.name === 'AvatarGroup' && name === 'renderItem'
                                      ? '(item: PeauiAvatarGroupItem, index: number) => ReactNode'
                                      : api.name === 'AvatarGroup' && name === 'renderOverflow'
                                        ? '(count: number, items: PeauiAvatarGroupItem[]) => ReactNode'
                                        : api.name === 'AvatarGroup' && name === 'renderPopoverItem'
                                          ? '(item: PeauiAvatarGroupItem, index: number) => ReactNode'
                                          : api.name === 'ContextMenu' && name === 'renderTarget'
                                            ? '(state: { open: boolean; disabled: boolean; context: unknown }) => ReactNode'
                                            : api.name === 'ContextMenu' &&
                                                [
                                                  'renderItem',
                                                  'renderItemIcon',
                                                  'renderItemShortcut',
                                                  'renderGroupLabel',
                                                ].includes(name)
                                              ? '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode'
                                              : api.name === 'MenuBar' &&
                                                  name === 'renderMenuTrigger'
                                                ? '(menu: PeauiMenuBarMenu, state: { open: boolean; disabled: boolean }) => ReactNode'
                                                : api.name === 'MenuBar' &&
                                                    [
                                                      'renderItem',
                                                      'renderGroupLabel',
                                                      'renderShortcut',
                                                    ].includes(name)
                                                  ? '(item: PeauiDropdownMenuItem, path: number[], menu: PeauiMenuBarMenu) => ReactNode'
                                                  : api.name === 'FormSwitchToggle' &&
                                                      name === 'renderThumb'
                                                    ? '(state: { checked: boolean; loading: boolean }) => ReactNode'
                                                    : api.name === 'ToggleGroup' &&
                                                        name === 'renderItem'
                                                      ? '(item: PeauiToggleGroupItem, state: { pressed: boolean; disabled: boolean; index: number }) => ReactNode'
                                                      : api.name === 'SegmentedControl' &&
                                                          name === 'renderItem'
                                                        ? '(item: PeauiSegmentedControlItem, state: { selected: boolean; disabled: boolean; index: number }) => ReactNode'
                                                        : api.name === 'SegmentedControl' &&
                                                            name === 'renderItemIcon'
                                                          ? '(item: PeauiSegmentedControlItem, state: { selected: boolean; index: number }) => ReactNode'
                                                          : api.name === 'SegmentedControl' &&
                                                              name === 'renderIndicator'
                                                            ? '(item: PeauiSegmentedControlItem | null, index: number) => ReactNode'
                                                            : api.name === 'SplitButton' &&
                                                                [
                                                                  'renderMenuItem',
                                                                  'renderMenuItemIcon',
                                                                  'renderMenuItemShortcut',
                                                                  'renderGroupLabel',
                                                                ].includes(name)
                                                              ? '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode'
                                                              : api.name === 'FormTimePicker' &&
                                                                  name === 'renderTrigger'
                                                                ? '(state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode'
                                                                : api.name ===
                                                                      'FormDateTimePicker' &&
                                                                    name === 'renderTrigger'
                                                                  ? '(state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode'
                                                                  : api.name ===
                                                                        'FormDateTimePicker' &&
                                                                      name === 'renderDate'
                                                                    ? '(state: { date: string | undefined }) => ReactNode'
                                                                    : api.name ===
                                                                          'FormDateTimePicker' &&
                                                                        name === 'renderTime'
                                                                      ? '(state: { time: string | undefined }) => ReactNode'
                                                                      : api.name ===
                                                                            'FormDateTimePicker' &&
                                                                          name === 'renderTimeZone'
                                                                        ? '(state: { timeZone: string }) => ReactNode'
                                                                        : api.name ===
                                                                              'FormTimePicker' &&
                                                                            [
                                                                              'renderHourOption',
                                                                              'renderMinuteOption',
                                                                              'renderSecondOption',
                                                                              'renderPeriodOption',
                                                                            ].includes(name)
                                                                          ? '(option: PeauiTimePickerOption, selected: boolean) => ReactNode'
                                                                          : api.name ===
                                                                                'DropdownMenu' &&
                                                                              name ===
                                                                                'renderTrigger'
                                                                            ? '(state: { open: boolean; disabled: boolean }) => ReactNode'
                                                                            : api.name ===
                                                                                  'DropdownMenu' &&
                                                                                [
                                                                                  'renderItem',
                                                                                  'renderItemIcon',
                                                                                  'renderItemShortcut',
                                                                                  'renderGroupLabel',
                                                                                ].includes(name)
                                                                              ? '(item: PeauiDropdownMenuItem, path: number[]) => ReactNode'
                                                                              : 'ReactNode';
    entries.push(renderProperty(name, slotType, false, slot.description));
  }

  return entries.join('\n');
}

function writePropsFile(components) {
  const names = components.map((api) => `'${toPublicName(api.name)}'`).join(' | ');
  const map = components
    .map((api) => {
      const props = `PeauiReactBaseProps & {\n${renderProps(api)}\n  }`;
      return `  ${toPublicName(api.name)}: ${api.name === 'FormFileUpload' ? `Omit<${props}, 'valueMode' | 'onFileChange'> & PeauiFileUploadModel` : props};`;
    })
    .join('\n');
  const source =
    `// Ten plik jest generowany przez scripts/generate-react-components.mjs.\n` +
    `// Źródłem kontraktu są publiczne propsy, modele, zdarzenia i sloty komponentów Vue.\n\n` +
    `import type { FormFileUploadValue, FileUploadValueMode } from '../components/form/FormFileUpload/file-upload.shared';\n` +
    `import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ImgHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, HTMLAttributes, CSSProperties, FocusEvent as ReactFocusEvent, FocusEventHandler, KeyboardEvent, KeyboardEventHandler, MouseEvent, MouseEventHandler, PointerEventHandler, ReactNode } from 'react';\n\n` +
    `export type ReactComponentName = ${names};\n\n` +
    `import type { SelectLabels, SelectValueMode } from '../components/form/FormSelect/select.shared';\nexport type PeauiSelectLabels = SelectLabels;\n\n` +
    `import type { TableColumn } from '../components/data-display/TableList/table.types';\n` +
    `export type PeauiReactBaseProps = {\n` +
    `  children?: ReactNode;\n` +
    `  className?: string;\n` +
    `  style?: CSSProperties;\n` +
    `  role?: string;\n` +
    `  tabIndex?: number;\n` +
    `  onClick?: MouseEventHandler<HTMLElement>;\n` +
    `  onFocus?: FocusEventHandler<HTMLElement>;\n` +
    `  onBlur?: FocusEventHandler<HTMLElement>;\n` +
    `  onKeyDown?: KeyboardEventHandler<HTMLElement>;\n` +
    `  onPointerDown?: PointerEventHandler<HTMLElement>;\n` +
    `  'aria-label'?: string;\n` +
    `  'aria-hidden'?: boolean | 'false' | 'true';\n` +
    `  'aria-describedby'?: string;\n` +
    `  'aria-labelledby'?: string;\n` +
    `  'data-testid'?: string;\n` +
    `};\n\n` +
    `export type PeauiRecord = Record<string, unknown>;\n` +
    `export type PeauiAvatarGroupItem = { id: string | number; name?: string; src?: string; alt?: string; initials?: string; status?: 'online' | 'offline' | 'away' | 'busy' | 'none'; disabled?: boolean; metadata?: unknown };\n` +
    `export type PeauiToggleGroupValue = string | number;\n` +
    `export type PeauiToggleGroupModelValue = PeauiToggleGroupValue | PeauiToggleGroupValue[] | null;\n` +
    `export type PeauiToggleGroupItem = { value: PeauiToggleGroupValue; label: string; ariaLabel?: string; pressedLabel?: string; icon?: string; pressedIcon?: string; content?: 'text' | 'icon' | 'icon-text'; disabled?: boolean; readonly?: boolean; loading?: boolean; metadata?: unknown };\n` +
    `export type PeauiSegmentedControlValue = string | number;\n` +
    `export type PeauiSegmentedControlModelValue = PeauiSegmentedControlValue | null;\n` +
    `export type PeauiSegmentedControlItem = { value: PeauiSegmentedControlValue; label: string; icon?: string; ariaLabel?: string; disabled?: boolean; metadata?: unknown };\n` +
    `export type PeauiTimePickerParts = { hour: number; minute: number; second: number };\n` +
    `export type PeauiTimePickerFormatContext = { format: '12h' | '24h'; locale: string; showSeconds: boolean };\n` +
    `export type PeauiTimePickerOption = { disabled: boolean; label: string; value: number | 'am' | 'pm' };\n` +
    `export type PeauiTimePickerInvalidDetail = { input: string; reason: 'empty' | 'format' | 'range' | 'step' };\n` +
    `export type PeauiTimePickerParser = (input: string, context: PeauiTimePickerFormatContext) => string | PeauiTimePickerParts | null | undefined;\n` +
    `export type PeauiTimePickerFormatter = (value: string, context: PeauiTimePickerFormatContext) => string;\n` +
    `export type PeauiLocalDateTimeValue = { date: string; time: string };\n` +
    `export type PeauiDateTimePickerInvalidDetail = { input: string | Partial<PeauiLocalDateTimeValue> | undefined; reason: 'empty' | 'partial' | 'date' | 'time' | 'range' | 'disabled'; section: 'date' | 'time' | 'value' };\n` +
    `export type PeauiDateRangeValue = [string | undefined, string | undefined];\n` +
    `export type PeauiDateRangePreset = { disabled?: boolean; id: string; label: string; value: PeauiDateRangeValue };\n` +
    `export type PeauiDateRangeFormatContext = { endpoint: 'start' | 'end'; locale: string };\n` +
    `export type PeauiDateRangeFormatter = (value: string, context: PeauiDateRangeFormatContext) => string;\n` +
    `export type PeauiDateRangeParser = (input: string, context: PeauiDateRangeFormatContext) => string | undefined;\n` +
    `export type PeauiDateRangePickerInvalidDetail = { input: string | PeauiDateRangeValue | undefined; reason: 'empty' | 'partial' | 'format' | 'order' | 'range' | 'disabled'; section: 'start' | 'end' | 'value' };\n` +
    `export type PeauiFormColorPickerSwatch = { value: string; label?: string };\n` +
    `export type PeauiFormColorPickerInvalidDetail = { input: string; reason: 'empty' | 'format' };\n` +
    `export type PeauiFormColorPickerEyedropperErrorDetail = { error?: unknown; reason: 'unavailable' | 'cancelled' | 'failed' };\n` +
    `export type PeauiFormPinInputInvalidDetail = { input: string; rejected: string; reason: 'character' | 'pattern' | 'transform' | 'overflow'; index: number };\n` +
    `export type PeauiFormPinInputTransform = 'none' | 'uppercase' | 'lowercase' | ((character: string, index: number) => string);\n` +
    `export type PeauiFormTagsInputItem = { id?: string | number; label: string; value?: unknown; disabled?: boolean };\n` +
    `export type PeauiFormTagsInputTag = string | PeauiFormTagsInputItem;\n` +
    `export type PeauiFormTagsInputInvalidDetail = { input: string; reason: 'duplicate' | 'empty' | 'invalid' | 'max' | 'suggestion-only'; message: string; index: number };\n` +
    `export type PeauiFormTagsInputNormalizer = (input: string) => PeauiFormTagsInputTag;\n` +
    `export type PeauiFormTagsInputValidator = (tag: PeauiFormTagsInputTag, tags: readonly PeauiFormTagsInputTag[]) => boolean | string;\n` +
    `export type PeauiFormTagsInputKeyGetter = (tag: PeauiFormTagsInputTag, index: number) => string | number;\n` +
    `export type PeauiFormTagsInputSerializer = (tag: PeauiFormTagsInputTag, index: number) => string;\n` +
    `export type PeauiFormTagsInputSuggestionProvider = (query: string, signal: AbortSignal) => Promise<readonly PeauiFormTagsInputTag[]>;\n` +
    `export type PeauiDropdownMenuItem = { id: string | number; type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'group' | 'submenu'; label?: string; icon?: string; shortcut?: string; disabled?: boolean; checked?: boolean; value?: unknown; group?: string; children?: PeauiDropdownMenuItem[]; variant?: 'default' | 'danger'; closeOnSelect?: boolean; metadata?: unknown };\n` +
    `export type PeauiMenuBarMenu = { id: string | number; label: string; icon?: string; disabled?: boolean; items: PeauiDropdownMenuItem[] };\n` +
    `export type PeauiContextMenuOpenDetail = { context: unknown; source: 'pointer' | 'keyboard' | 'long-press' | 'programmatic'; x: number; y: number };\n` +
    `export type PeauiContextMenuCloseReason = 'programmatic' | 'dismiss' | 'select' | 'scroll' | 'target-removed' | 'disabled';\n` +
    `export type PeauiContextMenuLongPressCancelReason = 'move' | 'release' | 'pointer-cancel' | 'disabled' | 'target-removed';\n` +
    `export type PeauiOption = { id?: string; key?: string | number; label: string; value?: unknown; active?: boolean; disabled?: boolean; hint?: string; icon?: string; path?: string; isValid?: boolean; number?: string; status?: 'default' | 'complete' | 'during' | 'disabled' | 'hidden'; additional?: ReactNode };\n` +
    `export type PeauiTableColumn = Omit<TableColumn, 'label'> & { label?: string; sortable?: boolean };\n` +
    `export type PeauiTreeNode = PeauiRecord & { id?: string | number; label?: string; children?: PeauiTreeNode[] | Record<string, PeauiTreeNode> };\n` +
    `export type PeauiSortDescriptor = { key: string; direction?: 'asc' | 'desc' };\n` +
    `export type PeauiLegacyRangeValue<Value> = { from?: Value; to?: Value; start?: Value; end?: Value };\n` +
    `export type PeauiPickerRangeValue<Value> = [Value, Value] | PeauiLegacyRangeValue<Value>;\n` +
    `/** @deprecated Prefer PeauiPickerRangeValue for picker models. */\n` +
    `export type PeauiRangeValue<Value> = PeauiLegacyRangeValue<Value>;\n\n` +
    `export type PeauiFileUploadModel = { valueMode?: 'object'; onFileChange?: (value: FormFileUploadValue | undefined) => void } | { valueMode: 'file'; onFileChange?: (value: File | undefined) => void };\n\n` +
    `export type ReactComponentPropsMap = {\n${map}\n};\n\n` +
    `export type PeauiReactProps<Name extends ReactComponentName> = ReactComponentPropsMap[Name] & Omit<Name extends 'ButtonAction' ? ButtonHTMLAttributes<HTMLButtonElement> : Name extends 'CardPanel' | 'NavigationLink' | 'NavigationCard' | 'NavigationIconCard' ? AnchorHTMLAttributes<HTMLAnchorElement> : Name extends 'ImageView' ? ImgHTMLAttributes<HTMLImageElement> : Name extends 'FormInput' | 'FormNumber' | 'FormPassword' | 'SearchInput' | 'InputSlider' ? InputHTMLAttributes<HTMLInputElement> : Name extends 'FormTextarea' ? TextareaHTMLAttributes<HTMLTextAreaElement> : HTMLAttributes<HTMLElement>, keyof ReactComponentPropsMap[Name]>;\n`;

  fs.mkdirSync(reactRoot, { recursive: true });
  writeGeneratedFile(path.join(reactRoot, 'generated-react-props.ts'), source, 'utf8');
}

function writeCatalogFile(components) {
  const entries = components
    .map(
      (api) =>
        `  { category: '${api.category}', name: '${toPublicName(api.name)}', sourceName: '${
          api.name
        }' },`,
    )
    .join('\n');
  const source =
    `// Ten plik jest generowany przez scripts/generate-react-components.mjs.\n` +
    `import type { ReactComponentName } from './generated-react-props';\n\n` +
    `export const reactComponentCatalog = [\n${entries}\n] as const satisfies readonly { category: string; name: ReactComponentName; sourceName: string }[];\n`;
  writeGeneratedFile(path.join(reactRoot, 'generated-react-catalog.ts'), source, 'utf8');
}

function writeIconData() {
  const iconsDirectory = path.join(libraryRoot, 'src/assets/icons');
  const readAttribute = (source, name) =>
    source.match(new RegExp(`(?:^|\\s)${name}=["']([^"']+)["']`, 'i'))?.[1];
  const icons = fs
    .readdirSync(iconsDirectory)
    .filter((file) => file.endsWith('.svg'))
    .sort()
    .map((file) => {
      const source = fs.readFileSync(path.join(iconsDirectory, file), 'utf8').trim();
      const root = source.match(/<svg\b([^>]*)>/i)?.[1] ?? '';
      const viewBox = source.match(/viewBox=["']([^"']+)["']/)?.[1] ?? '0 0 24 24';
      const body = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim() ?? '';
      const icon = {
        body,
        viewBox,
        fill: readAttribute(root, 'fill'),
        stroke: readAttribute(root, 'stroke'),
        strokeWidth: readAttribute(root, 'stroke-width'),
        strokeLinecap: readAttribute(root, 'stroke-linecap'),
        strokeLinejoin: readAttribute(root, 'stroke-linejoin'),
      };

      return [
        path.basename(file, '.svg'),
        Object.fromEntries(Object.entries(icon).filter(([, value]) => value !== undefined)),
      ];
    });
  const source =
    `// Ten plik jest generowany przez scripts/generate-react-components.mjs.\n` +
    `export type ReactIconData = { body: string; viewBox: string; fill?: string; stroke?: string; strokeWidth?: string; strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit'; strokeLinejoin?: 'bevel' | 'miter' | 'round' | 'inherit' };\n\n` +
    `export const reactIconData: Readonly<Record<string, ReactIconData>> = ${JSON.stringify(
      Object.fromEntries(icons),
      null,
      2,
    )};\n`;
  writeGeneratedFile(path.join(reactRoot, 'generated-icon-data.ts'), source, 'utf8');

  // Individual exports let each control include only the icons it renders.
  const starSource = fs.readFileSync(path.join(iconsDirectory, 'core/star.svg'), 'utf8');
  const starRoot = starSource.match(/<svg\b([^>]*)>/i)?.[1] ?? '';
  const staticIcons = [
    ...icons,
    [
      'coreStar',
      {
        body: starSource.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim() ?? '',
        viewBox: readAttribute(starRoot, 'viewBox') ?? '0 0 24 24',
        fill: readAttribute(starRoot, 'fill'),
        stroke: readAttribute(starRoot, 'stroke'),
        strokeWidth: readAttribute(starRoot, 'stroke-width'),
        strokeLinecap: readAttribute(starRoot, 'stroke-linecap'),
        strokeLinejoin: readAttribute(starRoot, 'stroke-linejoin'),
      },
    ],
  ];
  writeGeneratedFile(
    path.join(reactRoot, 'generated-static-icons.ts'),
    `// Generated by scripts/generate-react-components.mjs.\n` +
      `import type { ReactIconData } from './generated-icon-data';\n\n` +
      staticIcons
        .map(
          ([name, icon]) =>
            `export const icon${name.replace(/(^|[^a-z0-9]+)([a-z0-9])/gi, (_, _separator, letter) => letter.toUpperCase())}: ReactIconData = ${JSON.stringify(icon)};\n`,
        )
        .join(''),
    'utf8',
  );

  const essentialIconNames = new Set([
    'arrow',
    'arrowRight',
    'arrowRounded',
    'check',
    'checkCircle',
    'close',
    'copy',
    'cross',
    'doubleArrowRounded',
    'download',
    'eye',
    'file',
    'hint',
    'info',
    'picture',
    'plus',
    'search',
    'sort',
    'trash',
  ]);
  const essentialIcons = Object.fromEntries(icons.filter(([name]) => essentialIconNames.has(name)));
  const essentialSource =
    `// Ten plik jest generowany przez scripts/generate-react-components.mjs.\n` +
    `import type { ReactIconData } from './generated-icon-data';\n\n` +
    `export const essentialReactIconData: Readonly<Record<string, ReactIconData>> = ${JSON.stringify(
      essentialIcons,
      null,
      2,
    )};\n`;
  writeGeneratedFile(
    path.join(reactRoot, 'generated-essential-icon-data.ts'),
    essentialSource,
    'utf8',
  );
}

function writeComponentFiles(components) {
  for (const api of components) {
    const publicName = toPublicName(api.name);
    const directory = path.join(componentsRoot, api.category, api.name);
    const componentSource =
      publicName === 'ContextMenu'
        ? `import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';\n\n` +
          `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
          `import type { PeauiReactProps } from '@/react/generated-react-props';\n\n` +
          `export type ContextMenuProps = PeauiReactProps<'ContextMenu'>;\n` +
          `export type ContextMenuHandle = HTMLElement & {\n` +
          `  openAt(point: { x: number; y: number; context?: unknown }): boolean;\n` +
          `  close(): void;\n` +
          `};\n\n` +
          `const ContextMenu = createPeauiReactComponent('ContextMenu') as unknown as ForwardRefExoticComponent<\n` +
          `  PropsWithoutRef<ContextMenuProps> & RefAttributes<ContextMenuHandle>\n` +
          `>;\n\n` +
          `export default ContextMenu;\n`
        : publicName === 'FormSwitchToggle'
          ? `import type { ChangeEvent, FocusEvent, ReactElement, RefAttributes } from 'react';\n\n` +
            `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
            `import type { PeauiReactProps } from '@/react/generated-react-props';\n\n` +
            `type GeneratedFormSwitchToggleProps = PeauiReactProps<'FormSwitchToggle'>;\n\n` +
            `export type FormSwitchToggleProps<Value = boolean> = Omit<\n` +
            `  GeneratedFormSwitchToggleProps,\n` +
            `  'defaultValue' | 'falseValue' | 'onBlur' | 'onChange' | 'onFocus' | 'onValueChange' | 'trueValue' | 'value'\n` +
            `> & {\n` +
            `  value?: Value;\n` +
            `  defaultValue?: Value;\n` +
            `  trueValue?: Value;\n` +
            `  falseValue?: Value;\n` +
            `  onValueChange?: (value: Value) => void;\n` +
            `  onChange?: (value: Value, event: ChangeEvent<HTMLInputElement>) => void;\n` +
            `  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;\n` +
            `  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;\n` +
            `};\n\n` +
            `const FormSwitchToggleBase = createPeauiReactComponent('FormSwitchToggle');\n\n` +
            `const FormSwitchToggle = FormSwitchToggleBase as unknown as <Value = boolean>(\n` +
            `  props: FormSwitchToggleProps<Value> & RefAttributes<HTMLInputElement>,\n` +
            `) => ReactElement | null;\n\n` +
            `export default FormSwitchToggle;\n`
          : publicName === 'FormTimePicker'
            ? `import type { ReactElement, ReactNode, RefAttributes } from 'react';\n\n` +
              `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
              `import type { PeauiReactProps } from '@/react/generated-react-props';\n` +
              `import type { TimePickerFormatter, TimePickerInvalidDetail, TimePickerOption, TimePickerParser, TimePickerParts } from './time-picker.shared';\n\n` +
              `type GeneratedFormTimePickerProps = PeauiReactProps<'FormTimePicker'>;\n\n` +
              `export type FormTimePickerProps = Omit<GeneratedFormTimePickerProps, 'description' | 'error' | 'formatValue' | 'onChange' | 'onInvalid' | 'parse'> & {\n` +
              `  description?: ReactNode;\n  error?: ReactNode;\n  parse?: TimePickerParser;\n  formatValue?: TimePickerFormatter;\n` +
              `  onChange?: (value: string | undefined, parts: TimePickerParts | undefined) => void;\n` +
              `  onInvalid?: (detail: TimePickerInvalidDetail) => void;\n` +
              `  renderTrigger?: (state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode;\n` +
              `  renderHourOption?: (option: TimePickerOption, selected: boolean) => ReactNode;\n` +
              `  renderMinuteOption?: (option: TimePickerOption, selected: boolean) => ReactNode;\n` +
              `  renderSecondOption?: (option: TimePickerOption, selected: boolean) => ReactNode;\n` +
              `  renderPeriodOption?: (option: TimePickerOption, selected: boolean) => ReactNode;\n` +
              `  footerContent?: ReactNode;\n  errorContent?: ReactNode;\n  descriptionContent?: ReactNode;\n};\n\n` +
              `export type { FormTimePickerFormat, FormTimePickerPanelMode, FormTimePickerPlacement, FormTimePickerVariant, TimePickerFormatContext, TimePickerFormatter, TimePickerInvalidDetail, TimePickerInvalidReason, TimePickerOption, TimePickerParser, TimePickerParts, TimePickerPeriod, TimePickerSegment } from './time-picker.shared';\n\n` +
              `const FormTimePickerBase = createPeauiReactComponent('FormTimePicker');\n` +
              `const FormTimePicker = FormTimePickerBase as unknown as (props: FormTimePickerProps & RefAttributes<HTMLElement>) => ReactElement | null;\n\n` +
              `export default FormTimePicker;\n`
            : publicName === 'FormColorPicker'
              ? `import type { ReactElement, ReactNode, RefAttributes } from 'react';\n\n` +
                `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                `import type { PeauiReactProps } from '@/react/generated-react-props';\n` +
                `import type { FormColorPickerEyedropperErrorDetail, FormColorPickerInvalidDetail, FormColorPickerSwatch } from './color-picker.shared';\n\n` +
                `type GeneratedFormColorPickerProps = PeauiReactProps<'FormColorPicker'>;\n\n` +
                `export type FormColorPickerProps = Omit<GeneratedFormColorPickerProps, 'defaultValue' | 'description' | 'error' | 'onChange' | 'onClose' | 'onCommit' | 'onEyedropperError' | 'onEyedropperStart' | 'onInvalid' | 'onOpen' | 'onOpenChange' | 'onValueChange' | 'value'> & {\n` +
                `  value?: string;\n  defaultValue?: string;\n  description?: ReactNode;\n  error?: ReactNode;\n` +
                `  onValueChange?: (value: string) => void;\n  onOpenChange?: (open: boolean) => void;\n  onChange?: (value: string) => void;\n  onCommit?: (value: string) => void;\n` +
                `  onInvalid?: (detail: FormColorPickerInvalidDetail) => void;\n  onEyedropperError?: (detail: FormColorPickerEyedropperErrorDetail) => void;\n` +
                `  onEyedropperStart?: () => void;\n  onOpen?: () => void;\n  onClose?: () => void;\n` +
                `  renderTrigger?: (state: { color: string; open: boolean; toggle: () => void }) => ReactNode;\n` +
                `  renderSwatch?: (state: { color: string }) => ReactNode;\n` +
                `  renderSavedColor?: (state: { color: FormColorPickerSwatch; index: number }) => ReactNode;\n` +
                `  renderRecentColor?: (state: { color: FormColorPickerSwatch; index: number }) => ReactNode;\n` +
                `  renderFooter?: (state: { color: string }) => ReactNode;\n  footerContent?: ReactNode;\n  hintContent?: ReactNode;\n  descriptionContent?: ReactNode;\n  errorContent?: ReactNode;\n};\n\n` +
                `export type { FormColorPickerDensity, FormColorPickerEyedropperErrorDetail, FormColorPickerFormat, FormColorPickerInvalidDetail, FormColorPickerInvalidReason, FormColorPickerPlacement, FormColorPickerSwatch, FormColorPickerVariant, HslaColor, HsvaColor, RgbaColor } from './color-picker.shared';\n\n` +
                `const FormColorPickerBase = createPeauiReactComponent('FormColorPicker');\n` +
                `const FormColorPicker = FormColorPickerBase as unknown as (props: FormColorPickerProps & RefAttributes<HTMLInputElement>) => ReactElement | null;\n\n` +
                `export default FormColorPicker;\n`
              : publicName === 'FormPinInput'
                ? `import type { FocusEvent, ReactElement, ReactNode, RefAttributes } from 'react';\n\n` +
                  `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                  `import type { PeauiReactProps } from '@/react/generated-react-props';\n` +
                  `import type { FormPinInputInvalidDetail, FormPinInputTransform } from './pin-input.shared';\n\n` +
                  `type GeneratedFormPinInputProps = PeauiReactProps<'FormPinInput'>;\n\n` +
                  `export type FormPinInputProps = Omit<GeneratedFormPinInputProps, 'defaultValue' | 'description' | 'error' | 'onBlur' | 'onChange' | 'onComplete' | 'onFocus' | 'onInvalidInput' | 'onValueChange' | 'transform' | 'value'> & {\n` +
                  `  value?: string;\n  defaultValue?: string;\n  description?: ReactNode;\n  error?: ReactNode;\n  transform?: FormPinInputTransform;\n` +
                  `  onValueChange?: (value: string) => void;\n  onChange?: (value: string, event: Event) => void;\n  onComplete?: (value: string, event: Event) => void;\n` +
                  `  onInvalidInput?: (detail: FormPinInputInvalidDetail, event: Event) => void;\n  onFocus?: (event: FocusEvent<HTMLInputElement>, index: number) => void;\n  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;\n` +
                  `  renderSeparator?: (state: { index: number }) => ReactNode;\n  labelContent?: ReactNode;\n  hintContent?: ReactNode;\n  descriptionContent?: ReactNode;\n  errorContent?: ReactNode;\n};\n\n` +
                  `export type { FormPinInputApplication, FormPinInputInputMode, FormPinInputInvalidDetail, FormPinInputInvalidReason, FormPinInputOptions, FormPinInputSize, FormPinInputTransform, FormPinInputTransformMode, FormPinInputType } from './pin-input.shared';\n\n` +
                  `const FormPinInputBase = createPeauiReactComponent('FormPinInput');\n` +
                  `const FormPinInput = FormPinInputBase as unknown as (props: FormPinInputProps & RefAttributes<HTMLInputElement>) => ReactElement | null;\n\n` +
                  `export default FormPinInput;\n`
                : publicName === 'FormDateTimePicker'
                  ? `import type { ReactElement, ReactNode, RefAttributes } from 'react';\n\n` +
                    `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                    `import type { PeauiReactProps } from '@/react/generated-react-props';\n` +
                    `import type { FormDateTimePickerInvalidDetail, LocalDateTimeValue } from './date-time-picker.shared';\n\n` +
                    `type GeneratedFormDateTimePickerProps = PeauiReactProps<'FormDateTimePicker'>;\n\n` +
                    `export type FormDateTimePickerProps = Omit<GeneratedFormDateTimePickerProps, 'defaultValue' | 'description' | 'error' | 'isDateTimeDisabled' | 'max' | 'min' | 'onApply' | 'onChange' | 'onInvalid' | 'onValueChange' | 'value'> & {\n` +
                    `  value?: LocalDateTimeValue;\n  defaultValue?: LocalDateTimeValue;\n  min?: LocalDateTimeValue;\n  max?: LocalDateTimeValue;\n` +
                    `  description?: ReactNode;\n  error?: ReactNode;\n  isDateTimeDisabled?: (value: LocalDateTimeValue) => boolean;\n` +
                    `  onValueChange?: (value: LocalDateTimeValue | undefined) => void;\n  onChange?: (value: LocalDateTimeValue | undefined) => void;\n` +
                    `  onApply?: (value: LocalDateTimeValue) => void;\n  onInvalid?: (detail: FormDateTimePickerInvalidDetail) => void;\n` +
                    `  renderTrigger?: (state: { displayValue: string; open: boolean; toggle: () => void }) => ReactNode;\n` +
                    `  renderDate?: (state: { date: string | undefined }) => ReactNode;\n  renderTime?: (state: { time: string | undefined }) => ReactNode;\n` +
                    `  renderTimeZone?: (state: { timeZone: string }) => ReactNode;\n  footerContent?: ReactNode;\n  descriptionContent?: ReactNode;\n  errorContent?: ReactNode;\n};\n\n` +
                    `export type { FormDateTimePickerDateFormat, FormDateTimePickerInvalidDetail, FormDateTimePickerInvalidReason, FormDateTimePickerLayout, FormDateTimePickerPlacement, FormDateTimePickerSection, FormDateTimePickerVariant, LocalDateTimeValue } from './date-time-picker.shared';\n\n` +
                    `const FormDateTimePickerBase = createPeauiReactComponent('FormDateTimePicker');\n` +
                    `const FormDateTimePicker = FormDateTimePickerBase as unknown as (props: FormDateTimePickerProps & RefAttributes<HTMLElement>) => ReactElement | null;\n\n` +
                    `export default FormDateTimePicker;\n`
                  : publicName === 'ToggleButton'
                    ? `import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';\n\n` +
                      `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                      `import type { PeauiReactProps } from '@/react/generated-react-props';\n\n` +
                      `export type ToggleButtonProps = PeauiReactProps<'ToggleButton'>;\n\n` +
                      `const ToggleButton = createPeauiReactComponent('ToggleButton') as unknown as ForwardRefExoticComponent<\n` +
                      `  PropsWithoutRef<ToggleButtonProps> & RefAttributes<HTMLButtonElement>\n` +
                      `>;\n\n` +
                      `export default ToggleButton;\n`
                    : publicName === 'ToggleGroup'
                      ? `import type { MouseEvent, ReactElement, RefAttributes } from 'react';\n\n` +
                        `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                        `import type { PeauiReactProps, PeauiToggleGroupItem, PeauiToggleGroupValue } from '@/react/generated-react-props';\n\n` +
                        `type GeneratedToggleGroupProps = PeauiReactProps<'ToggleGroup'>;\n` +
                        `type ToggleGroupCommonProps = Omit<GeneratedToggleGroupProps, 'defaultValue' | 'onChange' | 'onValueChange' | 'type' | 'value'> & {\n` +
                        `  onChange?: (value: PeauiToggleGroupValue | PeauiToggleGroupValue[] | null, item: PeauiToggleGroupItem, event: MouseEvent<HTMLButtonElement>) => void;\n` +
                        `};\n` +
                        `type ToggleGroupSingleProps = { type?: 'single'; value?: PeauiToggleGroupValue | null; defaultValue?: PeauiToggleGroupValue | null; onValueChange?: (value: PeauiToggleGroupValue | null) => void };\n` +
                        `type ToggleGroupMultipleProps = { type: 'multiple'; value?: PeauiToggleGroupValue[]; defaultValue?: PeauiToggleGroupValue[]; onValueChange?: (value: PeauiToggleGroupValue[]) => void };\n\n` +
                        `export type ToggleGroupProps = ToggleGroupCommonProps & (ToggleGroupSingleProps | ToggleGroupMultipleProps);\n` +
                        `export type ToggleGroupItem = PeauiToggleGroupItem;\n` +
                        `export type ToggleGroupValue = PeauiToggleGroupValue;\n\n` +
                        `const ToggleGroupBase = createPeauiReactComponent('ToggleGroup');\n` +
                        `const ToggleGroup = ToggleGroupBase as unknown as (props: ToggleGroupProps & RefAttributes<HTMLDivElement>) => ReactElement | null;\n\n` +
                        `export default ToggleGroup;\n`
                      : publicName === 'SegmentedControl'
                        ? `import type { KeyboardEvent, MouseEvent, ReactElement, RefAttributes } from 'react';\n\n` +
                          `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                          `import type { PeauiReactProps, PeauiSegmentedControlItem, PeauiSegmentedControlValue } from '@/react/generated-react-props';\n\n` +
                          `type GeneratedSegmentedControlProps = PeauiReactProps<'SegmentedControl'>;\n` +
                          `export type SegmentedControlProps = Omit<GeneratedSegmentedControlProps, 'defaultValue' | 'onChange' | 'onValueChange' | 'value'> & {\n` +
                          `  value?: PeauiSegmentedControlValue | null;\n` +
                          `  defaultValue?: PeauiSegmentedControlValue | null;\n` +
                          `  onValueChange?: (value: PeauiSegmentedControlValue) => void;\n` +
                          `  onChange?: (value: PeauiSegmentedControlValue, item: PeauiSegmentedControlItem, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;\n` +
                          `};\n` +
                          `export type SegmentedControlItem = PeauiSegmentedControlItem;\n` +
                          `export type SegmentedControlValue = PeauiSegmentedControlValue;\n\n` +
                          `const SegmentedControlBase = createPeauiReactComponent('SegmentedControl');\n` +
                          `const SegmentedControl = SegmentedControlBase as unknown as (props: SegmentedControlProps & RefAttributes<HTMLDivElement>) => ReactElement | null;\n\n` +
                          `export default SegmentedControl;\n`
                        : publicName === 'SplitButton'
                          ? `import type { MouseEvent, ReactElement, RefAttributes } from 'react';\n\n` +
                            `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                            `import type { PeauiDropdownMenuItem, PeauiReactProps } from '@/react/generated-react-props';\n\n` +
                            `type GeneratedSplitButtonProps = PeauiReactProps<'SplitButton'>;\n\n` +
                            `export type SplitButtonProps = Omit<GeneratedSplitButtonProps, 'onPrimaryClick' | 'onSelect'> & {\n` +
                            `  onPrimaryClick?: (event: MouseEvent<HTMLButtonElement>) => void;\n` +
                            `  onSelect?: (item: PeauiDropdownMenuItem, path: number[]) => void;\n` +
                            `};\n` +
                            `export type SplitButtonItem = PeauiDropdownMenuItem;\n\n` +
                            `const SplitButtonBase = createPeauiReactComponent('SplitButton');\n` +
                            `const SplitButton = SplitButtonBase as unknown as (props: SplitButtonProps & RefAttributes<HTMLDivElement>) => ReactElement | null;\n\n` +
                            `export default SplitButton;\n`
                          : publicName === 'TransferList'
                            ? `import type { ReactElement, ReactNode, RefAttributes } from 'react';\n\n` +
                              `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                              `import type { PeauiReactProps } from '@/react/generated-react-props';\n` +
                              `import type { TransferListItem, TransferListKey, TransferListKeyResolver, TransferListLabelResolver, TransferListLabels, TransferListLoadingState, TransferListMoveDetail, TransferListOrientation, TransferListPanel, TransferListSearchDetail, TransferListSelectionDetail, TransferListSize, TransferListSort } from './transfer-list.shared';\n\n` +
                              `type GeneratedTransferListProps = PeauiReactProps<'TransferList'>;\n` +
                              `export type TransferListProps = Omit<GeneratedTransferListProps, 'controls' | 'defaultSourceSelected' | 'defaultTargetSelected' | 'defaultValue' | 'disabledKeys' | 'item' | 'itemKey' | 'itemLabel' | 'items' | 'labels' | 'loading' | 'onMove' | 'onSearch' | 'onSelectionChange' | 'onSourceSelectedChange' | 'onTargetSelectedChange' | 'onValueChange' | 'orientation' | 'size' | 'sort' | 'sourceEmpty' | 'sourceHeader' | 'sourceSelected' | 'targetEmpty' | 'targetHeader' | 'targetSelected' | 'value'> & {\n` +
                              `  items?: readonly TransferListItem[]; itemKey?: TransferListKeyResolver; itemLabel?: TransferListLabelResolver; sort?: TransferListSort; preserveOrder?: boolean; disabledKeys?: readonly TransferListKey[]; loading?: boolean | TransferListLoadingState; labels?: Partial<TransferListLabels>; orientation?: TransferListOrientation; size?: TransferListSize;\n` +
                              `  value?: TransferListKey[]; defaultValue?: TransferListKey[]; onValueChange?: (value: TransferListKey[]) => void;\n` +
                              `  sourceSelected?: TransferListKey[]; defaultSourceSelected?: TransferListKey[]; onSourceSelectedChange?: (value: TransferListKey[]) => void;\n` +
                              `  targetSelected?: TransferListKey[]; defaultTargetSelected?: TransferListKey[]; onTargetSelectedChange?: (value: TransferListKey[]) => void;\n` +
                              `  onMove?: (detail: TransferListMoveDetail) => void; onSearch?: (detail: TransferListSearchDetail) => void; onSelectionChange?: (detail: TransferListSelectionDetail) => void;\n` +
                              `  renderSourceHeader?: (state: { count: number; selectedCount: number }) => ReactNode; renderTargetHeader?: (state: { count: number; selectedCount: number }) => ReactNode;\n` +
                              `  renderItem?: (state: { item: TransferListItem; itemKey: TransferListKey; label: string; description?: string; panel: TransferListPanel; selected: boolean; disabled: boolean }) => ReactNode;\n` +
                              `  renderSourceEmpty?: (state: { query: string }) => ReactNode; renderTargetEmpty?: (state: { query: string }) => ReactNode; renderLoading?: (state: { panel: TransferListPanel }) => ReactNode;\n` +
                              `  renderControls?: (actions: { moveSelectedToTarget: () => void; moveSelectedToSource: () => void; moveAllToTarget: () => void; moveAllToSource: () => void }) => ReactNode;\n` +
                              `};\n\n` +
                              `export type { TransferListDirection, TransferListItem, TransferListKey, TransferListKeyResolver, TransferListLabelResolver, TransferListLabels, TransferListLoadingState, TransferListMoveDetail, TransferListOrientation, TransferListPanel, TransferListSearchDetail, TransferListSelectionDetail, TransferListSize, TransferListSort } from './transfer-list.shared';\n\n` +
                              `const TransferListBase = createPeauiReactComponent('TransferList');\n` +
                              `const TransferList = TransferListBase as unknown as (props: TransferListProps & RefAttributes<HTMLDivElement>) => ReactElement | null;\n\n` +
                              `export default TransferList;\n`
                            : `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';\n` +
                              `import type { PeauiReactProps } from '@/react/generated-react-props';\n\n` +
                              `export type ${publicName}Props = PeauiReactProps<'${publicName}'>;\n\n` +
                              `const ${publicName} = createPeauiReactComponent('${publicName}');\n\n` +
                              `export default ${publicName};\n`;
    const centralRendererByName = {
      ImageView: ['ImageViewRenderer', 'image-view'],
      SvgIcon: ['BasicRenderer', 'basic'],
      Avatar: ['AvatarRenderer', 'avatar'],
      AvatarGroup: ['AvatarGroupRenderer', 'avatar-group'],
      CalculationResults: ['CalculationResultsLeafRenderer', 'display'],
      CardCarousel: ['CardCarouselLeafRenderer', 'display'],
      CounterBadge: ['CounterBadgeLeafRenderer', 'display'],
      DescriptionField: ['DescriptionFieldLeafRenderer', 'display'],
      DisclosurePanel: ['DisclosurePanelLeafRenderer', 'display'],
      KeyboardKey: ['DisplayRenderer', 'display'],
      SectionHeading: ['SectionHeadingLeafRenderer', 'display'],
      TableList: ['TableRenderer', 'table'],
      TableListFooter: ['TableListFooterLeafRenderer', 'table'],
      TableListHeader: ['TableListHeaderLeafRenderer', 'table'],
      TagChip: ['TagChipLeafRenderer', 'display'],
      TreeList: ['TreeListLeafRenderer', 'display'],
      ButtonAction: ['ButtonActionRenderer', 'button-action'],
      ButtonExport: ['ButtonExportLeafRenderer', 'button'],
      SelectableCard: ['SelectableCardLeafRenderer', 'button'],
      InputSlider: ['InputSliderLeafRenderer', 'text-input'],
      SearchInput: ['SearchInputLeafRenderer', 'text-input'],
      EmptyState: ['EmptyStateLeafRenderer', 'feedback'],
      MessageText: ['MessageTextLeafRenderer', 'feedback'],
      ProgressIndicator: ['ProgressIndicatorLeafRenderer', 'feedback'],
      SkeletonLoading: ['SkeletonLoadingLeafRenderer', 'feedback'],
      SpinnerLoader: ['SpinnerLoaderLeafRenderer', 'feedback'],
      ToastAlert: ['ToastAlertLeafRenderer', 'feedback'],
      FormFieldLabel: ['FormFieldLabelLeafRenderer', 'form'],
      FormButtonCheckbox: ['ChoiceControlsRenderer', 'choice-controls'],
      FormButtonGroup: ['ButtonGroupRenderer', 'button-group'],
      FormCheckbox: ['ChoiceControlsRenderer', 'choice-controls'],
      FormContainer: ['FormContainerLeafRenderer', 'form-container'],
      FormDatePicker: ['DateRenderer', 'date'],
      FormField: ['FormFieldLeafRenderer', 'form'],
      FormFileUpload: ['FileRenderer', 'file'],
      FormFileUploadSimple: ['FileRenderer', 'file'],
      FormInput: ['TextFieldLeafRenderer', 'text-input'],
      FormMultiSelect: ['SelectRenderer', 'select'],
      FormNumber: ['TextFieldLeafRenderer', 'text-input'],
      FormPassword: ['FormPasswordLeafRenderer', 'text-input'],
      FormRadio: ['ChoiceControlsRenderer', 'choice-controls'],
      FormSelect: ['SelectRenderer', 'select'],
      FormTextarea: ['FormTextareaRenderer', 'form-textarea'],
      FormYearPicker: ['DateRenderer', 'date'],
      FormSwitchToggle: ['FormSwitchToggleRenderer', 'form-switch-toggle'],
      CardPanel: ['CardPanelLeafRenderer', 'layout'],
      FullscreenContainer: ['FullscreenContainerLeafRenderer', 'layout'],
      GridItem: ['GridItemLeafRenderer', 'layout'],
      GridSection: ['GridSectionLeafRenderer', 'layout'],
      PageLayout: ['PageLayoutLeafRenderer', 'layout'],
      SectionDivider: ['SectionDividerLeafRenderer', 'layout'],
      Breadcrumbs: ['BreadcrumbsLeafRenderer', 'navigation'],
      ListLimitControl: ['ListLimitControlRenderer', 'list-limit-control'],
      NavigationCard: ['NavigationCardLeafRenderer', 'navigation'],
      NavigationDisclosureCard: ['NavigationDisclosureCardRenderer', 'navigation-disclosure-card'],
      NavigationIconCard: ['NavigationIconCardLeafRenderer', 'navigation'],
      NavigationLink: ['NavigationLinkLeafRenderer', 'navigation'],
      NavigationStepper: ['NavigationStepperLeafRenderer', 'navigation'],
      NavigationTabs: ['NavigationTabsLeafRenderer', 'navigation'],
      PaginationControl: ['PaginationControlLeafRenderer', 'navigation'],
      DrawerPanel: ['DialogLeafRenderer', 'dialog-leaf'],
      InfoTooltip: ['InfoTooltipRenderer', 'info-tooltip'],
      ModalDialog: ['DialogLeafRenderer', 'dialog-leaf'],
      PopoverButton: ['PopoverLeafRenderer', 'popover-leaf'],
      PopoverOverlayer: ['PopoverLeafRenderer', 'popover-leaf'],
      ContextMenu: ['ContextMenuRenderer', 'context-menu'],
      DropdownMenu: ['DropdownMenuRenderer', 'dropdown-menu'],
      MenuBar: ['MenuBarRenderer', 'menu-bar'],
      ToggleButton: ['ToggleButtonRenderer', 'toggle-button'],
      ToggleGroup: ['ToggleGroupRenderer', 'toggle-group'],
      SegmentedControl: ['SegmentedControlRenderer', 'segmented-control'],
      SplitButton: ['SplitButtonRenderer', 'split-button'],
    };
    const specializedRendererByName = {
      FormColorPicker: ['FormColorPickerRenderer', '@/react/form-color-picker.renderer'],
      FormDateTimePicker: ['FormDateTimePickerRenderer', '@/react/form-date-time-picker.renderer'],
      FormPinInput: ['FormPinInputRenderer', '@/react/form-pin-input.renderer'],
      FormTimePicker: ['FormTimePickerRenderer', '@/react/form-time-picker.renderer'],
      TransferList: ['TransferListRenderer', '@/react/transfer-list.renderer'],
    };
    const centralRenderer = centralRendererByName[publicName];
    const specializedRenderer = specializedRendererByName[publicName];
    const directRenderer = centralRenderer ?? specializedRenderer;
    const optimizedComponentSource = directRenderer
      ? componentSource
          .replace(
            `import { createPeauiReactComponent } from '@/react/create-peaui-react-component';`,
            `import { createDirectReactComponent } from '@/react/create-direct-react-component';\nimport { ${directRenderer[0]} } from '${
              centralRenderer
                ? `@/react/renderer-entries/${centralRenderer[1]}.renderer-entry`
                : specializedRenderer[1]
            }';`,
          )
          .replace(
            `createPeauiReactComponent('${publicName}')`,
            `createDirectReactComponent('${publicName}', ${directRenderer[0]})`,
          )
      : componentSource;
    const storySource =
      `import type { Meta, StoryObj } from '@storybook/react';\n\n` +
      `import { getReactStoryArgs } from '@/react/story-args';\n` +
      `import ${publicName} from './index';\n\n` +
      `const meta = {\n` +
      `  title: 'React/${api.category}/${publicName}',\n` +
      `  component: ${publicName},\n` +
      `  args: getReactStoryArgs('${publicName}'),\n` +
      `  parameters: { layout: 'padded' },\n` +
      `} satisfies Meta<typeof ${publicName}>;\n\n` +
      `export default meta;\n` +
      `type Story = StoryObj<typeof meta>;\n\n` +
      `export const Default: Story = {};\n` +
      (api.props.some((prop) => prop.name === 'disabled')
        ? `\nexport const Disabled: Story = { args: { disabled: true${
            publicName === 'Avatar' ? ', interactive: true' : ''
          } } };\n`
        : '');

    // FormTagsInput owns a hand-written generic public contract shared with its native renderer.
    if (
      ![
        'FormTagsInput',
        'FormDateRangePicker',
        'FormRatingInput',
        'ScrollArea',
        'VirtualList',
        'InlineEdit',
        'CopyButton',
        'KeyboardKey',
        'CommandPalette',
        'GuidedTour',
        'NotificationCenter',
      ].includes(api.name)
    ) {
      writeGeneratedFile(
        path.join(directory, 'index.tsx'),
        optimizedComponentSource +
          (publicName === 'TableList'
            ? "\nexport type * from './table.types';\n"
            : publicName === 'FormFileUpload'
              ? "\nexport type { FormFileUploadValue, FileUploadValueMode } from './file-upload.shared';\n"
              : ''),
        'utf8',
      );
    }
    // Stories belong to their authors after the initial scaffold is created.
    // Regeneration must never remove interactions, edge cases or accessibility examples.
    const storyFile = path.join(directory, 'index.react.stories.tsx');
    if (!fs.existsSync(storyFile)) writeGeneratedFile(storyFile, storySource);
  }
}

const components = readComponentApi();
const metadataOnly = process.argv.includes('--metadata-only');

writePropsFile(components);
writeCatalogFile(components);
writeIconData();
if (!metadataOnly) writeComponentFiles(components);

console.log(
  process.argv.includes('--check')
    ? `Sprawdzono pliki React: ${components.length}.`
    : metadataOnly
      ? `Wygenerowano metadane React: ${components.length}.`
      : `Wygenerowano natywne entry pointy React: ${components.length}.`,
);

const checkOnly = process.argv.includes('--check');
const changedFiles = [];
for (const [file, source] of generatedFiles) {
  const options = await resolveConfig(file);
  const formatted = await format(source, { ...options, filepath: file });
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === formatted) continue;
  changedFiles.push(path.relative(libraryRoot, file));
  if (!checkOnly) fs.writeFileSync(file, formatted, 'utf8');
}
if (checkOnly && changedFiles.length > 0) {
  console.error(`Generated React files are outdated:\n${changedFiles.join('\n')}`);
  process.exitCode = 1;
}
