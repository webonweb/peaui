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
  SvgIcon: enCopy(
    'A lightweight renderer for SVG icons included with PEAUI.',
    ['Loads an icon by name.', 'Keeps decorative graphics hidden from screen readers.'],
    'An icon filename without its extension, for example check, edit or search.',
  ),
  Avatar: enCopy(
    'A user avatar with an image, initials or icon fallback and an optional presence status.',
    [
      'Keeps a stable size and a predictable image-to-initials-to-icon fallback order.',
      'Uses a neutral fallback surface and the same visual tokens in Vue, React and Web Components.',
      'Supports both presentational use and a keyboard-accessible native button.',
      'Exposes status text to assistive technologies without announcing it as a live update.',
    ],
    'An image URL and alternative text, or a name or initials, plus optional size, shape, status and interactive settings.',
  ),
  AvatarGroup: enCopy(
    'A compact avatar group with stable ordering, a controlled visible limit and an accessible list of remaining people.',
    [
      'Presents a team in overlapping or spaced layouts without changing DOM order.',
      'Exposes every person and the overflow counter as native keyboard actions.',
      'Optionally shows only hidden people in a popover and restores focus when it closes.',
      'Uses the same classes, tokens and behavior in Vue, React and Web Components.',
    ],
    'An array of people with identifiers and names, plus an optional limit, size, shape, direction, overflow mode and controlled open state.',
  ),
  ContextMenu: enCopy(
    'An accessible context menu positioned at the pointer or active target, with safe long press and a complete keyboard alternative.',
    [
      'Opens actions with right click, the Menu key, Shift+F10 or a configurable touch hold.',
      'Suppresses the native menu only after successful activation and never blocks scrolling or system zoom.',
      'Shares ARIA roles, typeahead, groups, checkboxes, radio items and two-level submenus with DropdownMenu.',
      'Keeps the surface inside the viewport and uses the same appearance in Vue, React and Web Components.',
    ],
    'An item array and target content, plus optional context data, trigger mode, positioning, long press, scroll policy and controlled open state.',
  ),
  DropdownMenu: enCopy(
    'An accessible action menu with groups, separators, checkboxes, radio items, shortcut hints and two-level submenus.',
    [
      'Implements the ARIA menu pattern with correct roles, complete keyboard navigation and typeahead.',
      'Skips disabled items, restores focus after dismissal and never traps Tab navigation.',
      'Keeps the requested top/right/bottom/left side and constrains the surface to the available viewport.',
      'Keeps the same appearance, class names and behavior in Vue, React and Web Components.',
    ],
    'An item array with stable identifiers and types, plus optional placement, alignment, density, close policy and controlled open state.',
  ),
  SplitButton: enCopy(
    'A compound button with an independent primary action and a menu of alternative actions.',
    [
      'Keeps primary activation separate from menu opening, including loading and partially disabled states.',
      'Exposes two native controls in a named group and the complete ARIA menu pattern with focus restoration.',
      'Supports Enter, Space, ArrowDown and Escape while leaving Tab to the page navigation flow.',
      'Provides a progressive xxs–l type scale, 44px touch targets, safe long-label truncation and a menu constrained to the viewport.',
      'Uses identical class names, tokens, dimensions and behavior in Vue, React and Web Components.',
    ],
    'A primary-action label and DropdownMenu item array, plus optional icon, variant, size, alignment, controlled open state and independent disabled and loading states.',
  ),
  TransferList: enCopy(
    'Two connected multi-selection lists for safely assigning and removing items.',
    [
      'Moves selected or all visible items without changing stable keys or deterministic ordering.',
      'Provides independent search, sorting, counts, per-panel loading and disabled-item enforcement.',
      'Implements the ARIA multiselectable listbox pattern with arrows, Home, End, Shift and Ctrl/Cmd+A.',
      'Stacks in narrow containers, keeps internal scrolling and looks identical in Vue, React and Web Components.',
    ],
    'An object array with stable keys and labels plus a target-key array, with optional panel selections, filters, sorting, disabled keys, loading and localized labels.',
  ),
  InlineEdit: enCopy(
    'Accessible in-place value editing with a controlled draft, explicit saving and safe cancellation.',
    [
      'Composes the existing FormInput, FormNumber, FormSelect, FormTextarea and ButtonAction instead of duplicating fields and buttons.',
      'Supports validation, controlled asynchronous saving, server errors and aria-busy without committing the value by itself.',
      'Provides Enter or Ctrl/Cmd+Enter, Escape, F2 and configurable Tab behavior with deterministic focus restoration.',
      'Keeps a visible edit button even when click or double-click activation is enabled.',
      'Wraps actions in narrow containers and preserves identical appearance, class names and behavior across Vue, React and Web Components.',
    ],
    'A value and optional controlled editing state, plus editor type, editorProps, validation, save mode, activation, actions, Tab behavior and disabled/readonly/loading/error states.',
  ),
  CopyButton: enCopy(
    'An accessible plain-text clipboard action with a safe fallback and unambiguous result feedback.',
    [
      'Composes the existing ButtonAction and SvgIcon while preserving the size scale, variants and a minimum 44px touch target.',
      'Resolves the exact value from text or synchronous/asynchronous getText only when the action is activated.',
      'Distinguishes success, write failure and unsupported clipboard environments while cleaning fallback DOM and reset timers.',
      'Keeps focus on the native button, uses a stable action name and announces the result through an atomic live region.',
      'Provides icon, text and icon-text presentations with identical appearance and behavior in Vue, React and Web Components.',
    ],
    'Text or a getText resolver, with optional reset delay, labels, content presentation, ButtonAction variant and size, status visibility, loading and disabled states.',
  ),
  KeyboardKey: enCopy(
    'A semantic presentation of one key or an ordered shortcut combination with platform-aware mapping.',
    [
      'Renders every key as native kbd markup while preserving order and allowing wrapping only between keycaps.',
      'Maps the portable Mod token and modifiers for Windows, macOS, Linux and generic platforms.',
      'Keeps compact visual symbols separate from the complete assistive phrase, including with custom renderers.',
      'Remains static, never enters the Tab order and does not claim aria-keyshortcuts without active shortcut registration.',
      'Uses the same contract, SSR behavior, appearance and responsive layout in Vue, React and Web Components.',
    ],
    'A key or ordered token combination, plus optional platform, symbol/text format, size, inline/block presentation, separator, muted appearance and custom accessible label.',
  ),
  ScrollArea: enCopy(
    'A responsive native-overflow scrolling region with optional PeaUI scrollbars and a consistent programmatic API.',
    [
      'Preserves native wheel, touch, keyboard and momentum scrolling without intercepting gestures.',
      'Provides vertical, horizontal and two-axis viewports in native or styled mode.',
      'Styled bars implement the ARIA scrollbar pattern, complete keyboard control, dragging and logical RTL coordinates.',
      'Deduplicates edge events, batches measurements by animation frame and removes observers on unmount.',
      'Uses identical markup, appearance, events and public methods in Vue, React and Web Components.',
    ],
    'Slot content or React children, with optional axes, scrollbar type and visibility, an accessible name and a stable id for position restoration.',
  ),
  VirtualList: enCopy(
    'A high-performance fixed-height list that renders only the visible range of a large collection plus controlled overscan.',
    [
      'Handles 10,000 or more records without creating the same number of DOM nodes.',
      'Composes the existing ScrollArea, EmptyState and SpinnerLoader with shared PeaUI tokens.',
      'Provides list and listbox semantics, complete aria-setsize/aria-posinset metadata and Arrow, Home, End, PageUp and PageDown navigation.',
      'Keeps the focused row mounted, deduplicates reachEnd and preserves position when data is appended or prepended.',
      'Uses the same range, markup, appearance, events and scrolling methods in Vue, React and Web Components.',
    ],
    'An item array, fixed itemSize and viewport height, with optional overscan, key and label resolvers, listbox semanticRole, loading, hasMore and controlled activeIndex.',
  ),
  MenuBar: enCopy(
    'A responsive application menubar that composes several accessible DropdownMenu sections into one keyboard workflow.',
    [
      'Implements the ARIA menubar pattern with roving tabindex, arrow navigation, Home, End and typeahead.',
      'Switches open parent menus without leaving menu mode and preserves the established submenu behavior.',
      'Scrolls horizontally on narrow screens, keeps the focused trigger visible and never silently changes into a hamburger.',
      'Uses the same markup, tokens and behavior in Vue, React and Web Components.',
    ],
    'An ordered menu-section array with identifiers, labels and DropdownMenu items, plus optional density, loop and controlled open-menu state.',
  ),
  FormSwitchToggle: enCopy(
    'An accessible boolean or domain-value setting switch built on a native checkbox with the switch role.',
    [
      'Participates in native forms, supports required validation and maps trueValue and falseValue without losing type safety.',
      'Connects its label, description, error and loading status through correct ARIA relationships.',
      'Distinguishes disabled, focusable read-only and loading states and never changes while blocked.',
      'Provides a minimum 44px activation target, wraps long content and looks identical in Vue, React and Web Components.',
    ],
    'A controlled value through the Vue value model or React value/onValueChange, plus optional domain values, label, description, error, size and form states.',
  ),
  FormRatingInput: enCopy(
    'An accessible control for selecting or presenting a rating on a discrete full-step or half-step scale.',
    [
      'Exposes one native slider with unambiguous aria-valuetext instead of several unnamed buttons.',
      'Keeps pointer preview separate from the committed model and supports explicit clearing.',
      'Supports arrows, Home, End, Delete and Backspace, plus a non-tabbable read-only presentation.',
      'Provides 44px minimum touch targets, wraps large scales and looks identical in Vue, React and Web Components.',
    ],
    'A number or null value, positive max, step 1 or 0.5, and optional value labels, custom icon, field label, description, error and form states.',
  ),
  ToggleButton: enCopy(
    'An accessible toggle button for persistent on/off settings, built on a native button with aria-pressed.',
    [
      'Supports Enter and Space natively and exposes a controlled boolean model without an extra icon tab stop.',
      'Keeps a stable accessible name when the visible label or icon changes with the pressed state.',
      'Distinguishes disabled, focusable read-only and loading states, and uses the shared form-button surface and border without an extra selection icon.',
      'Provides a minimum 44px target, opt-in text wrapping and the same appearance in Vue, React and Web Components.',
    ],
    'A controlled boolean value through the Vue value model or React value/onValueChange, plus labels, icons, content mode, variant, size and blocking states.',
  ),
  ToggleGroup: enCopy(
    'An accessible group of related toggle buttons with single or multiple selection.',
    [
      'Maintains at most one tab stop and supports arrow, Home and End navigation.',
      'Enforces required and allowEmpty rules without mixing aria-pressed with radio semantics.',
      'Supports horizontal and vertical orientation, RTL, disabled items and deterministic focus after data changes.',
      'Provides separate or attached layouts, five sizes, centered content without empty icon spacing, mobile wrapping or scrolling, and the same appearance in Vue, React and Web Components.',
    ],
    'An item array with unique string or number values and a scalar/null single model or array multiple model, plus optional label, validation, orientation, appearance, variant and xxs–l size.',
  ),
  SegmentedControl: enCopy(
    'A compact control for choosing exactly one option from a small mutually exclusive set.',
    [
      'Uses radiogroup/radio semantics and one roving tab stop without duplicating NavigationTabs.',
      'Supports automatic or manual activation, Home/End, vertical and horizontal orientation, RTL and disabled-item skipping.',
      'Updates its indicator after value, size and font changes without layout shift, and disables animation under reduced motion.',
      'Provides equal or natural distribution, text and icons, full width and mobile overflow that keeps the active option visible.',
    ],
    'An item array with a unique string or number value, label and optional icon, plus a single value model and distribution, content, size, orientation and activation settings.',
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
  FormFieldLabel: enCopy(
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
      'Provides a keyboard-operated calendar grid, month and year views, and reliable focus restoration.',
      'Uses the same 44px cell height, radius, hover, subtle today outline and selected fill as FormDateTimePicker.',
      'Keeps a readable minimum 320px overlay for fields as narrow as 200px when the viewport allows it, so the grid and navigation are never compressed.',
      'Uses the shared picker surface with Vue, React and Web Component parity.',
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
    [
      'Collects multiple values in one field.',
      'Filters long option lists.',
      'Keeps its panel inside the viewport on the shared PEAUI overlay surface.',
    ],
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
      'Shares radius, border, shadow, spacing and responsive limits with the other pickers.',
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
    [
      'Selects a year without a full calendar.',
      'Restricts values with minimum and maximum years.',
      'Provides keyboard navigation for the decade grid with correct roles, names and selected state.',
      'Uses the same visual cell states as the other calendar and date pickers.',
      'Keeps a readable minimum 320px overlay for fields as narrow as 200px and safely shifts it at viewport edges.',
      'Uses the shared picker surface in all three frameworks.',
    ],
    'ID, name, controlled value, range mode, year limits and field states.',
  ),
  FormTimePicker: enCopy(
    'An accessible time field with manual entry, editable segments and an option panel.',
    [
      'Synchronizes text and selection with a locale-independent HH:mm[:ss] model.',
      'Supports 12/24-hour formats, seconds, explicit steps, min/max limits and an off-step policy.',
      'Implements combobox, listbox and spinbutton patterns with complete keyboard and focus behavior.',
      'Keeps a readable minimum 320px panel for fields as narrow as 200px without compressed or overlapping controls.',
      'Keeps the panel inside the viewport, provides 44px touch targets and preserves Vue, React and Web Component parity.',
    ],
    'ID, name, controlled value and open state, plus optional format, variant, panel mode, steps, limits, parser, formatter and field states.',
  ),
  FormDateTimePicker: enCopy(
    'An accessible local date and time field with one responsive selection panel.',
    [
      'Keeps date and time in one explicit model without implicit time-zone conversion.',
      'Supports single or split input, horizontal or stacked layout, and immediate or confirmed updates.',
      'Validates partial values, whole date-time bounds, disabled moments, and time steps.',
      'Provides a keyboard-operable calendar grid and spinbuttons with clear accessible names, a 44px height and a minimum 24 × 24px target even in the narrowest panel.',
      'Defines the shared picker day states for hover, today, selection and disabled dates.',
      'Keeps a minimum 320px panel, readable day grid and viewport-safe placement for fields as narrow as 200px.',
      'Automatically stacks or separates sections according to available space.',
    ],
    'Provide id, name, and the controlled { date, time } value; optionally configure bounds, locale, informational time zone, formats, layout, confirmation, and form states.',
  ),
  FormDateRangePicker: enCopy(
    'An accessible complete date-range field with manual entry, presets, and one or two calendars.',
    [
      'Synchronizes two inputs or one text input with the visual range preview and a canonical [start, end] model.',
      'Supports swap, reject and resetEnd ordering policies plus immediate or confirmed updates.',
      'Validates minDate, maxDate, disabled dates, partial values and endpoint order without implicit time-zone conversion.',
      'Provides a calendar grid with roving tabindex, complete keyboard support, a named dialog, live status and explicit start/end announcements.',
      'Stacks two calendars in narrow panels, avoids compressed cells for 200px triggers and keeps the overlay inside the viewport.',
      'Extends the simple FormDatePicker range use case with manual fields, presets, ordering validation and transactional apply/cancel while preserving FormDatePicker compatibility.',
      'Uses the same model, class names, appearance and behavior in Vue, React and Web Components.',
    ],
    'Provide id, name and controlled [start, end] value; optionally configure calendar count, input variant, presets, bounds, disabled dates, locale, parser, formatter, ordering policy, confirmation and form states.',
  ),
  FormColorPicker: enCopy(
    'An accessible color field with manual entry, a two-dimensional picker and optional transparency.',
    [
      'Keeps one canonical color model and presents it as HEX, RGB or HSL without conversion drift.',
      'Supports popover and inline panels, saved and recent colors, alpha, and progressive EyeDropper enhancement.',
      'Provides named sliders, keyboard support for saturation and brightness, non-color-only messaging, and 44 px touch targets.',
      'Fits narrow viewports and preserves one visual and behavioral contract across Vue, React and Web Components.',
    ],
    'Provide id, name and the controlled color value; optionally configure format, variant, density, alpha, palettes, EyeDropper, placement and form states.',
  ),
  FormPinInput: enCopy(
    'An accessible group of fields for entering a short PIN, OTP or identifier.',
    [
      'Keeps the value as a string, including leading zeroes, and emits complete only for a new full value.',
      'Supports numeric or alphanumeric input, masking, transformation, visual grouping and native one-time-code autocomplete.',
      'Distributes pasted text, rejects invalid characters and safely supports editing in the middle of the code.',
      'Provides one Tab entry point, arrow-key navigation, unambiguous cell labels and 44 px touch targets.',
    ],
    'Provide id, name and the controlled string; optionally configure length, type, masking, pattern, transformation, grouping, autocomplete and form states.',
  ),
  FormTagsInput: enCopy(
    'An accessible field for adding, editing and removing multiple short values as tags.',
    [
      'Validates normalization, duplicates and limits before every model update, including paste and edits.',
      'Supports freeform and suggestions-only modes, object values and cancellable asynchronous suggestions.',
      'Provides combobox/listbox semantics, named remove buttons, stable focus with a subtle two-pixel ring and complete keyboard support.',
      'Uses the shared PEAUI popover layer for light dismiss, placement and trigger-width matching.',
      'Wraps long values without overflow and preserves identical behavior and appearance across Vue, React and Web Components.',
    ],
    'Provide id, name and controlled value/inputValue; optionally configure suggestions, provider, separators, normalization, validation, keys, serialization, limits and field states.',
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
    [
      'Builds menus, tips and small contextual panels.',
      'Controls content position, width and vertical fallback at viewport edges.',
      'Provides one shared surface, offset and forced-colors treatment for the pickers built on it.',
    ],
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
  core: {
    label: 'Core',
    description: 'Core PeaUI symbols and their ring, tile and badge variants.',
  },
  extended: {
    label: 'Extended',
    description: 'Additional semantic symbols that complement the core catalog.',
  },
  ring: {
    label: 'Ring variants',
    description: 'Symbols placed inside a light circular outline.',
  },
  tile: {
    label: 'Tile variants',
    description: 'Symbols placed inside a rounded square outline.',
  },
  actions: { label: 'Actions', description: 'User operations and interface tools.' },
  accessibility: {
    label: 'Accessibility',
    description: 'Assistive technology, captions and accessibility symbols.',
  },
  animals: { label: 'Animals', description: 'Animals and related symbols.' },
  arrows: { label: 'Arrows', description: 'Directions, undo and element movement.' },
  brands: { label: 'Brands', description: 'Services, platforms and system marks.' },
  buildings: { label: 'Buildings', description: 'Buildings, institutions and places.' },
  charts: { label: 'Charts', description: 'Data visualization, trends and statistics.' },
  communication: {
    label: 'Communication',
    description: 'Conversations, calls, messages and contacts.',
  },
  connectivity: { label: 'Connectivity', description: 'Networks, signals and connections.' },
  design: { label: 'Design', description: 'Graphics tools, color and editing.' },
  development: { label: 'Development', description: 'Code, data, servers and integrations.' },
  devices: { label: 'Devices', description: 'Computers, displays and electronic devices.' },
  finance: { label: 'Finance', description: 'Payments, currencies, wallets and billing.' },
  food: { label: 'Food and drink', description: 'Food products, meals and drinks.' },
  gaming: { label: 'Gaming', description: 'Games, controllers and entertainment.' },
  home: { label: 'Home', description: 'Home furnishings and everyday appliances.' },
  layout: { label: 'Layout', description: 'Grids, panels, alignment and distribution.' },
  mail: { label: 'Mail', description: 'Email, inboxes and sending.' },
  maps: { label: 'Maps and location', description: 'Location, routes, maps and navigation.' },
  math: { label: 'Math', description: 'Operations, symbols and mathematical tools.' },
  media: { label: 'Media', description: 'Audio, video, playback and recording.' },
  medical: { label: 'Medical', description: 'Health, care and medical equipment.' },
  nature: { label: 'Nature', description: 'Plants, landscapes and the environment.' },
  people: { label: 'People', description: 'Users, groups and profiles.' },
  photography: { label: 'Photography', description: 'Cameras, images and photo editing.' },
  science: { label: 'Science', description: 'Research, laboratories and science symbols.' },
  shapes: { label: 'Shapes', description: 'Basic figures and geometric symbols.' },
  shopping: { label: 'Shopping', description: 'Stores, products, packages and discounts.' },
  sports: { label: 'Sports', description: 'Activities, disciplines and sports equipment.' },
  text: { label: 'Text', description: 'Typography, formatting and content editing.' },
  time: { label: 'Time and calendar', description: 'Dates, time, alarms and schedules.' },
  tools: { label: 'Tools', description: 'Settings, repairs and technical tools.' },
  transportation: { label: 'Transportation', description: 'Vehicles, travel and infrastructure.' },
  weather: { label: 'Weather', description: 'Weather conditions and temperature.' },
  navigation: {
    label: 'Navigation',
    description: 'Directions, view transitions and position controls.',
  },
  status: {
    label: 'Status and messages',
    description: 'Confirmations, help, hints and process states.',
  },
  files: { label: 'Files and documents', description: 'Documents, folders and file operations.' },
  security: { label: 'Security', description: 'Locks, access and security states.' },
  users: { label: 'Users', description: 'People, groups and audiences.' },
  interface: { label: 'Interface', description: 'General application elements and objects.' },
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
  if (locale.value !== 'en') return icon;

  if (iconEnglish[icon.name]) return { ...icon, ...iconEnglish[icon.name] };

  if (icon.name.includes('/')) {
    return { ...icon, description: `PEAUI icon: ${icon.label}.` };
  }

  return icon;
}
