import { ERROR_MESSAGES } from '@/constants/error.const';

export type FormFileUploadValue = { file: File; image: string };
export type FileUploadValueMode = 'object' | 'file';

export function getUploadFile(value: unknown): File | undefined {
  if (typeof File === 'undefined') return undefined;
  if (value instanceof File) return value;
  if (typeof value === 'object' && value !== null && 'file' in value && value.file instanceof File)
    return value.file;
  return undefined;
}

export function validateUploadFile(
  file: File,
  types: readonly string[],
  maximum: number,
  image = false,
): string | undefined {
  if (!types.includes(file.type))
    return image ? ERROR_MESSAGES.photoFormat : ERROR_MESSAGES.fileFormat;
  if (file.size > maximum) return image ? ERROR_MESSAGES.photoSize : ERROR_MESSAGES.fileSize;
  return undefined;
}

export function readUploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error(ERROR_MESSAGES.photoFormat));
    reader.onerror = () => reject(reader.error ?? new Error(ERROR_MESSAGES.photoFormat));
    reader.readAsDataURL(file);
  });
}
