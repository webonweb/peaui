<script lang="ts">
export type { FormFileUploadValue, FileUploadValueMode } from './file-upload.shared';

export type FormFileUploadVariant = 'primary' | 'danger';
</script>

<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import { UIKIT_NAME } from '@/constants';
import { ERROR_MESSAGES } from '@/constants/error.const';
import { computed, nextTick, ref, useAttrs, useId, onBeforeUnmount, watch } from 'vue';
import {
  getUploadFile,
  readUploadImage,
  validateUploadFile,
  type FormFileUploadValue,
  type FileUploadValueMode,
} from './file-upload.shared';

defineOptions({
  inheritAttrs: false,
});

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const props = withDefaults(
  defineProps<{
    allowedTypes?: string[];
    disabled?: boolean;
    maxFileSize?: number;
    variant?: FormFileUploadVariant;
    dataTestId?: string;
    valueMode?: FileUploadValueMode;
  }>(),
  {
    allowedTypes: () => ['image/jpeg', 'image/png', 'image/jpg'],
    disabled: false,
    maxFileSize: 5 * 1024 * 1024,
    variant: 'primary',
    dataTestId: undefined,
    valueMode: 'object',
  },
);

const attrs = useAttrs();
const uid = useId();
const inputElement = ref<HTMLInputElement | null>(null);
const parsedFileToImage = ref<string | null>(null);
const validationError = ref<string | null>(null);

const classNameComponent = `${UIKIT_NAME}-form-file-upload`;
const fileModel = defineModel<FormFileUploadValue | File | undefined>('file', {
  required: false,
});
let imageRequest = 0;
let previewFile: File | undefined;
onBeforeUnmount(() => {
  imageRequest += 1;
});
const modelValueImage = computed(() => {
  const file = getUploadFile(fileModel.value);
  if (!file) return undefined;
  return {
    file,
    image:
      fileModel.value && 'image' in fileModel.value
        ? fileModel.value.image
        : (parsedFileToImage.value ?? ''),
  };
});
watch(
  fileModel,
  async (value) => {
    if (typeof File === 'undefined' || !(value instanceof File) || value === previewFile) return;
    previewFile = value;
    parsedFileToImage.value = null;
    const request = ++imageRequest;
    try {
      const image = await readUploadImage(value);
      if (request === imageRequest) parsedFileToImage.value = image;
    } catch {
      /* The file remains usable even when its preview cannot be decoded. */
    }
  },
  { immediate: true },
);

const emit = defineEmits<{
  (e: 'on:remove'): void;
}>();

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const bindings = computed(() => ({
  ...attrs,
}));

const surfaceClasses = computed(() => [
  `${classNameComponent}__surface`,
  `${classNameComponent}__surface--${props.variant}`,
]);

const dropzoneIconName = computed(() =>
  !validationError.value && props.variant === 'primary' ? 'imageUpload' : 'help',
);

const dropzoneIconClasses = computed(() => [
  `${classNameComponent}__dropzone-icon`,
  !validationError.value && props.variant === 'primary'
    ? `${classNameComponent}__dropzone-icon--primary`
    : `${classNameComponent}__dropzone-icon--danger`,
]);

const descriptionId = computed(() => `${classNameComponent}-description-${uid}`);
const messageId = computed(() => `${classNameComponent}-message-${uid}`);
const inputDescribedBy = computed(() =>
  validationError.value || props.variant === 'danger'
    ? `${descriptionId.value} ${messageId.value}`
    : descriptionId.value,
);

