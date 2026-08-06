import { locale } from '../i18n';
import type { ApiEntry, ComponentCopy, FrameworkId, NamedApiEntry } from '../types';
import type { IconCategoryId, IconDefinition } from './icons';

const categoryEnglish: Record<string, string> = {
  basic: 'Basic',
  'data-display': 'Data display',
  'data-entry': 'Data entry',
  feedback: 'Feedback',
  form: 'Forms',
  layout: 'Layout',
  navigation: 'Navigation',
  overlayer: 'Overlays and dialogs',
};

const enCopy = (description: string, purpose: string[], input: string): ComponentCopy => ({
  description,
  purpose,
  input,
});

export const componentCopyEnglish: Record<string, ComponentCopy> = {
  ImageView: enCopy(
    'A responsive image container with size, maximum-width and accessible alternative-text handling.',
    ['Presents images in consistent sizes.', 'Provides a safe alternative-text fallback.'],
    'An image URL, alternative text and an optional size variant.',
  ),
  PhotoEditor: enCopy(
    'An image editor for selecting, cropping and preparing a picture before saving it.',
    [
      'Guides users through basic image editing.',
      'Returns the prepared image through the image model.',
    ],
    'An image object passed through the image model; the editor can also start empty.',
  ),
  SvgIcon: enCopy(
    'A lightweight renderer for SVG icons included with PEAUI.',
    ['Loads an icon by name.', 'Keeps decorative graphics hidden from screen readers.'],
    'An icon filename without its extension, for example check, edit or search.',
  ),
  CalculationResults: enCopy(
    'A calculation result panel with an optional recalculate action.',
    ['Highlights a result and its label.', 'Supports loading, disabled and simplified states.'],
    'A label and result text, with optional state and button-visibility flags.',
  ),
  CardCarousel: enCopy(
    'A card carousel with navigation, pagination indicators and optional automatic movement.',
    [
      'Organizes a larger card set in limited space.',
      'Adapts the visible slide count to the viewport.',
    ],
    'Cards in the default content area plus navigation, animation and visible-slide settings.',
  ),
  CounterBadge: enCopy(
    'A compact counter for item totals, notifications or active filters.',
    ['Displays a short numeric value.', 'Offers color and size variants.'],
    'A number plus optional variant and size properties.',
  ),
  DescriptionField: enCopy(
    'A description field combining a fixed label with arbitrary content.',
    ['Creates a readable label–value pair.', 'Fits summaries and read-only views.'],
    'A label and content passed through the default content area.',
  ),
  DisclosurePanel: enCopy(
    'An expandable panel that reveals or hides additional content.',
    ['Saves space for detailed information.', 'Exposes a controlled open state.'],
    'A title, panel content and open state; it may also be disabled or permanently open.',
  ),
  SectionHeading: enCopy(
    'A section heading with independent visual size, HTML element and color variant controls.',
    ['Builds a clear content hierarchy.', 'Separates HTML semantics from visual size.'],
    'Heading content plus size, element and variant properties.',
  ),
  TableList: enCopy(
    'An advanced data table with sorting, row selection, editing and column management.',
    [
      'Presents records through declarative columns.',
      'Handles empty, loading and record-action states.',
      'Provides keyboard support and consistent selection, editing and row double-click events.',
    ],
    'A records array and column definitions, with optional sorting, selection, editing and pagination settings.',
  ),
  TableListFooter: enCopy(
    'A table footer showing record range and page information.',
    ['Summarizes visible data.', 'Supports standard and flexible layouts.'],
    'Record count, page size, current page and total record count.',
  ),
  TableListHeader: enCopy(
    'A table toolbar with search, filters, export and record creation actions.',
    ['Groups the main actions above a table.', 'Shows active-filter and selected-record counts.'],
    'Action flags, counters and an optional controlled filter-panel state.',
  ),
  TagChip: enCopy(
    'A short status or category label rendered as text or a button.',
    ['Highlights metadata and states.', 'Provides color, size and active variants.'],
    'Label text plus optional variant, size, active and element properties.',
  ),
  TreeList: enCopy(
    'An interactive tree list for editing nested data.',
    ['Shows parent–child relationships.', 'Allows tree items to be updated and removed.'],
    'A controlled tree object plus level and allowed-action settings.',
  ),
  ButtonAction: enCopy(
    'The primary PEAUI action button.',
    ['Triggers user actions.', 'Supports visual variants, sizes and the disabled state.'],
    'Button content plus optional size, variant, type and accessible label.',
  ),
  ButtonExport: enCopy(
    'An export button with a menu for selecting the data range.',
    ['Exports all or selected records.', 'Communicates the selected-record count.'],
    'Button content, selection count, size, variant and menu-placement settings.',
  ),
  InputSlider: enCopy(
    'A slider for selecting a numeric value.',
    ['Provides quick numeric control.', 'Synchronizes its controlled value.'],
    'A field name, numeric value, optional accessible label and disabled state.',
  ),
  SearchInput: enCopy(
    'A search field with debounced updates and a clear action.',
    ['Collects a search phrase.', 'Limits update frequency with debounce.'],
    'A controlled search phrase, placeholder and optional debounce delay.',
  ),
  SelectableCard: enCopy(
    'A clickable selection card with active, disabled and read-only states.',
    ['Lets users select rich options.', 'Communicates selection visually and semantically.'],
    'Card content plus active, disabled and read-only flags.',
  ),
  EmptyState: enCopy(
    'An empty-state view with a title, description and action area.',
    ['Explains why data is missing.', 'Can direct the user to the next step.'],
    'A title, description and optional body and action content.',
  ),
  MessageText: enCopy(
    'A semantic message for information, success, warning or error feedback.',
    ['Keeps messages visually consistent.', 'Can automatically add a variant-matched icon.'],
    'An identifier, message content, variant, size and icon settings.',
  ),
  ProgressIndicator: enCopy(
    'A circular progress indicator divided into steps.',
    ['Shows a position within a process.', 'Supports custom size and stroke width.'],
    'The total and active step plus optional dimensions.',
  ),
  SkeletonLoading: enCopy(
    'An animated placeholder displayed while content is loading.',
    ['Reduces visual layout shifts.', 'Communicates that data is being prepared.'],
    'Size, rounding and an accessible loading label.',
  ),
  SpinnerLoader: enCopy(
    'A compact animated indicator for an operation in progress.',
    ['Shows that the interface is working.', 'Fits buttons, panels and forms.'],
    'No data is required; an optional test identifier is supported.',
  ),
  ToastAlert: enCopy(
    'A toast notification with a title, description and optional close action.',
    [
      'Reports an operation result without blocking the view.',
      'Distinguishes semantic message variants.',
    ],
    'A title, description, variant and optional size, border, shadow and close settings.',
  ),
  FieldLabel: enCopy(
    'An accessible form label with required and read-only indicators.',
    ['Connects label text to a control.', 'Communicates whether the field is required.'],
    'A target control ID, label text and optional required and read-only flags.',
  ),
  FormButtonCheckbox: enCopy(
    'A checkbox presented as a prominent selection button.',
    ['Toggles a single option.', 'Synchronizes its controlled boolean value.'],
    'ID, name, boolean value, content, size and form-state settings.',
  ),
  FormButtonGroup: enCopy(
    'A group of buttons used to select one of the available options.',
    ['Presents a small option set side by side.', 'Works as a single-choice group or toggle.'],
    'An options list, field identifiers and a controlled value.',
  ),
  FormCheckbox: enCopy(
    'A standard checkbox with validation and form-state support.',
    ['Collects a yes/no answer.', 'Synchronizes its controlled boolean value.'],
    'ID, name, boolean value and label content.',
  ),
  FormContainer: enCopy(
    'A form container with a heading, loading state and action set.',
    ['Organizes fields into a complete form.', 'Handles submit, cancel and action placement.'],
    'A form label and fields plus optional action labels and visibility settings.',
  ),
  FormDatePicker: enCopy(
    'A date or date-range field with a calendar.',
    [
      'Selects dates without manual formatting.',
      'Restricts selection with minimum and maximum dates.',
    ],
    'ID, name, controlled value, range mode, limits, label and field states.',
  ),
  FormField: enCopy(
    'The low-level wrapper shared by PEAUI form controls.',
    [
      'Combines a label, control, hint and validation.',
      'Provides consistent disabled, read-only and required states.',
    ],
    'ID, name, custom control content and optional labels, icons and messages.',
  ),
  FormFileUpload: enCopy(
    'A single-file upload field with type and size validation.',
    ['Selects or removes an attachment.', 'Returns the selected file through its model.'],
    'A controlled file, accepted types, size limit and presentation variant.',
  ),
  FormFileUploadSimple: enCopy(
    'A simplified uploader for one or multiple files.',
    ['Supports multiple attachments.', 'Validates type, size and maximum file count.'],
    'A controlled File array plus accepted types, size and count limits.',
  ),
  FormInput: enCopy(
    'A single-line text input inside the complete PEAUI form-field wrapper.',
    ['Collects short text data.', 'Supports a label, icons, clearing and validation messages.'],
    'ID, name, controlled text, label, placeholder and field states.',
  ),
  FormMultiSelect: enCopy(
    'A multiple-choice field with search and select-all behavior.',
    ['Collects multiple values in one field.', 'Filters long option lists.'],
    'An options list, controlled value array and standard field data.',
  ),
  FormNumber: enCopy(
    'A numeric field with range, step and optional slider controls.',
    ['Collects numeric values.', 'Enforces minimum, maximum and step constraints.'],
    'ID, name, controlled number, range, step, label and field states.',
  ),
  FormPassword: enCopy(
    'A password field with reveal, copy and strength-meter options.',
    ['Collects a password safely.', 'Helps users assess and manage the entered value.'],
    'ID, name, controlled password, action labels and strength-meter settings.',
  ),
  FormRadio: enCopy(
    'A radio button intended for use in an option group.',
    ['Selects one value from a group.', 'Supports validation and the disabled state.'],
    'ID, group name, option value and controlled current value.',
  ),
  FormSelect: enCopy(
    'A single-choice select field with optional search.',
    [
      'Selects one option.',
      'Supports searchable lists, custom entries and viewport-safe placement.',
    ],
    'An options list, ID, name and controlled selected value.',
  ),
  FormTextarea: enCopy(
    'A multiline text field with a label and character count.',
    ['Collects longer text.', 'Supports character limits and validation messages.'],
    'ID, name, controlled text, row count, limit and field states.',
  ),
  FormYearPicker: enCopy(
    'A field for selecting a year or year range.',
    ['Selects a year without a full calendar.', 'Restricts values with minimum and maximum years.'],
    'ID, name, controlled value, range mode, year limits and field states.',
  ),
  CardPanel: enCopy(
    'A general-purpose card panel for grouping related content.',
    ['Creates visual interface sections.', 'Offers background, border, size and shadow variants.'],
    'Panel content plus optional appearance and HTML-element settings.',
  ),
  FullscreenContainer: enCopy(
    'A container that can expand its content into fullscreen mode.',
    ['Increases the workspace for complex views.', 'Provides enter and exit fullscreen actions.'],
    'Content, an accessible label and optional button labels.',
  ),
  GridItem: enCopy(
    'A grid item controlling its width and optional nested grid.',
    ['Places one content fragment in a grid.', 'Controls the number of occupied columns.'],
    'Content plus colspan, column, gap and nested-grid settings.',
  ),
  GridSection: enCopy(
    'A responsive section built with CSS Grid.',
    ['Arranges items into columns.', 'Keeps spacing between children consistent.'],
    'Child elements plus column-count and gap settings.',
  ),
  PageLayout: enCopy(
    'A page skeleton with areas for headers, content and supporting elements.',
    ['Standardizes application view layouts.', 'Can keep the header visible while scrolling.'],
    'Page sections plus an accessible label and sticky-header option.',
  ),
  SectionDivider: enCopy(
    'A horizontal or vertical content divider.',
    ['Separates logical element groups.', 'Offers multiple thickness or size variants.'],
    'Divider direction and size.',
  ),
  Breadcrumbs: enCopy(
    'Breadcrumb navigation showing the current page position in a hierarchy.',
    ['Explains the site structure.', 'Provides quick access to parent levels.'],
    'An item array with labels and paths plus an optional separator.',
  ),
  ListLimitControl: enCopy(
    'A control for selecting the number of items displayed per page.',
    ['Changes a list page size.', 'Synchronizes the limit and keeps its list in the viewport.'],
    'ID, label, available limits and controlled current limit.',
  ),
  NavigationCard: enCopy(
    'A navigation card with a title, description and optional link.',
    [
      'Promotes an important destination or feature.',
      'Combines context with a large activation area.',
    ],
    'Title, description, path, size, variant and accessible label.',
  ),
  NavigationDisclosureCard: enCopy(
    'A navigation card with expandable content.',
    ['Combines navigation with additional explanation.', 'Can be open by default.'],
    'ID, title, description, optional path, open state and accessible label.',
  ),
  NavigationIconCard: enCopy(
    'A compact icon-based navigation card with short text.',
    ['Creates a visual shortcut to a feature.', 'Provides a large, readable activation area.'],
    'Icon name, text, path and optional accessible label.',
  ),
  NavigationLink: enCopy(
    'A consistent PEAUI navigation link with size and color variants.',
    ['Navigates to a target path.', 'Styles text or custom content consistently.'],
    'A path, link content, accessible label, size and variant.',
  ),
  NavigationStepper: enCopy(
    'Horizontal process-step navigation with statuses and keyboard support.',
    [
      'Shows progress through a multi-step process.',
      'Allows navigation to completed or active steps.',
    ],
    'An options array describing step numbers, labels and statuses.',
  ),
  NavigationTabs: enCopy(
    'A tab bar for switching between related views.',
    ['Organizes content into parallel sections.', 'Emits the selected active tab.'],
    'A tabs array and an accessible label for the navigation.',
  ),
  PaginationControl: enCopy(
    'Pagination for choosing the previous, next or a specific page.',
    ['Splits long lists into pages.', 'Synchronizes the active page.'],
    'Total page count, accessible label and controlled current page.',
  ),
  DrawerPanel: enCopy(
    'A side panel displayed above the current content.',
    [
      'Shows a form or details without leaving the page.',
      'Controls visibility through its open model.',
    ],
    'Open state, accessible label and header/body content.',
  ),
  InfoTooltip: enCopy(
    'A tooltip containing short contextual information.',
    ['Explains an icon, label or concept.', 'Supports multiple placements and variants.'],
    'Trigger and tooltip content plus placement, variant and disabled state.',
  ),
  ModalDialog: enCopy(
    'A modal dialog built on the native dialog element.',
    [
      'Focuses attention on a short task or decision.',
      'Controls visibility through its open model.',
    ],
    'Open state, accessible label and header/body content.',
  ),
  PopoverButton: enCopy(
    'A button that opens an anchored menu or compact panel.',
    ['Combines a trigger and popover.', 'Supports placement and trigger-width matching.'],
    'Button and popover content plus appearance, placement and popup-type settings.',
  ),
  PopoverOverlayer: enCopy(
    'A low-level popover layer positioned relative to its trigger.',
    ['Builds menus, tips and small contextual panels.', 'Controls content position and width.'],
    'Trigger and popover content plus placement, popup type and optional classes.',
  ),
};

