<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import { UIKIT_NAME } from '@/constants';
import { ERROR_MESSAGES } from '@/constants/error.const';
import { computed, ref, useAttrs, useId } from 'vue';

// COMPONENTS
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const FILES_TYPE_DICTIONARY: Record<string, string> = {
  'application/msword': 'DOC',
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'image/jpeg': 'JPEG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
};

const props = withDefaults(
  defineProps<{
    allowedTypes?: string[];
    context?: string;
    disabled?: boolean;
    maxFileSize?: number;
    maxFiles?: number;
    dataTestId?: string;
  }>(),
  {
    allowedTypes: () => [
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ],
    context: undefined,
    disabled: false,
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 4,
    dataTestId: undefined,
  },
);

const files = defineModel<File[]>('files', { required: true });
const attrs = useAttrs();
const uid = useId();
const inputElement = ref<HTMLInputElement | null>(null);
const validationError = ref<string | null>(null);
const classNameComponent = `${UIKIT_NAME}-form-file-upload-simple`;

const filesDummy = ref<Array<{ error: string | null; file: unknown }>>(
  (files.value ?? []).map((file) => ({ error: null, file })),
);

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const bindings = computed(() => ({
  ...attrs,
}));

const rootTestId = computed(() => props.dataTestId);
const uploadTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-upload` : undefined));
const inputTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-input` : undefined));
const buttonTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-button` : undefined));
const descriptionTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-description` : undefined,
);
const inputId = computed(() => `${classNameComponent}-input-${uid}`);
const descriptionId = computed(() => `${classNameComponent}-description-${uid}`);

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function formatBytes(bytes: number | string): string {
  const parsedBytes = Number(bytes);

  if (!Number.isFinite(parsedBytes) || parsedBytes === 0) {
    return '0 Bytes';
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const sizeIndex = Math.floor(Math.log(parsedBytes) / Math.log(1024));
  const size = parsedBytes / Math.pow(1024, sizeIndex);

  return `${size.toFixed(sizeIndex > 0 ? 2 : 0)} ${sizes[sizeIndex]}`;
}

function isUUIDv4(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getFileName(file: unknown): string {
  const fileRecord = file as {
    name?: string;
    originalName?: string;
  };
  const name = fileRecord?.name ?? '';
  const baseName = name.split('.').at(0) ?? '';

  if (isUUIDv4(baseName)) {
    return fileRecord.originalName ?? name;
  }

  return name;
}

function getFileSize(file: unknown): string | number | undefined {
  const fileRecord = file as {
    fileSize?: string | number;
    size?: number;
  };

  return fileRecord.size ?? fileRecord.fileSize;
}

function getFileSizeText(item: { error: string | null; file: unknown }): string {
  if (item.error) {
    return item.error;
  }

  const fileSize = getFileSize(item.file);

  if (!fileSize) {
    return '---';
  }

  return formatBytes(fileSize);
}

function getAllowedTypeLabel(type: string): string {
  return FILES_TYPE_DICTIONARY[type] ?? type;
}

const handleFileUpload = (event: Event) => {
  if (props.disabled) {
    return;
  }

  validationError.value = null;
  const target = event.target as HTMLInputElement;
  const documents = target.files;

  if (!documents || documents.length === 0) {
    return;
  }

  let iterate = filesDummy.value.length;

  Array.from(documents).forEach((file) => {
    let error: string | null = null;

    if (!props.allowedTypes.includes(file.type)) {
      error = ERROR_MESSAGES.fileFormat;
    }

    if (file.size > props.maxFileSize) {
      error = ERROR_MESSAGES.fileSize;
    }

    if (error && !validationError.value) {
      validationError.value = error;
    }

    const exist = filesDummy.value.find(
      (item) => ((item.file as { name?: string })?.name ?? '') === file.name,
    );

    if (iterate <= props.maxFiles && !exist) {
      iterate += 1;

      filesDummy.value.push({
        error,
        file,
      });
    }
  });

  if (inputElement.value) {
    files.value = filesDummy.value
      .filter((fileItem) => !fileItem.error)
      .map((fileItem) => {
        if (props.context) {
          (fileItem.file as File & { context?: string }).context = props.context;
        }

        return fileItem.file;
      }) as File[];

    inputElement.value.value = '';
  }
};

const handleRemoveFile = (file: File) => {
  files.value = files.value.filter((item) => item.name !== file.name);
  filesDummy.value = filesDummy.value.filter(
    (item) => ((item.file as { name?: string })?.name ?? '') !== file.name,
  );
};
</script>

<template>
  <div v-bind="bindings" :class="classNameComponent" :data-testid="rootTestId" aria-live="polite">
    <div
      v-if="files.length <= props.maxFiles"
      :class="`${classNameComponent}__upload`"
      :data-testid="uploadTestId"
    >
      <input
        v-if="!props.disabled"
        :id="inputId"
        ref="inputElement"
        :class="`${classNameComponent}__input`"
        :accept="props.allowedTypes.join(',')"
        :aria-describedby="descriptionId"
        :aria-invalid="validationError ? 'true' : 'false'"
        aria-label="Wgraj pliki"
        :disabled="props.disabled"
        multiple
        :data-testid="inputTestId"
        type="file"
        @change="handleFileUpload"
      />

      <SvgIcon :class="`${classNameComponent}__icon`" name="download" />

      <div :class="`${classNameComponent}__content`">
        <p :class="`${classNameComponent}__title`">Przeciagnij i upusc plik tutaj lub przeslij</p>
        <p
          :id="descriptionId"
          :class="`${classNameComponent}__description`"
          :data-testid="descriptionTestId"
        >
          Format pliku:
          <span
            v-for="(type, index) in props.allowedTypes"
            :key="type"
            :class="`${classNameComponent}__type`"
          >
            {{ getAllowedTypeLabel(type) }}
            <span v-if="index < props.allowedTypes.length - 1">,</span>
          </span>
          <br />
          Rozmiar pliku: maksimum {{ formatBytes(props.maxFileSize) }}
        </p>
      </div>

      <ButtonAction
        :class="`${classNameComponent}__button`"
        aria-hidden="true"
        aria-label="Wgraj pliki"
        :data-test-id="buttonTestId"
        :disabled="props.disabled"
        size="xs"
        tabindex="-1"
      >
        Wgraj
      </ButtonAction>
    </div>

    <div
      v-for="item in filesDummy"
      :key="getFileName(item.file)"
      :class="[
        `${classNameComponent}__item`,
        {
          [`${classNameComponent}__item--error`]: item.error,
        },
      ]"
      role="status"
      aria-atomic="true"
    >
      <SvgIcon :class="`${classNameComponent}__item-icon`" name="file" />

      <div :class="`${classNameComponent}__item-body`">
        <div
          :class="[
            `${classNameComponent}__item-text`,
            {
              [`${classNameComponent}__item-text--error`]: item.error,
            },
          ]"
        >
          <span :class="`${classNameComponent}__item-name`">
            {{ getFileName(item.file) }}
          </span>
          <br />
          {{ getFileSizeText(item) }}
        </div>

        <div>
          <button
            :class="`${classNameComponent}__remove`"
            aria-label="Usun plik"
            type="button"
            @click.prevent="handleRemoveFile(item.file as File)"
            @keyup.enter.prevent="handleRemoveFile(item.file as File)"
          >
            <SvgIcon :class="`${classNameComponent}__remove-icon`" name="trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