const rootTestId = computed(() => props.dataTestId);
const surfaceTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-surface` : undefined,
);
const dropzoneTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-dropzone` : undefined,
);
const inputTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-input` : undefined));
const buttonTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-button` : undefined));
const messageTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-message` : undefined,
);
const previewTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-preview` : undefined,
);
const imageTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-image` : undefined));
const detailsTestId = computed(() =>
  props.dataTestId ? `${props.dataTestId}-details` : undefined,
);
const removeTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-remove` : undefined));

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
function formatBytes(bytes: number): string {
  if (bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const unitValue = bytes / 1024 ** unitIndex;
  const fractionDigits = unitValue >= 10 || unitIndex === 0 ? 0 : 1;

  return `${unitValue.toFixed(fractionDigits)} ${units[unitIndex]}`;
}

const handleFileUpload = async (event: Event) => {
  if (props.disabled) {
    return;
  }

  validationError.value = null;
  const target = event.target as HTMLInputElement;
  const document = target.files?.[0];

  if (!document) {
    return;
  }

  validationError.value =
    validateUploadFile(document, props.allowedTypes, props.maxFileSize, true) ?? null;
  if (validationError.value) return;

  void nextTick(() => transferFileToImage(document));

  if (inputElement.value) {
    inputElement.value.value = '';
  }
};

const transferFileToImage = async (file: File) => {
  const request = ++imageRequest;
  parsedFileToImage.value = null;
  try {
    const image = await readUploadImage(file);
    if (request !== imageRequest || props.disabled) return;
    previewFile = file;
    parsedFileToImage.value = image;
    fileModel.value = props.valueMode === 'file' ? file : { file, image };
  } catch {
    if (request === imageRequest) validationError.value = ERROR_MESSAGES.photoFormat;
  }
};

const handleRemoveFile = () => {
  emit('on:remove');
};
</script>

<template>
  <div v-bind="bindings" :class="classNameComponent" :data-testid="rootTestId">
    <div :class="surfaceClasses" :data-testid="surfaceTestId">
      <div
        v-if="!modelValueImage"
        :class="`${classNameComponent}__dropzone`"
        role="group"
        :aria-describedby="inputDescribedBy"
        :data-testid="dropzoneTestId"
      >
        <SvgIcon :class="dropzoneIconClasses" :name="dropzoneIconName" />

        <p
          v-if="validationError || props.variant === 'danger'"
          :id="messageId"
          :class="`${classNameComponent}__message`"
          role="status"
          aria-live="polite"
          :data-testid="messageTestId"
        >
          {{ validationError }}
          {{ props.variant === 'primary' ? '' : ERROR_MESSAGES.required }}
        </p>

        <div :class="`${classNameComponent}__actions`">
          <ButtonAction
            :class="`${classNameComponent}__button`"
            ariaLabel="Wybierz zdjecie z dysku"
            :dataTestId="buttonTestId"
            :disabled="props.disabled"
            size="xs"
            tabindex="-1"
            aria-hidden="true"
          >
            Wybierz zdjecie z dysku
          </ButtonAction>

          <p :class="`${classNameComponent}__actions-text`">lub przeciagnij i upusc tutaj</p>
        </div>

        <p :id="descriptionId" :class="`${classNameComponent}__description`">
          <span :class="`${classNameComponent}__description-line`"
            >Format zdjecia: JPEG, JPG lub PNG</span
          >
          <span :class="`${classNameComponent}__description-line`"
            >Rozmiar zdjecia: maksimum {{ formatBytes(props.maxFileSize) }}</span
          >
        </p>

        <input
          v-if="!props.disabled"
          ref="inputElement"
          :class="`${classNameComponent}__input`"
          :accept="props.allowedTypes.join(',')"
          :aria-describedby="inputDescribedBy"
          :aria-invalid="validationError ? 'true' : 'false'"
          :disabled="props.disabled"
          aria-label="Wybierz zdjecie z dysku"
          type="file"
          :data-testid="inputTestId"
          @change="handleFileUpload"
        />
      </div>

      <div v-else :class="`${classNameComponent}__preview`" :data-testid="previewTestId">
        <img
          :class="`${classNameComponent}__image`"
          :alt="modelValueImage.file.name"
          :src="modelValueImage.image"
          :data-testid="imageTestId"
        />
      </div>
    </div>

    <div
      v-if="modelValueImage"
      :class="`${classNameComponent}__details`"
      :data-testid="detailsTestId"
    >
      <div :class="`${classNameComponent}__details-main`">
        <SvgIcon :class="`${classNameComponent}__details-icon`" name="picture" />

        <div :class="`${classNameComponent}__details-text`">
          <p :class="`${classNameComponent}__details-name`">{{ modelValueImage.file.name }}</p>
          <p :class="`${classNameComponent}__details-size`">
            {{ formatBytes(modelValueImage.file.size) }}
          </p>
        </div>
      </div>

      <button
        v-if="!props.disabled"
        type="button"
        :class="`${classNameComponent}__remove`"
        aria-label="Usun zdjecie"
        :data-testid="removeTestId"
        @click.prevent="handleRemoveFile"
      >
        <SvgIcon :class="`${classNameComponent}__remove-icon`" name="trash" />
      </button>
    </div>
  </div>
</template>
