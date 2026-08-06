<script lang="ts">
export interface PhotoType {
  file: File;
  image: string;
}

export interface ImageEditorTransform {
  flip: {
    x: number;
    y: number;
  };
  align: number;
  rotate: number;
  scale: number;
}
</script>

<script setup lang="ts">
// LIBRARIES
//-----------------------------------------------------------------------------------------------//
import SvgIcon from '@/components/basic/SvgIcon/index.vue';
import SectionHeading from '@/components/data-display/SectionHeading/index.vue';
import ButtonAction from '@/components/data-entry/ButtonAction/index.vue';
import InputSlider from '@/components/data-entry/InputSlider/index.vue';
import MessageText from '@/components/feedback/MessageText/index.vue';
import { UIKIT_NAME } from '@/constants';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { Cropper } from 'vue-advanced-cropper';

// TYPES
//-----------------------------------------------------------------------------------------------//
type TransformType = 'scale' | 'align' | 'rotate' | 'flip';
type ReassignTransformType = 'flip' | 'scale' | 'align';

type CropperResult = {
  canvas?: HTMLCanvasElement | null;
  image: {
    transforms: {
      rotate: number;
    };
  };
};

type CropperInstance = {
  refresh: () => void;
  reset: () => Promise<void> | void;
  move: (left: number, top?: number) => void;
  zoom: (factor: number) => void;
  rotate: (angle: number) => void;
  flip: (x: number, y: number) => void;
  getResult: () => CropperResult;
};

// CONSTANTS
//-----------------------------------------------------------------------------------------------//
const INSTRUCTION_TEXT =
  'Przeciagnij zdjecie wewnatrz ramki albo uzyj klawiszy strzalek, aby zmienic jego polozenie.';
const KEYBOARD_MOVE_STEP = 16;
const KEYBOARD_MOVE_STEP_WITH_MODIFIER = 48;

// VARIABLES
//-----------------------------------------------------------------------------------------------//
const { ariaLabel = 'Edytor zdjęcia', dataTestId } = defineProps<{
  ariaLabel?: string;
  dataTestId?: string;
}>();

const imageModelValue = defineModel<PhotoType | undefined>('image', {
  required: false,
});

const emit = defineEmits<{
  (e: 'on:cancel'): void;
}>();

const classNameComponent = `${UIKIT_NAME}-photo-editior`;
const uid = useId();
const cropper = ref<CropperInstance | null>(null);
const workspace = ref<HTMLElement | null>(null);
const cropperImageObserver = ref<MutationObserver | null>(null);
const imageOptions = ref<{ width: number; height: number } | null>(null);
const transformImage = ref<ImageEditorTransform>({
  flip: {
    x: 0,
    y: 0,
  },
  align: 0.5,
  scale: 0,
  rotate: 0,
});

// COMPUTED PROPERTIES
//-----------------------------------------------------------------------------------------------//
const cropperSource = computed(() => imageModelValue.value?.image ?? null);
const isTallImage = computed(() => Boolean(imageOptions.value && imageOptions.value.height > 500));
const workspaceClasses = computed(() => [
  `${classNameComponent}__workspace`,
  isTallImage.value
    ? `${classNameComponent}__workspace--fixed-height`
    : `${classNameComponent}__workspace--max-height`,
]);

const instructionId = computed(() => `${classNameComponent}-instruction-${uid}`);
const instructionMessageId = computed(() => `${instructionId.value}-info`);
const workspaceTestId = computed(() => (dataTestId ? `${dataTestId}-workspace` : undefined));
const rotateGroupTestId = computed(() => (dataTestId ? `${dataTestId}-rotate` : undefined));
const scaleSliderTestId = computed(() => (dataTestId ? `${dataTestId}-scale` : undefined));
const alignSliderTestId = computed(() => (dataTestId ? `${dataTestId}-align` : undefined));
const actionsTestId = computed(() => (dataTestId ? `${dataTestId}-actions` : undefined));
const rotateRightTestId = computed(() => (dataTestId ? `${dataTestId}-rotate-right` : undefined));
const rotateLeftTestId = computed(() => (dataTestId ? `${dataTestId}-rotate-left` : undefined));
const saveTestId = computed(() => (dataTestId ? `${dataTestId}-save` : undefined));
const cancelTestId = computed(() => (dataTestId ? `${dataTestId}-cancel` : undefined));
const workspaceKeyboardShortcuts = 'ArrowUp ArrowDown ArrowLeft ArrowRight';

