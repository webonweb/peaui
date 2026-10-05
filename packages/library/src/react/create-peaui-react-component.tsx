/** @jsxImportSource react */

import { type ReactComponentName, type PeauiReactProps } from './generated-react-props';
import { type RuntimeComponent, type RuntimeProps } from './renderers/runtime.shared';
import { BasicRenderer } from './renderers/basic.renderer';
import { ImageViewRenderer } from './renderers/image-view.renderer';
import { DisplayRenderer } from './renderers/display.renderer';
import { AvatarGroupRenderer } from './renderers/avatar-group.renderer';
import { ButtonRenderer } from './renderers/button.renderer';
import { FormRenderer } from './renderers/form.renderer';
import { InlineEditRuntimeRenderer } from './renderers/inline-edit-runtime.renderer';
import { CopyButtonRuntimeRenderer } from './renderers/copy-button-runtime.renderer';
import { ToggleButtonRenderer } from './renderers/toggle-button.renderer';
import { ToggleGroupRenderer } from './renderers/toggle-group.renderer';
import { SegmentedControlRenderer } from './renderers/segmented-control.renderer';
import { SplitButtonRenderer } from './renderers/split-button.renderer';
import { FeedbackRenderer } from './renderers/feedback.renderer';
import { LayoutRenderer } from './renderers/layout.renderer';
import { NavigationRenderer } from './renderers/navigation.renderer';
import { ContextMenuRenderer } from './renderers/context-menu.renderer';
import { DropdownMenuRenderer } from './renderers/dropdown-menu.renderer';
import { MenuBarRenderer } from './renderers/menu-bar.renderer';
import { OverlayRenderer } from './renderers/overlay.renderer';
import { type ComponentType, forwardRef, createElement } from 'react';

export const groupByName: Partial<Record<ReactComponentName, RuntimeComponent>> = {
  ImageView: ImageViewRenderer,
  SvgIcon: BasicRenderer,
  Avatar: DisplayRenderer,
  AvatarGroup: AvatarGroupRenderer,
  CalculationResults: DisplayRenderer,
  CardCarousel: DisplayRenderer,
  CounterBadge: DisplayRenderer,
  DescriptionField: DisplayRenderer,
  DisclosurePanel: DisplayRenderer,
  KeyboardKey: DisplayRenderer,
  SectionHeading: DisplayRenderer,
  TableList: DisplayRenderer,
  TableListFooter: DisplayRenderer,
  TableListHeader: DisplayRenderer,
  TagChip: DisplayRenderer,
  TreeList: DisplayRenderer,
  ButtonAction: ButtonRenderer,
  ButtonExport: ButtonRenderer,
  InputSlider: FormRenderer,
  InlineEdit: InlineEditRuntimeRenderer,
  CopyButton: CopyButtonRuntimeRenderer,
  SearchInput: FormRenderer,
  SelectableCard: ButtonRenderer,
  ToggleButton: ToggleButtonRenderer,
  ToggleGroup: ToggleGroupRenderer,
  SegmentedControl: SegmentedControlRenderer,
  SplitButton: SplitButtonRenderer,
  EmptyState: FeedbackRenderer,
  MessageText: FeedbackRenderer,
  ProgressIndicator: FeedbackRenderer,
  SkeletonLoading: FeedbackRenderer,
  SpinnerLoader: FeedbackRenderer,
  ToastAlert: FeedbackRenderer,
  FormFieldLabel: FormRenderer,
  FormButtonCheckbox: FormRenderer,
  FormButtonGroup: FormRenderer,
  FormCheckbox: FormRenderer,
  FormContainer: FormRenderer,
  FormDatePicker: FormRenderer,
  FormField: FormRenderer,
  FormFileUpload: FormRenderer,
  FormFileUploadSimple: FormRenderer,
  FormInput: FormRenderer,
  FormMultiSelect: FormRenderer,
  FormNumber: FormRenderer,
  FormPassword: FormRenderer,
  FormRadio: FormRenderer,
  FormSelect: FormRenderer,
  FormTextarea: FormRenderer,
  FormYearPicker: FormRenderer,
  FormSwitchToggle: FormRenderer,
  CardPanel: LayoutRenderer,
  FullscreenContainer: LayoutRenderer,
  GridItem: LayoutRenderer,
  GridSection: LayoutRenderer,
  PageLayout: LayoutRenderer,
  SectionDivider: LayoutRenderer,
  Breadcrumbs: NavigationRenderer,
  ContextMenu: ContextMenuRenderer,
  DropdownMenu: DropdownMenuRenderer,
  MenuBar: MenuBarRenderer,
  ListLimitControl: NavigationRenderer,
  NavigationCard: NavigationRenderer,
  NavigationDisclosureCard: NavigationRenderer,
  NavigationIconCard: NavigationRenderer,
  NavigationLink: NavigationRenderer,
  NavigationStepper: NavigationRenderer,
  NavigationTabs: NavigationRenderer,
  PaginationControl: NavigationRenderer,
  DrawerPanel: OverlayRenderer,
  InfoTooltip: OverlayRenderer,
  ModalDialog: OverlayRenderer,
  PopoverButton: OverlayRenderer,
  PopoverOverlayer: OverlayRenderer,
};

export function createPeauiReactComponent<Name extends ReactComponentName>(
  name: Name,
): ComponentType<PeauiReactProps<Name>> {
  const Renderer = groupByName[name];
  if (!Renderer) {
    throw new Error(`[PeaUI React] Missing renderer for ${name}.`);
  }
  const Component = forwardRef<HTMLElement, RuntimeProps>((props, ref) =>
    createElement(Renderer, { ...props, __name: name, forwardedRef: ref }),
  );
  Component.displayName = name;
  return Component;
}
