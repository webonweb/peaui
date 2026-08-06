import { mount } from '@vue/test-utils';
import { defineComponent, h, onMounted } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Component from './index.vue';

vi.mock('@/constants', () => ({ UIKIT_NAME: 'peaui' }));
vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));
vi.mock('vue-advanced-cropper/dist/style.css', () => ({}));

const cropperApi = {
  refresh: vi.fn(),
  reset: vi.fn(async () => {}),
  move: vi.fn(),
  zoom: vi.fn(),
  rotate: vi.fn(),
  flip: vi.fn(),
  getResult: vi.fn(() => ({
    canvas: {
      toBlob: (callback: (blob: Blob | null) => void) =>
        callback(new Blob(['photo'], { type: 'image/png' })),
      toDataURL: () => 'data:image/png;base64,mock-photo',
    },
    image: {
      transforms: {
        rotate: 90,
      },
    },
  })),
};

vi.mock('vue-advanced-cropper', () => {
  const CropperStub = defineComponent({
    name: 'Cropper',
    props: {
      src: {
        type: String,
        required: false,
      },
      defaultSize: {
        type: Function,
        required: false,
      },
      imageClass: {
        type: String,
        required: false,
      },
    },
    setup(props, { attrs, expose }) {
      expose(cropperApi);

      onMounted(() => {
        props.defaultSize?.({
          imageSize: {
            width: 1200,
            height: 800,
          },
        });
      });

      return () =>
        h('div', { ...attrs, 'data-cropper-src': props.src ?? '' }, [
          h('img', {
            class: props.imageClass,
            src: props.src ?? '',
          }),
        ]);
    },
  });

  return { Cropper: CropperStub };
});

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () => h('svg', { ...attrs, 'data-icon-name': props.name });
  },
});

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    ariaLabel: String,
    dataTestId: String,
    disabled: Boolean,
    type: String,
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: props.type ?? 'button',
          disabled: props.disabled,
          'aria-label': props.ariaLabel,
          'data-testid': props.dataTestId,
          onClick: (event: MouseEvent) => emit('click', event),
        },
        slots.default?.(),
      );
  },
});

const MessageTextStub = defineComponent({
  name: 'MessageText',
  props: {
    id: {
      type: String,
      required: true,
    },
    dataTestId: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          id: `${props.id}-info`,
          'data-testid': props.dataTestId,
        },
        slots.default?.(),
      );
  },
});

const SectionHeadingStub = defineComponent({
  name: 'SectionHeading',
  setup(_, { attrs, slots }) {
    return () => h('div', attrs, slots.title?.());
  },
});

const InputSliderStub = defineComponent({
  name: 'InputSlider',
  props: {
    ariaLabel: String,
    dataTestId: String,
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: 'range',
        name: props.name,
        value: props.value,
        'aria-label': props.ariaLabel,
        'data-testid': props.dataTestId,
        onInput: (event: Event) =>
          emit('update:value', Number((event.target as HTMLInputElement).value)),
      });
  },
});

function factory() {
  return mount(Component, {
    props: {
      dataTestId: 'photo-editor',
      image: {
        file: new File(['photo'], 'photo.png', { type: 'image/png' }),
        image: 'https://example.com/photo.png',
      },
    } as never,
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
        ButtonAction: ButtonActionStub,
        MessageText: MessageTextStub,
        SectionHeading: SectionHeadingStub,
        InputSlider: InputSliderStub,
      },
    },
  });
}

describe('PhotoEditior (index.vue)', () => {
  beforeEach(() => {
    cropperApi.refresh.mockClear();
    cropperApi.reset.mockClear();
    cropperApi.move.mockClear();
    cropperApi.zoom.mockClear();
    cropperApi.rotate.mockClear();
    cropperApi.flip.mockClear();
    cropperApi.getResult.mockClear();
  });

  it('renders editor structure, instruction and cropper source', () => {
    const wrapper = factory();

    expect(wrapper.get('[data-testid="photo-editor"]').classes()).toContain('peaui-photo-editior');
    expect(wrapper.get('[data-testid="photo-editor"]').attributes('aria-label')).toBe(
      'Edytor zdjęcia',
    );
    expect(wrapper.get('[data-testid="photo-editor-instruction"]').text()).toContain(
      'klawiszy strzalek',
    );
    expect(wrapper.get('[data-testid="photo-editor-cropper"]').attributes('data-cropper-src')).toBe(
      'https://example.com/photo.png',
    );
    expect(wrapper.get('[data-testid="photo-editor-scale"]').attributes('aria-label')).toBe(
      'Powieksz zdjecie',
    );
    expect(wrapper.get('[data-testid="photo-editor-workspace"]').attributes('tabindex')).toBe('0');
    expect(
      wrapper.get('[data-testid="photo-editor-workspace"]').attributes('aria-keyshortcuts'),
    ).toBe('ArrowUp ArrowDown ArrowLeft ArrowRight');
    expect(wrapper.get('.peaui-photo-editior__cropper-image').attributes('alt')).toBe('');
    expect(wrapper.get('.peaui-photo-editior__cropper-image').attributes('role')).toBe(
      'presentation',
    );
  });

  it('rotates image using cropper api after clicking toolbar button', async () => {
    const wrapper = factory();
    const rotateRightButton = wrapper.get('[data-testid="photo-editor-rotate-right"]');
    const rotateLeftButton = wrapper.get('[data-testid="photo-editor-rotate-left"]');

    expect(rotateRightButton.attributes('aria-label')).toBe('Obroc w prawo');
    expect(rotateLeftButton.attributes('aria-label')).toBe('Obroc w lewo');

    await rotateRightButton.trigger('click');

    expect(cropperApi.reset).toHaveBeenCalled();
    expect(cropperApi.rotate).toHaveBeenCalledWith(-90);
  });

  it('moves image inside cropper with keyboard arrows on workspace', async () => {
    const wrapper = factory();

    await wrapper.get('[data-testid="photo-editor-workspace"]').trigger('keydown', {
      key: 'ArrowRight',
    });

    expect(cropperApi.move).toHaveBeenCalledWith(-16, 0);

    await wrapper.get('[data-testid="photo-editor-workspace"]').trigger('keydown', {
      key: 'ArrowUp',
      shiftKey: true,
    });

    expect(cropperApi.move).toHaveBeenCalledWith(0, 48);
  });

  it("emits 'on:cancel' after clicking cancel button", async () => {
    const wrapper = factory();

    await wrapper.get('[data-testid="photo-editor-cancel"]').trigger('click');

    expect(wrapper.emitted('on:cancel')).toHaveLength(1);
  });

  it('emits updated image model after saving changes', async () => {
    const wrapper = factory();

    await wrapper.get('[data-testid="photo-editor-save"]').trigger('click');

    expect(wrapper.emitted('update:image')?.[0]?.[0]).toEqual(
      expect.objectContaining({
        image: 'data:image/png;base64,mock-photo',
      }),
    );
  });
});