// FUNCTIONS
//-----------------------------------------------------------------------------------------------//
const applyCropperImageAccessibility = () => {
  const images = workspace.value?.querySelectorAll<HTMLImageElement>('img');

  if (!images?.length) {
    return;
  }

  images.forEach((image) => {
    image.setAttribute('alt', '');
    image.setAttribute('role', 'presentation');
    image.setAttribute('aria-hidden', 'true');
  });
};

const observeCropperImage = () => {
  cropperImageObserver.value?.disconnect();

  if (!workspace.value) {
    return;
  }

  cropperImageObserver.value = new MutationObserver(() => {
    applyCropperImageAccessibility();
  });

  cropperImageObserver.value.observe(workspace.value, {
    childList: true,
    subtree: true,
  });

  applyCropperImageAccessibility();
};

watch(imageOptions, () => {
  cropper.value?.refresh();
});

watch(cropperSource, async () => {
  await nextTick();
  applyCropperImageAccessibility();
});

onMounted(() => {
  observeCropperImage();
});

onBeforeUnmount(() => {
  cropperImageObserver.value?.disconnect();
});

const defaultSize = ({ imageSize }: { imageSize: { width: number; height: number } }) => {
  imageOptions.value = imageSize;

  return {
    width: imageSize.width - 500,
    height: imageSize.height - 500,
  };
};

const assignTransformImage = (type: ReassignTransformType[]) => {
  if (!cropper.value) return;

  if (type.includes('flip')) {
    cropper.value.flip(transformImage.value.flip.x, transformImage.value.flip.y);
  }

  if (type.includes('scale')) {
    cropper.value.zoom(transformImage.value.scale + 1);
  }

  if (type.includes('align')) {
    let param = transformImage.value.align * 100 - 50;
    param = param >= 50 ? 50 : param <= -50 ? -50 : param;

    cropper.value.rotate(param);
  }
};

const handleResetTransform = () => {
  if (!cropper.value) return;

  cropper.value.rotate(transformImage.value.rotate);
  cropper.value.zoom(1);
  cropper.value.flip(0, 0);

  assignTransformImage(['align']);
};

const handleTransformImage = async (type: TransformType, value: number | number[]) => {
  if (!cropper.value) return;

  await cropper.value.reset();
  handleResetTransform();

  switch (type) {
    case 'scale': {
      const scaleValue = value as number;
      cropper.value.zoom(scaleValue + 1);
      transformImage.value.scale = scaleValue;
      assignTransformImage(['flip', 'align']);
      break;
    }

    case 'align': {
      const alignValue = value as number;
      let param = alignValue * 100 - 50;
      param = param >= 50 ? 50 : param <= -50 ? -50 : param;

      transformImage.value.align = alignValue;
      cropper.value.rotate(param);
      assignTransformImage(['flip', 'scale']);
      break;
    }

    case 'rotate': {
      cropper.value.rotate(value as number);
      const results = cropper.value.getResult();
      transformImage.value.rotate = results.image.transforms.rotate as number;
      assignTransformImage(['flip', 'scale', 'align']);
      break;
    }

    case 'flip': {
      const [x = 0, y = 0] = value as number[];
      cropper.value.flip(x, y);
      transformImage.value.flip.x = x;
      transformImage.value.flip.y = y;
      assignTransformImage(['scale', 'align']);
      break;
    }
  }
};

const handleChangeSettings = () => {
  if (!cropper.value) return;

  const { canvas } = cropper.value.getResult();

  if (!canvas) return;

  canvas.toBlob((blob: Blob | null) => {
    if (!blob) return;

    const file = new File([blob], 'photo', { type: blob.type });

    imageModelValue.value = {
      file,
      image: canvas.toDataURL('image/png'),
    };
  });
};

const handleMoveImage = (left: number, top = 0) => {
  cropper.value?.move(left, top);
};

const handleWorkspaceKeydown = (event: KeyboardEvent) => {
  if (!cropper.value) {
    return;
  }

  const step = event.shiftKey ? KEYBOARD_MOVE_STEP_WITH_MODIFIER : KEYBOARD_MOVE_STEP;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      handleMoveImage(step, 0);
      return;
    case 'ArrowRight':
      event.preventDefault();
      handleMoveImage(-step, 0);
      return;
    case 'ArrowUp':
      event.preventDefault();
      handleMoveImage(0, step);
      return;
    case 'ArrowDown':
      event.preventDefault();
      handleMoveImage(0, -step);
      return;
    default:
      return;
  }
};
</script>

