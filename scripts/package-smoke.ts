import {
  ButtonAction,
  FormInput,
  PhotoEditor,
  type TreeListType,
} from '@peaui/ui';
import ReactButtonAction from '@peaui/ui/react/data-entry/ButtonAction';
import ReactFormInput from '@peaui/ui/react/form/FormInput';
import ReactPhotoEditor from '@peaui/ui/react/basic/PhotoEditor';
import LegacyButtonAction from '@peaui/ui/data-entry/ButtonAction';
import VueButtonAction from '@peaui/ui/vue/data-entry/ButtonAction';
import type ButtonActionElement from '@peaui/ui/wc/data-entry/ButtonAction';
import type { defineButtonAction } from '@peaui/ui/wc/data-entry/ButtonAction';

type PublicWebComponent = InstanceType<typeof ButtonActionElement>;
type DefineWebComponent = typeof defineButtonAction;

const publicEntries = [
  ButtonAction,
  FormInput,
  PhotoEditor,
  ReactButtonAction,
  ReactFormInput,
  ReactPhotoEditor,
  LegacyButtonAction,
  VueButtonAction,
] as const;

declare const tree: TreeListType;
declare const webComponent: PublicWebComponent;
declare const defineWebComponent: DefineWebComponent;

void publicEntries;
void tree;
void webComponent;
void defineWebComponent;