const propDescriptions: Record<string, string> = {
  active: 'Defines the active item or step.',
  after: 'Content displayed after the field value.',
  alt: 'Alternative image description used by assistive technologies.',
  ariaLabel: 'Accessible element name passed through aria-label.',
  before: 'Content displayed before the field value.',
  canCreate: 'Enables creating new records.',
  canErase: 'Shows an action that clears the current value.',
  canHideColumns: 'Allows users to control column visibility.',
  canSelectRows: 'Enables row selection.',
  columns: 'Column definitions describing labels, keys and rendering behavior.',
  dataTestId: 'Stable data-testid identifier for automated tests.',
  description: 'Additional text explaining the component content or state.',
  disabled: 'Disables the component and blocks interaction.',
  editable: 'Enables data editing mode.',
  error: 'An error message associated with the field or operation.',
  gap: 'Spacing between layout items.',
  icon: 'Name of the icon displayed by the component.',
  iconAfter: 'Name of the icon displayed after the field content.',
  iconBefore: 'Name of the icon displayed before the field content.',
  id: 'Unique identifier of the element in the document.',
  isLoading: 'Enables the loading state and announces an operation in progress.',
  label: 'Visible label describing an element or form field.',
  max: 'Maximum allowed value or width.',
  maxLength: 'Maximum number of characters that can be entered.',
  min: 'Minimum allowed value.',
  name: 'Field name used by a form or resource name.',
  open: 'Controls visibility of an expandable element or overlay.',
  options: 'Options available for display or selection.',
  page: 'Currently selected page number.',
  placeholder: 'Helper text shown before a value is entered.',
  readonly: 'Sets the component to read-only mode.',
  records: 'Record collection displayed by the component.',
  required: 'Marks the value as required.',
  rowsPerPage: 'Number of records displayed on one page.',
  selected: 'Defines the current selection.',
  selectedRows: 'Identifiers of the currently selected rows.',
  size: 'Component size variant.',
  src: 'Source URL of an image or another resource.',
  status: 'Visual and semantic component state.',
  step: 'Numeric value increment.',
  title: 'Main title displayed in the component.',
  total: 'Total number of items.',
  totalPages: 'Total number of pages available in pagination.',
  type: 'Functional or visual component variant.',
  value: 'Current controlled value.',
  variant: 'Visual component variant.',
};

