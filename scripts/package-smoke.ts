import {
  ButtonAction,
  CopyButton,
  type CopyButtonProps,
  CommandPalette,
  type CommandPaletteProps,
  KeyboardKey,
  type KeyboardKeyPlatform,
  type KeyboardKeyProps,
  FormInput,
  FormTimePicker,
  type FormTimePickerProps,
  FormDateTimePicker,
  type FormDateTimePickerProps,
  FormDateRangePicker,
  type FormDateRangePickerProps,
  FormColorPicker,
  type FormColorPickerProps,
  FormPinInput,
  type FormPinInputProps,
  FormRatingInput,
  type FormRatingInputProps,
  FormTagsInput,
  type FormTagsInputProps,
  SegmentedControl,
  type SegmentedControlItem,
  type SegmentedControlProps,
  SplitButton,
  type SplitButtonItem,
  type SplitButtonProps,
  ToggleButton,
  type ToggleButtonProps,
  ToggleGroup,
  type ToggleGroupItem,
  type ToggleGroupProps,
  TransferList,
  type TransferListItem,
  type TransferListProps,
  ScrollArea,
  type ScrollAreaHandle,
  type ScrollAreaProps,
  type TreeListType,
} from "@peaui/ui";
import ReactButtonAction from "@peaui/ui/react/data-entry/ButtonAction";
import ReactCopyButton from "@peaui/ui/react/data-entry/CopyButton";
import ReactKeyboardKey from "@peaui/ui/react/data-display/KeyboardKey";
import ReactCommandPalette from "@peaui/ui/react/navigation/CommandPalette";
import ReactToggleButton from "@peaui/ui/react/data-entry/ToggleButton";
import ReactToggleGroup from "@peaui/ui/react/data-entry/ToggleGroup";
import ReactTransferList from "@peaui/ui/react/data-entry/TransferList";
import ReactScrollArea from "@peaui/ui/react/layout/ScrollArea";
import ReactFormInput from "@peaui/ui/react/form/FormInput";
import ReactFormTimePicker from "@peaui/ui/react/form/FormTimePicker";
import ReactFormDateTimePicker from "@peaui/ui/react/form/FormDateTimePicker";
import ReactFormDateRangePicker from "@peaui/ui/react/form/FormDateRangePicker";
import ReactFormColorPicker from "@peaui/ui/react/form/FormColorPicker";
import ReactFormPinInput from "@peaui/ui/react/form/FormPinInput";
import ReactFormRatingInput from "@peaui/ui/react/form/FormRatingInput";
import ReactFormTagsInput from "@peaui/ui/react/form/FormTagsInput";
import ReactSegmentedControl from "@peaui/ui/react/data-entry/SegmentedControl";
import ReactSplitButton from "@peaui/ui/react/data-entry/SplitButton";
import LegacyButtonAction from "@peaui/ui/data-entry/ButtonAction";
import LegacyCopyButton from "@peaui/ui/data-entry/CopyButton";
import LegacyKeyboardKey from "@peaui/ui/data-display/KeyboardKey";
import LegacyCommandPalette from "@peaui/ui/navigation/CommandPalette";
import LegacyToggleButton from "@peaui/ui/data-entry/ToggleButton";
import LegacyToggleGroup from "@peaui/ui/data-entry/ToggleGroup";
import LegacyTransferList from "@peaui/ui/data-entry/TransferList";
import LegacyScrollArea from "@peaui/ui/layout/ScrollArea";
import LegacySegmentedControl from "@peaui/ui/data-entry/SegmentedControl";
import LegacySplitButton from "@peaui/ui/data-entry/SplitButton";
import LegacyFormTimePicker from "@peaui/ui/form/FormTimePicker";
import LegacyFormDateTimePicker from "@peaui/ui/form/FormDateTimePicker";
import LegacyFormDateRangePicker from "@peaui/ui/form/FormDateRangePicker";
import LegacyFormColorPicker from "@peaui/ui/form/FormColorPicker";
import LegacyFormPinInput from "@peaui/ui/form/FormPinInput";
import LegacyFormRatingInput from "@peaui/ui/form/FormRatingInput";
import LegacyFormTagsInput from "@peaui/ui/form/FormTagsInput";
import VueButtonAction from "@peaui/ui/vue/data-entry/ButtonAction";
import VueCopyButton from "@peaui/ui/vue/data-entry/CopyButton";
import VueKeyboardKey from "@peaui/ui/vue/data-display/KeyboardKey";
import VueCommandPalette from "@peaui/ui/vue/navigation/CommandPalette";
import VueToggleButton from "@peaui/ui/vue/data-entry/ToggleButton";
import VueToggleGroup from "@peaui/ui/vue/data-entry/ToggleGroup";
import VueTransferList from "@peaui/ui/vue/data-entry/TransferList";
import VueScrollArea from "@peaui/ui/vue/layout/ScrollArea";
import VueSegmentedControl from "@peaui/ui/vue/data-entry/SegmentedControl";
import VueSplitButton from "@peaui/ui/vue/data-entry/SplitButton";
import VueFormTimePicker from "@peaui/ui/vue/form/FormTimePicker";
import VueFormDateTimePicker from "@peaui/ui/vue/form/FormDateTimePicker";
import VueFormDateRangePicker from "@peaui/ui/vue/form/FormDateRangePicker";
import VueFormColorPicker from "@peaui/ui/vue/form/FormColorPicker";
import VueFormPinInput from "@peaui/ui/vue/form/FormPinInput";
import VueFormRatingInput from "@peaui/ui/vue/form/FormRatingInput";
import VueFormTagsInput from "@peaui/ui/vue/form/FormTagsInput";
import type ButtonActionElement from "@peaui/ui/wc/data-entry/ButtonAction";
import type { defineButtonAction } from "@peaui/ui/wc/data-entry/ButtonAction";
import type CopyButtonElement from "@peaui/ui/wc/data-entry/CopyButton";
import type { defineCopyButton } from "@peaui/ui/wc/data-entry/CopyButton";
import type KeyboardKeyElement from "@peaui/ui/wc/data-display/KeyboardKey";
import type { defineKeyboardKey } from "@peaui/ui/wc/data-display/KeyboardKey";
import type CommandPaletteElement from "@peaui/ui/wc/navigation/CommandPalette";
import type { defineCommandPalette } from "@peaui/ui/wc/navigation/CommandPalette";
import type ToggleButtonElement from "@peaui/ui/wc/data-entry/ToggleButton";
import type { defineToggleButton } from "@peaui/ui/wc/data-entry/ToggleButton";
import type ToggleGroupElement from "@peaui/ui/wc/data-entry/ToggleGroup";
import type { defineToggleGroup } from "@peaui/ui/wc/data-entry/ToggleGroup";
import type SegmentedControlElement from "@peaui/ui/wc/data-entry/SegmentedControl";
import type { defineSegmentedControl } from "@peaui/ui/wc/data-entry/SegmentedControl";
import type SplitButtonElement from "@peaui/ui/wc/data-entry/SplitButton";
import type { defineSplitButton } from "@peaui/ui/wc/data-entry/SplitButton";
import type TransferListElement from "@peaui/ui/wc/data-entry/TransferList";
import type { defineTransferList } from "@peaui/ui/wc/data-entry/TransferList";
import type ScrollAreaElement from "@peaui/ui/wc/layout/ScrollArea";
import type { defineScrollArea } from "@peaui/ui/wc/layout/ScrollArea";
import type FormTimePickerElement from "@peaui/ui/wc/form/FormTimePicker";
import type { defineFormTimePicker } from "@peaui/ui/wc/form/FormTimePicker";
import type FormDateTimePickerElement from "@peaui/ui/wc/form/FormDateTimePicker";
import type { defineFormDateTimePicker } from "@peaui/ui/wc/form/FormDateTimePicker";
import type FormDateRangePickerElement from "@peaui/ui/wc/form/FormDateRangePicker";
import type { defineFormDateRangePicker } from "@peaui/ui/wc/form/FormDateRangePicker";
import type FormColorPickerElement from "@peaui/ui/wc/form/FormColorPicker";
import type { defineFormColorPicker } from "@peaui/ui/wc/form/FormColorPicker";
import type FormPinInputElement from "@peaui/ui/wc/form/FormPinInput";
import type { defineFormPinInput } from "@peaui/ui/wc/form/FormPinInput";
import type FormRatingInputElement from "@peaui/ui/wc/form/FormRatingInput";
import type { defineFormRatingInput } from "@peaui/ui/wc/form/FormRatingInput";
import type FormTagsInputElement from "@peaui/ui/wc/form/FormTagsInput";
import type { defineFormTagsInput } from "@peaui/ui/wc/form/FormTagsInput";
import {
  PEAUI_WEB_COMPONENT_TAG_NAMES,
  type PeauiWebComponentTagName,
} from "@peaui/ui/web-components";

