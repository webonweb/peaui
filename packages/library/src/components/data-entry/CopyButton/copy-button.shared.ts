import { ClipboardError, type ClipboardMethod } from '@/helpers/functions.helper';

export type CopyButtonContent = 'icon' | 'text' | 'icon-text';
export type CopyButtonSize = 'xxs' | 'xs' | 's' | 'm' | 'l';
export type CopyButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type CopyButtonStatus = 'idle' | 'copying' | 'copied' | 'error' | 'unsupported';
export type CopyButtonTextResolver = () => string | Promise<string>;
export type CopyButtonMethod = ClipboardMethod;

export type CopyButtonCopyDetail = Readonly<{
  text: string;
}>;

export type CopyButtonSuccessDetail = CopyButtonCopyDetail &
  Readonly<{
    method: CopyButtonMethod;
  }>;

export type CopyButtonErrorDetail = Readonly<{
  error: unknown;
  status: Extract<CopyButtonStatus, 'error' | 'unsupported'>;
  text?: string;
}>;

export type CopyButtonStatusSlotState = Readonly<{
  message: string;
  status: CopyButtonStatus;
}>;

export function resolveCopyButtonErrorStatus(
  error: unknown,
): Extract<CopyButtonStatus, 'error' | 'unsupported'> {
  return error instanceof ClipboardError && error.code === 'unavailable' ? 'unsupported' : 'error';
}

export function normalizeCopyButtonResetDelay(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 2000;
}