const modelNames = new Set(['file', 'files', 'image', 'limit', 'open', 'page', 'tree', 'value']);

const defaultValuesEnglish: Record<string, string> = {
  'Edytor zdjęcia': 'Image editor',
  'Tabela danych': 'Data table',
  Dodaj: 'Add',
  'Czy na pewno chcesz usunąć wybrany rekord?':
    'Are you sure you want to delete the selected record?',
  'Usunięcie spowoduje trwałe usunięcie rekordu.':
    'This action will permanently delete the record.',
  'Dodaj rekord': 'Add record',
  'Pole wyszukiwania': 'Search field',
  'Wpisz czego szukasz': 'Enter a search phrase',
  'Trwa ladowanie tresci.': 'Content is loading.',
  Zapisz: 'Save',
  Anuluj: 'Cancel',
  'wybierz date': 'select a date',
  wpisz: 'enter a value',
  'wybierz/wyszukaj': 'select/search',
  'Pokaz haslo': 'Show password',
  'Ukryj haslo': 'Hide password',
  'Kopiuj haslo': 'Copy password',
  'Haslo skopiowano do schowka.': 'Password copied to the clipboard.',
  'Nie udalo sie skopiowac hasla.': 'The password could not be copied.',
  'wybierz rok': 'select a year',
  'Otwórz tryb pełnoekranowy': 'Open fullscreen mode',
  'Zamknij tryb pełnoekranowy': 'Close fullscreen mode',
  'Ścieżka nawigacji': 'Navigation path',
  'Nawigacja kroków': 'Step navigation',
};

