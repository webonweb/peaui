/** @jsxImportSource react */
import type { CSSProperties, ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { CopyButtonRuntimeRenderer } from '@/react/renderer-entries/copy-button.renderer-entry';

import type {
  CopyButtonContent,
  CopyButtonCopyDetail,
  CopyButtonErrorDetail,
  CopyButtonSize,
  CopyButtonStatus,
  CopyButtonStatusSlotState,
  CopyButtonSuccessDetail,
  CopyButtonTextResolver,
  CopyButtonVariant,
} from './copy-button.shared';

export type CopyButtonProps = {
  text?: string;
  getText?: CopyButtonTextResolver;
  resetDelay?: number;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  loadingLabel?: string;
  content?: CopyButtonContent;
  variant?: CopyButtonVariant;
  size?: CopyButtonSize;
  loading?: boolean;
  disabled?: boolean;
  showStatus?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  dataTestId?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode);
  icon?: ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode);
  copiedIcon?: ReactNode | ((state: CopyButtonStatusSlotState) => ReactNode);
  renderStatus?: (state: CopyButtonStatusSlotState) => ReactNode;
  onCopy?: (detail: CopyButtonCopyDetail) => void;
  onSuccess?: (detail: CopyButtonSuccessDetail) => void;
  onError?: (detail: CopyButtonErrorDetail) => void;
  onStatusChange?: (status: CopyButtonStatus) => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
};

export type {
  CopyButtonContent,
  CopyButtonCopyDetail,
  CopyButtonErrorDetail,
  CopyButtonMethod,
  CopyButtonSize,
  CopyButtonStatus,
  CopyButtonStatusSlotState,
  CopyButtonSuccessDetail,
  CopyButtonTextResolver,
  CopyButtonVariant,
} from './copy-button.shared';

const CopyButtonBase = createDirectReactComponent('CopyButton', CopyButtonRuntimeRenderer);
const CopyButton = CopyButtonBase as unknown as (
  props: CopyButtonProps & RefAttributes<HTMLElement>,
) => ReactElement | null;

export default CopyButton;
