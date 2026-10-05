// Ten plik jest generowany przez scripts/generate-custom-elements-manifest.mjs.
// Zapewnia typy dla document.createElement/querySelector bez rejestrowania elementow.

export const PEAUI_WEB_COMPONENT_TAG_NAMES = [
  'peaui-image-view',
  'peaui-svg-icon',
  'peaui-avatar',
  'peaui-avatar-group',
  'peaui-calculation-results',
  'peaui-card-carousel',
  'peaui-counter-badge',
  'peaui-description-field',
  'peaui-disclosure-panel',
  'peaui-keyboard-key',
  'peaui-section-heading',
  'peaui-table-list',
  'peaui-table-list-footer',
  'peaui-table-list-header',
  'peaui-tag-chip',
  'peaui-tree-list',
  'peaui-virtual-list',
  'peaui-button-action',
  'peaui-button-export',
  'peaui-copy-button',
  'peaui-inline-edit',
  'peaui-input-slider',
  'peaui-search-input',
  'peaui-segmented-control',
  'peaui-selectable-card',
  'peaui-split-button',
  'peaui-toggle-button',
  'peaui-toggle-group',
  'peaui-transfer-list',
  'peaui-empty-state',
  'peaui-message-text',
  'peaui-notification-center',
  'peaui-progress-indicator',
  'peaui-skeleton-loading',
  'peaui-spinner-loader',
  'peaui-toast-alert',
  'peaui-form-button-checkbox',
  'peaui-form-button-group',
  'peaui-form-checkbox',
  'peaui-form-color-picker',
  'peaui-form-container',
  'peaui-form-date-picker',
  'peaui-form-date-range-picker',
  'peaui-form-date-time-picker',
  'peaui-form-field',
  'peaui-form-field-label',
  'peaui-form-file-upload',
  'peaui-form-file-upload-simple',
  'peaui-form-input',
  'peaui-form-multi-select',
  'peaui-form-number',
  'peaui-form-password',
  'peaui-form-pin-input',
  'peaui-form-radio',
  'peaui-form-rating-input',
  'peaui-form-select',
  'peaui-form-switch-toggle',
  'peaui-form-tags-input',
  'peaui-form-textarea',
  'peaui-form-time-picker',
  'peaui-form-year-picker',
  'peaui-card-panel',
  'peaui-fullscreen-container',
  'peaui-grid-item',
  'peaui-grid-section',
  'peaui-page-layout',
  'peaui-scroll-area',
  'peaui-section-divider',
  'peaui-breadcrumbs',
  'peaui-command-palette',
  'peaui-context-menu',
  'peaui-dropdown-menu',
  'peaui-list-limit-control',
  'peaui-menu-bar',
  'peaui-navigation-card',
  'peaui-navigation-disclosure-card',
  'peaui-navigation-icon-card',
  'peaui-navigation-link',
  'peaui-navigation-stepper',
  'peaui-navigation-tabs',
  'peaui-pagination-control',
  'peaui-drawer-panel',
  'peaui-guided-tour',
  'peaui-info-tooltip',
  'peaui-modal-dialog',
  'peaui-popover-button',
  'peaui-popover-overlayer',
] as const;

export type PeauiWebComponentTagName = (typeof PEAUI_WEB_COMPONENT_TAG_NAMES)[number];