type PublicWebComponent = InstanceType<typeof ButtonActionElement>;
type DefineWebComponent = typeof defineButtonAction;
type PublicCopyButtonWebComponent = InstanceType<typeof CopyButtonElement>;
type DefineCopyButtonWebComponent = typeof defineCopyButton;
type PublicKeyboardKeyWebComponent = InstanceType<typeof KeyboardKeyElement>;
type DefineKeyboardKeyWebComponent = typeof defineKeyboardKey;
type PublicCommandPaletteWebComponent = InstanceType<
  typeof CommandPaletteElement
>;
type DefineCommandPaletteWebComponent = typeof defineCommandPalette;
type PublicToggleWebComponent = InstanceType<typeof ToggleButtonElement>;
type DefineToggleWebComponent = typeof defineToggleButton;
type PublicToggleGroupWebComponent = InstanceType<typeof ToggleGroupElement>;
type DefineToggleGroupWebComponent = typeof defineToggleGroup;
type PublicSegmentedControlWebComponent = InstanceType<
  typeof SegmentedControlElement
>;
type DefineSegmentedControlWebComponent = typeof defineSegmentedControl;
type PublicSplitButtonWebComponent = InstanceType<typeof SplitButtonElement>;
type DefineSplitButtonWebComponent = typeof defineSplitButton;
type PublicTransferListWebComponent = InstanceType<typeof TransferListElement>;
type DefineTransferListWebComponent = typeof defineTransferList;
type PublicScrollAreaWebComponent = InstanceType<typeof ScrollAreaElement>;
type DefineScrollAreaWebComponent = typeof defineScrollArea;
type PublicFormTimePickerWebComponent = InstanceType<
  typeof FormTimePickerElement