function camelCase(value: string): string {
  return value.replace(/[-:]([a-z])/g, (_, character: string) => character.toUpperCase());
}

function humanize(value: string): string {
  return value
    .replace(/^on:/, '')
    .replace(/^on([A-Z])/, '$1')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_:]/g, ' ')
    .toLocaleLowerCase('en');
}

function englishInputDescription(entry: ApiEntry, framework: FrameworkId): string {
  const propertyName = camelCase(entry.name === 'data-testid' ? 'dataTestId' : entry.name);
  const base = modelNames.has(propertyName)
    ? `The controlled ${humanize(propertyName)} value.`
    : (propDescriptions[propertyName] ??
      `Configures the component's ${humanize(propertyName)} property.`);

  if (framework === 'web-components') {
    return `${base} Use the kebab-case HTML attribute; assign complex values as element properties.`;
  }
  if (framework === 'react' && modelNames.has(propertyName)) {
    const capitalized = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
    return `${base} React supports ${propertyName}, default${capitalized} and on${capitalized}Change.`;
  }
  return base;
}

function englishNamedDescription(
  entry: NamedApiEntry,
  kind: 'event' | 'slot',
  framework: FrameworkId,
): string {
  if (kind === 'slot') {
    if (entry.name === 'children') return 'Primary React content passed through children.';
    if (entry.name === 'default') return 'Primary content passed to the component.';
    if (entry.name === 'renderCell') return 'A render function for custom table-cell content.';
    return framework === 'react'
      ? `ReactNode content passed through the ${entry.name} prop.`
      : `Content placed in the named “${entry.name}” slot.`;
  }

  const eventName = humanize(entry.name);
  if (framework === 'react') return `Callback invoked when the component reports ${eventName}.`;
  if (framework === 'web-components') {
    return `Native CustomEvent emitted when the component reports ${eventName}; data is available in event.detail.`;
  }
  return `Emitted when the component reports ${eventName}.`;
}