declare global {
  interface HTMLElementTagNameMap {
    'peaui-image-view': InstanceType<
      typeof import('./components/basic/ImageView/index.wc').default
    >;
    'peaui-svg-icon': InstanceType<typeof import('./components/basic/SvgIcon/index.wc').default>;
    'peaui-avatar': InstanceType<
      typeof import('./components/data-display/Avatar/index.wc').default
    >;
    'peaui-avatar-group': InstanceType<
      typeof import('./components/data-display/AvatarGroup/index.wc').default
    >;
    'peaui-calculation-results': InstanceType<
      typeof import('./components/data-display/CalculationResults/index.wc').default
    >;
    'peaui-card-carousel': InstanceType<
      typeof import('./components/data-display/CardCarousel/index.wc').default
    >;
    'peaui-counter-badge': InstanceType<
      typeof import('./components/data-display/CounterBadge/index.wc').default
    >;
    'peaui-description-field': InstanceType<
      typeof import('./components/data-display/DescriptionField/index.wc').default
    >;
    'peaui-disclosure-panel': InstanceType<
      typeof import('./components/data-display/DisclosurePanel/index.wc').default
    >;
    'peaui-keyboard-key': InstanceType<
      typeof import('./components/data-display/KeyboardKey/index.wc').default
    >;
    'peaui-section-heading': InstanceType<
      typeof import('./components/data-display/SectionHeading/index.wc').default
    >;
    'peaui-table-list': InstanceType<
      typeof import('./components/data-display/TableList/index.wc').default
    >;
    'peaui-table-list-footer': InstanceType<
      typeof import('./components/data-display/TableListFooter/index.wc').default
    >;
    'peaui-table-list-header': InstanceType<
      typeof import('./components/data-display/TableListHeader/index.wc').default
    >;
    'peaui-tag-chip': InstanceType<
      typeof import('./components/data-display/TagChip/index.wc').default
    >;
    'peaui-tree-list': InstanceType<
      typeof import('./components/data-display/TreeList/index.wc').default
    >;
    'peaui-virtual-list': InstanceType<
      typeof import('./components/data-display/VirtualList/index.wc').default
    >;
    'peaui-button-action': InstanceType<
      typeof import('./components/data-entry/ButtonAction/index.wc').default
    >;
    'peaui-button-export': InstanceType<
      typeof import('./components/data-entry/ButtonExport/index.wc').default
    >;
    'peaui-copy-button': InstanceType<
      typeof import('./components/data-entry/CopyButton/index.wc').default
    >;
    'peaui-inline-edit': InstanceType<
      typeof import('./components/data-entry/InlineEdit/index.wc').default
    >;
    'peaui-input-slider': InstanceType<
      typeof import('./components/data-entry/InputSlider/index.wc').default
    >;
    'peaui-search-input': InstanceType<
      typeof import('./components/data-entry/SearchInput/index.wc').default
    >;
    'peaui-segmented-control': InstanceType<
      typeof import('./components/data-entry/SegmentedControl/index.wc').default
    >;
    'peaui-selectable-card': InstanceType<
      typeof import('./components/data-entry/SelectableCard/index.wc').default
    >;
    'peaui-split-button': InstanceType<
      typeof import('./components/data-entry/SplitButton/index.wc').default
    >;
    'peaui-toggle-button': InstanceType<
      typeof import('./components/data-entry/ToggleButton/index.wc').default
    >;
    'peaui-toggle-group': InstanceType<
      typeof import('./components/data-entry/ToggleGroup/index.wc').default
    >;
    'peaui-transfer-list': InstanceType<
      typeof import('./components/data-entry/TransferList/index.wc').default
    >;
    'peaui-empty-state': InstanceType<
      typeof import('./components/feedback/EmptyState/index.wc').default
    >;
    'peaui-message-text': InstanceType<
      typeof import('./components/feedback/MessageText/index.wc').default
    >;
    'peaui-notification-center': InstanceType<
      typeof import('./components/feedback/NotificationCenter/index.wc').default
    >;
    'peaui-progress-indicator': InstanceType<
      typeof import('./components/feedback/ProgressIndicator/index.wc').default
    >;
    'peaui-skeleton-loading': InstanceType<
      typeof import('./components/feedback/SkeletonLoading/index.wc').default
    >;
    'peaui-spinner-loader': InstanceType<
      typeof import('./components/feedback/SpinnerLoader/index.wc').default
    >;
    'peaui-toast-alert': InstanceType<
      typeof import('./components/feedback/ToastAlert/index.wc').default
    >;
    'peaui-form-button-checkbox': InstanceType<
      typeof import('./components/form/FormButtonCheckbox/index.wc').default
    >;
    'peaui-form-button-group': InstanceType<
      typeof import('./components/form/FormButtonGroup/index.wc').default
    >;
    'peaui-form-checkbox': InstanceType<
      typeof import('./components/form/FormCheckbox/index.wc').default
    >;
    'peaui-form-color-picker': InstanceType<
      typeof import('./components/form/FormColorPicker/index.wc').default
    >;
    'peaui-form-container': InstanceType<
      typeof import('./components/form/FormContainer/index.wc').default
    >;
    'peaui-form-date-picker': InstanceType<
      typeof import('./components/form/FormDatePicker/index.wc').default
    >;
    'peaui-form-date-range-picker': InstanceType<
      typeof import('./components/form/FormDateRangePicker/index.wc').default
    >;
    'peaui-form-date-time-picker': InstanceType<
      typeof import('./components/form/FormDateTimePicker/index.wc').default
    >;
    'peaui-form-field': InstanceType<typeof import('./components/form/FormField/index.wc').default>;
    'peaui-form-field-label': InstanceType<
      typeof import('./components/form/FormFieldLabel/index.wc').default
    >;
    'peaui-form-file-upload': InstanceType<
      typeof import('./components/form/FormFileUpload/index.wc').default
    >;
    'peaui-form-file-upload-simple': InstanceType<
      typeof import('./components/form/FormFileUploadSimple/index.wc').default
    >;
    'peaui-form-input': InstanceType<typeof import('./components/form/FormInput/index.wc').default>;
    'peaui-form-multi-select': InstanceType<
      typeof import('./components/form/FormMultiSelect/index.wc').default
    >;
    'peaui-form-number': InstanceType<
      typeof import('./components/form/FormNumber/index.wc').default
    >;
    'peaui-form-password': InstanceType<
      typeof import('./components/form/FormPassword/index.wc').default
    >;
    'peaui-form-pin-input': InstanceType<
      typeof import('./components/form/FormPinInput/index.wc').default
    >;
    'peaui-form-radio': InstanceType<typeof import('./components/form/FormRadio/index.wc').default>;
    'peaui-form-rating-input': InstanceType<
      typeof import('./components/form/FormRatingInput/index.wc').default
    >;
    'peaui-form-select': InstanceType<
      typeof import('./components/form/FormSelect/index.wc').default
    >;
    'peaui-form-switch-toggle': InstanceType<
      typeof import('./components/form/FormSwitchToggle/index.wc').default
    >;
    'peaui-form-tags-input': InstanceType<
      typeof import('./components/form/FormTagsInput/index.wc').default
    >;
    'peaui-form-textarea': InstanceType<
      typeof import('./components/form/FormTextarea/index.wc').default
    >;
    'peaui-form-time-picker': InstanceType<
      typeof import('./components/form/FormTimePicker/index.wc').default
    >;
    'peaui-form-year-picker': InstanceType<
      typeof import('./components/form/FormYearPicker/index.wc').default
    >;
    'peaui-card-panel': InstanceType<
      typeof import('./components/layout/CardPanel/index.wc').default
    >;
    'peaui-fullscreen-container': InstanceType<
      typeof import('./components/layout/FullscreenContainer/index.wc').default
    >;
    'peaui-grid-item': InstanceType<typeof import('./components/layout/GridItem/index.wc').default>;
    'peaui-grid-section': InstanceType<
      typeof import('./components/layout/GridSection/index.wc').default
    >;
    'peaui-page-layout': InstanceType<
      typeof import('./components/layout/PageLayout/index.wc').default
    >;
    'peaui-scroll-area': InstanceType<
      typeof import('./components/layout/ScrollArea/index.wc').default
    >;
    'peaui-section-divider': InstanceType<
      typeof import('./components/layout/SectionDivider/index.wc').default
    >;
    'peaui-breadcrumbs': InstanceType<
      typeof import('./components/navigation/Breadcrumbs/index.wc').default
    >;
    'peaui-command-palette': InstanceType<
      typeof import('./components/navigation/CommandPalette/index.wc').default
    >;
    'peaui-context-menu': InstanceType<
      typeof import('./components/navigation/ContextMenu/index.wc').default
    >;
    'peaui-dropdown-menu': InstanceType<
      typeof import('./components/navigation/DropdownMenu/index.wc').default
    >;
    'peaui-list-limit-control': InstanceType<
      typeof import('./components/navigation/ListLimitControl/index.wc').default
    >;
    'peaui-menu-bar': InstanceType<
      typeof import('./components/navigation/MenuBar/index.wc').default
    >;
    'peaui-navigation-card': InstanceType<
      typeof import('./components/navigation/NavigationCard/index.wc').default
    >;
    'peaui-navigation-disclosure-card': InstanceType<
      typeof import('./components/navigation/NavigationDisclosureCard/index.wc').default
    >;
    'peaui-navigation-icon-card': InstanceType<
      typeof import('./components/navigation/NavigationIconCard/index.wc').default
    >;
    'peaui-navigation-link': InstanceType<
      typeof import('./components/navigation/NavigationLink/index.wc').default
    >;
    'peaui-navigation-stepper': InstanceType<
      typeof import('./components/navigation/NavigationStepper/index.wc').default
    >;
    'peaui-navigation-tabs': InstanceType<
      typeof import('./components/navigation/NavigationTabs/index.wc').default
    >;
    'peaui-pagination-control': InstanceType<
      typeof import('./components/navigation/PaginationControl/index.wc').default
    >;
    'peaui-drawer-panel': InstanceType<
      typeof import('./components/overlayer/DrawerPanel/index.wc').default
    >;
    'peaui-guided-tour': InstanceType<
      typeof import('./components/overlayer/GuidedTour/index.wc').default
    >;
    'peaui-info-tooltip': InstanceType<
      typeof import('./components/overlayer/InfoTooltip/index.wc').default
    >;
    'peaui-modal-dialog': InstanceType<
      typeof import('./components/overlayer/ModalDialog/index.wc').default
    >;
    'peaui-popover-button': InstanceType<
      typeof import('./components/overlayer/PopoverButton/index.wc').default
    >;
    'peaui-popover-overlayer': InstanceType<
      typeof import('./components/overlayer/PopoverOverlayer/index.wc').default
    >;
  }
}

export {};