>;
type DefineFormTimePickerWebComponent = typeof defineFormTimePicker;
type PublicFormDateTimePickerWebComponent = InstanceType<
  typeof FormDateTimePickerElement
>;
type DefineFormDateTimePickerWebComponent = typeof defineFormDateTimePicker;
type PublicFormDateRangePickerWebComponent = InstanceType<
  typeof FormDateRangePickerElement
>;
type DefineFormDateRangePickerWebComponent = typeof defineFormDateRangePicker;
type PublicFormColorPickerWebComponent = InstanceType<
  typeof FormColorPickerElement
>;
type DefineFormColorPickerWebComponent = typeof defineFormColorPicker;
type PublicFormPinInputWebComponent = InstanceType<typeof FormPinInputElement>;
type DefineFormPinInputWebComponent = typeof defineFormPinInput;
type PublicFormRatingInputWebComponent = InstanceType<
  typeof FormRatingInputElement
>;
type DefineFormRatingInputWebComponent = typeof defineFormRatingInput;
type PublicFormTagsInputWebComponent = InstanceType<
  typeof FormTagsInputElement
>;
type DefineFormTagsInputWebComponent = typeof defineFormTagsInput;
const webComponentTagName: PeauiWebComponentTagName = "peaui-form-input";

const publicEntries = [
  ButtonAction,
  CopyButton,
  CommandPalette,
  KeyboardKey,
  FormInput,
  FormTimePicker,
  FormDateTimePicker,
  FormDateRangePicker,
  FormColorPicker,
  FormPinInput,
  FormRatingInput,
  FormTagsInput,
  ReactButtonAction,
  ReactCopyButton,
  ReactCommandPalette,
  ReactKeyboardKey,
  ReactToggleButton,
  ReactToggleGroup,
  ReactTransferList,
  ReactScrollArea,
  ReactFormInput,
  ReactFormTimePicker,
  ReactFormDateTimePicker,
  ReactFormDateRangePicker,
  ReactFormColorPicker,
  ReactFormPinInput,
  ReactFormRatingInput,
  ReactFormTagsInput,
  ReactSegmentedControl,
  ReactSplitButton,
  LegacyButtonAction,
  LegacyCopyButton,
  LegacyCommandPalette,
  LegacyKeyboardKey,
  LegacyToggleButton,
  LegacyToggleGroup,
  LegacyTransferList,
  LegacyScrollArea,
  LegacySegmentedControl,
  LegacySplitButton,
  LegacyFormTimePicker,
  LegacyFormDateTimePicker,
  LegacyFormDateRangePicker,
  LegacyFormColorPicker,
  LegacyFormPinInput,
  LegacyFormRatingInput,
  LegacyFormTagsInput,
  SegmentedControl,
  SplitButton,
  ToggleButton,
  ToggleGroup,
  TransferList,
  ScrollArea,
  VueButtonAction,
  VueCopyButton,
  VueCommandPalette,
  VueKeyboardKey,
  VueToggleButton,
  VueToggleGroup,
  VueTransferList,
  VueScrollArea,
  VueSegmentedControl,
  VueSplitButton,
  VueFormTimePicker,
  VueFormDateTimePicker,
  VueFormDateRangePicker,
  VueFormColorPicker,
  VueFormPinInput,
  VueFormRatingInput,
  VueFormTagsInput,
] as const;