export function getComponentCopy(name: string, polishCopy: ComponentCopy): ComponentCopy {
  return locale.value === 'en' ? (componentCopyEnglish[name] ?? polishCopy) : polishCopy;
}

export function getCategoryLabel(category: string, polishLabel: string): string {
  return locale.value === 'en' ? (categoryEnglish[category] ?? polishLabel) : polishLabel;
}

export function localizeApiEntries(
  entries: readonly ApiEntry[],
  kind: 'input',
  framework: FrameworkId,
): readonly ApiEntry[];
export function localizeApiEntries(
  entries: readonly NamedApiEntry[],
  kind: 'event' | 'slot',
  framework: FrameworkId,
): readonly NamedApiEntry[];
export function localizeApiEntries(
  entries: readonly (ApiEntry | NamedApiEntry)[],
  kind: 'input' | 'event' | 'slot',
  framework: FrameworkId,
): readonly (ApiEntry | NamedApiEntry)[] {
  if (locale.value === 'pl') return entries;
  return entries.map((entry) => ({
    ...entry,
    ...('default' in entry && entry.default !== undefined
      ? { default: defaultValuesEnglish[entry.default] ?? entry.default }
      : {}),
    description:
      kind === 'input'
        ? englishInputDescription(entry as ApiEntry, framework)
        : englishNamedDescription(entry, kind, framework),
  }));
}