<template>
  <section :class="classNameComponent" :aria-label="ariaLabel" :data-testid="dataTestId">
    <MessageText
      :id="instructionId"
      variant="info"
      size="s"
      :class="`${classNameComponent}__instruction`"
      :dataTestId="dataTestId ? `${dataTestId}-instruction` : undefined"
    >
      {{ INSTRUCTION_TEXT }}
    </MessageText>

    <div
      ref="workspace"
      :class="workspaceClasses"
      role="group"
      aria-label="Podglad przycinania zdjecia"
      :aria-keyshortcuts="workspaceKeyboardShortcuts"
      :aria-describedby="instructionMessageId"
      tabindex="0"
      :data-testid="workspaceTestId"
      @keydown="handleWorkspaceKeydown"
    >
      <Cropper
        ref="cropper"
        :class="`${classNameComponent}__cropper`"
        :canvas="true"
        :debounce="false"
        :default-size="defaultSize"
        :src="cropperSource"
        :stencil-props="{
          handlers: {},
          movable: false,
          resizable: false,
        }"
        :stencil-size="{
          width: 745,
          height: 514,
        }"
        :transitions="false"
        image-class="peaui-photo-editior__cropper-image"
        image-restriction="stencil"
        :data-testid="dataTestId ? `${dataTestId}-cropper` : undefined"
      />
    </div>

    <div
      :class="`${classNameComponent}__toolbar`"
      role="group"
      aria-label="Obrot zdjecia"
      :data-testid="rotateGroupTestId"
    >
      <ButtonAction
        type="button"
        size="xs"
        variant="secondary"
        :class="`${classNameComponent}__toolbar-button`"
        ariaLabel="Obroc w prawo"
        :dataTestId="rotateRightTestId"
        @click.prevent="handleTransformImage('rotate', -90)"
      >
        Obroć w prawo
        <SvgIcon name="redo" />
      </ButtonAction>

      <ButtonAction
        type="button"
        size="xs"
        variant="secondary"
        :class="`${classNameComponent}__toolbar-button`"
        ariaLabel="Obroc w lewo"
        :dataTestId="rotateLeftTestId"
        @click.prevent="handleTransformImage('rotate', 90)"
      >
        Obroć w lewo
        <SvgIcon name="undo" />
      </ButtonAction>
    </div>

    <div :class="`${classNameComponent}__settings`">
      <div :class="`${classNameComponent}__setting`">
        <SectionHeading as="div" size="m" :class="`${classNameComponent}__setting-heading`">
          <template #title>Powiększ</template>
        </SectionHeading>

        <InputSlider
          name="photo-editor-scale"
          ariaLabel="Powieksz zdjecie"
          :value="transformImage.scale"
          :data-test-id="scaleSliderTestId"
          @update:value="(value: number) => handleTransformImage('scale', value)"
        />
      </div>

      <div :class="`${classNameComponent}__setting`">
        <SectionHeading as="div" size="m" :class="`${classNameComponent}__setting-heading`">
          <template #title>Wyrównaj</template>
        </SectionHeading>

        <InputSlider
          name="photo-editor-align"
          ariaLabel="Wyrownaj zdjecie"
          :value="transformImage.align"
          :data-test-id="alignSliderTestId"
          @update:value="(value: number) => handleTransformImage('align', value)"
        />
      </div>
    </div>

    <div
      :class="`${classNameComponent}__actions`"
      role="group"
      aria-label="Akcje edytora zdjecia"
      :data-testid="actionsTestId"
    >
      <ButtonAction
        type="button"
        size="xs"
        :class="`${classNameComponent}__action-button`"
        ariaLabel="Zapisz zmiany zdjecia"
        :dataTestId="saveTestId"
        @click.prevent="handleChangeSettings"
      >
        Zapisz
      </ButtonAction>

      <ButtonAction
        type="button"
        size="xs"
        variant="secondary"
        :class="`${classNameComponent}__action-button`"
        ariaLabel="Odrzuc zmiany zdjecia"
        :dataTestId="cancelTestId"
        @click.prevent="emit('on:cancel')"
      >
        Odrzuć
      </ButtonAction>
    </div>
  </section>
</template>