declare const tree: TreeListType;
declare const webComponent: PublicWebComponent;
declare const defineWebComponent: DefineWebComponent;
declare const copyButtonProps: CopyButtonProps;
declare const commandPaletteProps: CommandPaletteProps;
declare const commandPaletteWebComponent: PublicCommandPaletteWebComponent;
declare const defineCommandPaletteWebComponent: DefineCommandPaletteWebComponent;
declare const copyButtonWebComponent: PublicCopyButtonWebComponent;
declare const defineCopyButtonWebComponent: DefineCopyButtonWebComponent;
declare const keyboardKeyPlatform: KeyboardKeyPlatform;
declare const keyboardKeyProps: KeyboardKeyProps;
declare const keyboardKeyWebComponent: PublicKeyboardKeyWebComponent;
declare const defineKeyboardKeyWebComponent: DefineKeyboardKeyWebComponent;
declare const toggleProps: ToggleButtonProps;
declare const toggleGroupItem: ToggleGroupItem;
declare const toggleGroupProps: ToggleGroupProps;
declare const transferListItem: TransferListItem;
declare const transferListProps: TransferListProps;
declare const scrollAreaProps: ScrollAreaProps;
declare const scrollAreaHandle: ScrollAreaHandle;
declare const segmentedControlItem: SegmentedControlItem;
declare const segmentedControlProps: SegmentedControlProps;
declare const splitButtonItem: SplitButtonItem;
declare const splitButtonProps: SplitButtonProps;
declare const formTimePickerProps: FormTimePickerProps;
declare const formDateTimePickerProps: FormDateTimePickerProps;
declare const formDateRangePickerProps: FormDateRangePickerProps;
declare const formColorPickerProps: FormColorPickerProps;
declare const formPinInputProps: FormPinInputProps;
declare const formRatingInputProps: FormRatingInputProps;
declare const formTagsInputProps: FormTagsInputProps;
declare const toggleWebComponent: PublicToggleWebComponent;
declare const defineToggleWebComponent: DefineToggleWebComponent;
declare const toggleGroupWebComponent: PublicToggleGroupWebComponent;
declare const defineToggleGroupWebComponent: DefineToggleGroupWebComponent;
declare const segmentedControlWebComponent: PublicSegmentedControlWebComponent;
declare const defineSegmentedControlWebComponent: DefineSegmentedControlWebComponent;
declare const splitButtonWebComponent: PublicSplitButtonWebComponent;
declare const defineSplitButtonWebComponent: DefineSplitButtonWebComponent;
declare const transferListWebComponent: PublicTransferListWebComponent;
declare const defineTransferListWebComponent: DefineTransferListWebComponent;
declare const scrollAreaWebComponent: PublicScrollAreaWebComponent;
declare const defineScrollAreaWebComponent: DefineScrollAreaWebComponent;
declare const formTimePickerWebComponent: PublicFormTimePickerWebComponent;
declare const defineFormTimePickerWebComponent: DefineFormTimePickerWebComponent;
declare const formDateTimePickerWebComponent: PublicFormDateTimePickerWebComponent;
declare const defineFormDateTimePickerWebComponent: DefineFormDateTimePickerWebComponent;
declare const formDateRangePickerWebComponent: PublicFormDateRangePickerWebComponent;
declare const defineFormDateRangePickerWebComponent: DefineFormDateRangePickerWebComponent;
declare const formColorPickerWebComponent: PublicFormColorPickerWebComponent;
declare const defineFormColorPickerWebComponent: DefineFormColorPickerWebComponent;
declare const formPinInputWebComponent: PublicFormPinInputWebComponent;
declare const defineFormPinInputWebComponent: DefineFormPinInputWebComponent;
declare const formRatingInputWebComponent: PublicFormRatingInputWebComponent;
declare const defineFormRatingInputWebComponent: DefineFormRatingInputWebComponent;
declare const formTagsInputWebComponent: PublicFormTagsInputWebComponent;
declare const defineFormTagsInputWebComponent: DefineFormTagsInputWebComponent;