const iconCategoryEnglish: Record<IconCategoryId, { description: string; label: string }> = {
  actions: { label: 'Actions', description: 'User operations and interface tools.' },
  navigation: {
    label: 'Navigation',
    description: 'Directions, view transitions and position controls.',
  },
  status: {
    label: 'Status and messages',
    description: 'Confirmations, help, hints and process states.',
  },
  files: {
    label: 'Files and media',
    description: 'Documents, images and file-related operations.',
  },
  security: { label: 'Security', description: 'Locks, access and security states.' },
  users: { label: 'Users', description: 'People, groups and audiences.' },
  interface: {
    label: 'Interface and objects',
    description: 'Application objects, modules and settings.',
  },
};

const iconEnglish: Record<string, { description: string; label: string; keywords: string[] }> = {
  arrow: {
    label: 'Arrow',
    description: 'A general direction or transition to another item.',
    keywords: ['direction', 'next', 'navigation'],
  },
  arrowRight: {
    label: 'Arrow right',
    description: 'Continue, open details or move to the next step.',
    keywords: ['right', 'next', 'continue'],
  },
  arrowRounded: {
    label: 'Rounded arrow',
    description: 'Direction shown with a rounded arrow.',
    keywords: ['direction', 'rounded', 'navigation'],
  },
  bag: {
    label: 'Bag',
    description: 'Products, orders, shopping or user resources.',
    keywords: ['shopping', 'order', 'product'],
  },
  calculator: {
    label: 'Calculator',
    description: 'Calculations and numeric tools.',
    keywords: ['calculation', 'numbers', 'math'],
  },
  calendar: {
    label: 'Calendar',
    description: 'Date selection, deadlines or schedules.',
    keywords: ['date', 'deadline', 'schedule'],
  },
  check: {
    label: 'Check',
    description: 'Acceptance, selection or a completed operation.',
    keywords: ['done', 'yes', 'accept'],
  },
  checkCircle: {
    label: 'Check circle',
    description: 'A positive state or completed operation.',
    keywords: ['success', 'done', 'confirmation'],
  },
  clock: {
    label: 'Clock',
    description: 'Time, waiting, history or a scheduled operation.',
    keywords: ['time', 'wait', 'history'],
  },
  close: {
    label: 'Close',
    description: 'Close a window, panel, message or view.',
    keywords: ['close', 'cancel', 'window'],
  },
  'code-branch': {
    label: 'Code branch',
    description: 'A process variant, branch or code version.',
    keywords: ['code', 'branch', 'version'],
  },
  cogs: {
    label: 'Settings',
    description: 'Configuration, automation or system settings.',
    keywords: ['cogs', 'configuration', 'system'],
  },
  compressArrows: {
    label: 'Compress view',
    description: 'Exit fullscreen or collapse a workspace.',
    keywords: ['compress', 'collapse', 'fullscreen'],
  },
  copy: {
    label: 'Copy',
    description: 'Copy content or a value to the clipboard.',
    keywords: ['copy', 'clipboard', 'duplicate'],
  },
  cross: {
    label: 'Cross',
    description: 'Cancel, clear a selection or indicate a negative state.',
    keywords: ['cancel', 'clear', 'negative'],
  },
  dark: {
    label: 'Dark theme',
    description: 'Switch to or represent a dark theme.',
    keywords: ['dark', 'theme', 'mode'],
  },
  dots: {
    label: 'More options',
    description: 'A contextual menu or additional hidden actions.',
    keywords: ['more', 'menu', 'options'],
  },
  doubleArrowRounded: {
    label: 'Double rounded arrow',
    description: 'Fast navigation, scrolling or multi-item movement.',
    keywords: ['fast', 'scroll', 'navigation'],
  },
  download: {
    label: 'Download',
    description: 'Download data or save a resource to the device.',
    keywords: ['download', 'save', 'resource'],
  },
  edit: {
    label: 'Edit',
    description: 'Change data or enter editing mode.',
    keywords: ['edit', 'change', 'data'],
  },
  edit2: {
    label: 'Edit — alternative',
    description: 'An alternative symbol for editing data or content.',
    keywords: ['edit', 'change', 'alternative'],
  },
  envelope: {
    label: 'Email',
    description: 'Mail, a message or an email address.',
    keywords: ['email', 'mail', 'message'],
  },
  expandArrows: {
    label: 'Expand view',
    description: 'Enter fullscreen or expand a workspace.',
    keywords: ['expand', 'fullscreen', 'workspace'],
  },
  eye: {
    label: 'Visibility',
    description: 'Preview, reveal content or control visibility.',
    keywords: ['view', 'show', 'visibility'],
  },
  file: {
    label: 'Document',
    description: 'A file, attachment or document.',
    keywords: ['file', 'attachment', 'document'],
  },
  fileDownload: {
    label: 'File download',
    description: 'Download a specific document or attachment.',
    keywords: ['download', 'file', 'attachment'],
  },
  'file-search': {
    label: 'File search',
    description: 'Search for a document or inspect its details.',
    keywords: ['search', 'file', 'details'],
  },
  filters: {
    label: 'Filters',
    description: 'Filter a list, results or a data set.',
    keywords: ['filter', 'list', 'results'],
  },
  font: {
    label: 'Typography',
    description: 'Text, font or formatting settings.',
    keywords: ['font', 'text', 'format'],
  },
  help: {
    label: 'Help',
    description: 'Contextual help, a question or additional explanation.',
    keywords: ['help', 'question', 'explanation'],
  },
  hint: {
    label: 'Hint',
    description: 'A suggestion or supplementary user information.',
    keywords: ['hint', 'tip', 'information'],
  },
  imageUpload: {
    label: 'Image upload',
    description: 'Add or upload an image file.',
    keywords: ['image', 'upload', 'add'],
  },
  lock: {
    label: 'Lock',
    description: 'Security, restricted access or a password field.',
    keywords: ['lock', 'security', 'password'],
  },
  'lock-closed': {
    label: 'Closed lock',
    description: 'A locked resource or denied access.',
    keywords: ['locked', 'denied', 'security'],
  },
  'lock-open': {
    label: 'Open lock',
    description: 'An unlocked resource or granted access.',
    keywords: ['unlocked', 'access', 'security'],
  },
  picture: {
    label: 'Picture',
    description: 'An image, photograph, thumbnail or gallery.',
    keywords: ['image', 'photo', 'gallery'],
  },
  plug: {
    label: 'Integration',
    description: 'A connection, plugin or service integration.',
    keywords: ['integration', 'plugin', 'connection'],
  },
  plus: {
    label: 'Add',
    description: 'Create a new item or increase a value.',
    keywords: ['add', 'create', 'increase'],
  },
  progressFinish: {
    label: 'Progress complete',
    description: 'The final or successfully completed process stage.',
    keywords: ['progress', 'complete', 'finish'],
  },
  redo: {
    label: 'Redo',
    description: 'Repeat the last operation that was undone.',
    keywords: ['redo', 'repeat', 'history'],
  },
  screen: {
    label: 'Screen',
    description: 'An application view, monitor or device.',
    keywords: ['screen', 'monitor', 'device'],
  },
  search: {
    label: 'Search',
    description: 'Start a search or represent a search field.',
    keywords: ['search', 'find', 'field'],
  },
  sort: {
    label: 'Sort',
    description: 'Change data order or sorting direction.',
    keywords: ['sort', 'order', 'direction'],
  },
  trash: {
    label: 'Delete',
    description: 'Remove an item or move it to trash.',
    keywords: ['delete', 'remove', 'trash'],
  },
  trial: {
    label: 'Trial',
    description: 'A trial state or part of a trial indicator.',
    keywords: ['trial', 'status', 'indicator'],
  },
  trialCurve: {
    label: 'Trial curve',
    description: 'A decorative part of the trial indicator.',
    keywords: ['trial', 'curve', 'decoration'],
  },
  undo: {
    label: 'Undo',
    description: 'Reverse the most recently completed operation.',
    keywords: ['undo', 'reverse', 'history'],
  },
  univercity: {
    label: 'Institution',
    description: 'An office, university or public institution.',
    keywords: ['institution', 'university', 'office'],
  },
  users: {
    label: 'Users',
    description: 'A group of people, recipients or team members.',
    keywords: ['users', 'group', 'team'],
  },
  'users-alt': {
    label: 'Users — alternative',
    description: 'An alternative symbol for a group or audience.',
    keywords: ['users', 'group', 'alternative'],
  },
};

export function getIconCategory(category: {
  description: string;
  id: IconCategoryId;
  label: string;
}) {
  return locale.value === 'en' ? { ...category, ...iconCategoryEnglish[category.id] } : category;
}

export function getIcon(icon: IconDefinition): IconDefinition {
  return locale.value === 'en' && iconEnglish[icon.name]
    ? { ...icon, ...iconEnglish[icon.name] }
    : icon;
}