void publicEntries;
void tree;
void webComponent;
void defineWebComponent;
void copyButtonProps;
void commandPaletteProps;
void commandPaletteWebComponent;
void defineCommandPaletteWebComponent;
void copyButtonWebComponent;
void defineCopyButtonWebComponent;
void keyboardKeyPlatform;
void keyboardKeyProps;
void keyboardKeyWebComponent;
void defineKeyboardKeyWebComponent;
void toggleProps;
void toggleGroupItem;
void toggleGroupProps;
void transferListItem;
void transferListProps;
void scrollAreaProps;
void scrollAreaHandle;
void segmentedControlItem;
void segmentedControlProps;
void splitButtonItem;
void splitButtonProps;
void formTimePickerProps;
void formDateTimePickerProps;
void formDateRangePickerProps;
void formColorPickerProps;
void formPinInputProps;
void formRatingInputProps;
void formTagsInputProps;
void toggleWebComponent;
void defineToggleWebComponent;
void toggleGroupWebComponent;
void defineToggleGroupWebComponent;
void segmentedControlWebComponent;
void defineSegmentedControlWebComponent;
void splitButtonWebComponent;
void defineSplitButtonWebComponent;
void transferListWebComponent;
void defineTransferListWebComponent;
void scrollAreaWebComponent;
void defineScrollAreaWebComponent;
void formTimePickerWebComponent;
void defineFormTimePickerWebComponent;
void formDateTimePickerWebComponent;
void defineFormDateTimePickerWebComponent;
void formDateRangePickerWebComponent;
void defineFormDateRangePickerWebComponent;
void formColorPickerWebComponent;
void defineFormColorPickerWebComponent;
void formPinInputWebComponent;
void defineFormPinInputWebComponent;
void formRatingInputWebComponent;
void defineFormRatingInputWebComponent;
void formTagsInputWebComponent;
void defineFormTagsInputWebComponent;
void PEAUI_WEB_COMPONENT_TAG_NAMES;
void webComponentTagName;
