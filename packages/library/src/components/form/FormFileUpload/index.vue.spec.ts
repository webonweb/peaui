import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/global.scss', () => ({}));
vi.mock('./styles.scss', () => ({}));

vi.mock('@/constants', () => ({
  UIKIT_NAME: 'peaui',
}));

import { ERROR_MESSAGES } from '@/constants/error.const';

const SvgIconStub = defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
  },
  setup(props, { attrs }) {
    return () =>
      h('svg', {
        ...attrs,
        'data-icon': props.name,
      });
  },
});

const ButtonActionStub = defineComponent({
  name: 'ButtonAction',
  props: {
    ariaLabel: { type: String, required: true },
    dataTestId: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    size: { type: String, required: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          class: ['peaui-button-action', attrs.class],
          disabled: props.disabled,
          'aria-label': props.ariaLabel,
          'data-testid': props.dataTestId,
          'data-size': props.size,
        },
        slots.default?.(),
      );
  },
});

class MockFileReader {
  public result: string | ArrayBuffer | null = null;
  public onload: null | (() => void) = null;

  readAsDataURL(): void {
    this.result = 'data:image/png;base64,mock-photo';
    this.onload?.();
  }
}

vi.stubGlobal('FileReader', MockFileReader);

import FormFileUpload from './index.vue';

function createFileList(files: File[]): FileList {
  return {
    ...files,
    length: files.length,
    item: (index: number) => files[index] ?? null,
  } as unknown as FileList;
}

function mountComponent(props: Record<string, unknown> = {}) {
  let wrapper: ReturnType<typeof mount>;

  wrapper = mount(FormFileUpload, {
    props: {
      file: undefined,
      dataTestId: 'form-file-upload',
      'onUpdate:file': async (file: unknown) => {
        await wrapper.setProps({ file });
      },
      ...props,
    },
    global: {
      stubs: {
        SvgIcon: SvgIconStub,
        ButtonAction: ButtonActionStub,
      },
    },
  });

  return wrapper;
}

describe('FormFileUpload (index.vue)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders placeholder state with accessible input and visual button', () => {
    const wrapper = mountComponent();

    expect(wrapper.get('[data-testid="form-file-upload"]').classes()).toContain(
      'peaui-form-file-upload',
    );
    expect(wrapper.get('[data-testid="form-file-upload-dropzone"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="form-file-upload-button"]').attributes('data-size')).toBe(
      'xs',
    );
    expect(wrapper.get('[data-icon="imageUpload"]').exists()).toBe(true);

    const input = wrapper.get('[data-testid="form-file-upload-input"]');

    expect(input.attributes('type')).toBe('file');
    expect(input.attributes('accept')).toBe('image/jpeg,image/png,image/jpg');
    expect(input.attributes('aria-label')).toBe('Wybierz zdjecie z dysku');
    expect(input.attributes('aria-invalid')).toBe('false');
  });

  it('sets validation error for unsupported file format', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('[data-testid="form-file-upload-input"]');
    const invalidFile = new File(['photo'], 'photo.pdf', { type: 'application/pdf' });

    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: createFileList([invalidFile]),
    });

    await input.trigger('change');

    expect(wrapper.get('[data-testid="form-file-upload-message"]').text()).toContain(
      ERROR_MESSAGES.photoFormat,
    );
    expect(wrapper.get('[data-icon="help"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="form-file-upload-input"]').attributes('aria-invalid')).toBe(
      'true',
    );
  });

  it('emits update:file with image preview after selecting valid image', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('[data-testid="form-file-upload-input"]');
    const validFile = new File(['photo'], 'photo.png', { type: 'image/png' });

    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: createFileList([validFile]),
    });

    await input.trigger('change');

    expect(wrapper.emitted('update:file')?.[0]?.[0]).toEqual(
      expect.objectContaining({
        file: validFile,
        image: 'data:image/png;base64,mock-photo',
      }),
    );
    expect(wrapper.get('[data-testid="form-file-upload-image"]').attributes('src')).toBe(
      'data:image/png;base64,mock-photo',
    );
  });

  it('renders preview from external file with image path', () => {
    const wrapper = mountComponent({
      file: {
        file: new File(['photo'], 'photo.png', { type: 'image/png' }),
        image: '/uploads/photo.png',
      },
    });

    expect(wrapper.get('[data-testid="form-file-upload-details"]').text()).toContain('photo.png');
    expect(wrapper.get('[data-icon="picture"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="form-file-upload-image"]').attributes('src')).toBe(
      '/uploads/photo.png',
    );
  });

  it('refreshes preview when parent mutates a reactive file object', async () => {
    const externalFile = ref({
      file: new File(['photo'], 'photo.png', { type: 'image/png' }),
      image: '/uploads/photo.png',
    });

    const HostComponent = defineComponent({
      components: {
        FormFileUpload,
      },
      setup() {
        return {
          externalFile,
        };
      },
      template: `
        <FormFileUpload
          v-model:file="externalFile"
          dataTestId="form-file-upload"
        />
      `,
    });

    const wrapper = mount(HostComponent, {
      global: {
        stubs: {
          SvgIcon: SvgIconStub,
          ButtonAction: ButtonActionStub,
        },
      },
    });

    externalFile.value.file = new File(['photo-edited'], 'photo-edited.png', {
      type: 'image/png',
    });
    externalFile.value.image = 'data:image/png;base64,edited-photo';

    await nextTick();

    expect(wrapper.get('[data-testid="form-file-upload-image"]').attributes('src')).toBe(
      'data:image/png;base64,edited-photo',
    );
    expect(wrapper.get('[data-testid="form-file-upload-details"]').text()).toContain(
      'photo-edited.png',
    );
  });

  it('emits on:remove and waits for parent reset to clear preview', async () => {
    const wrapper = mountComponent({
      file: {
        file: new File(['photo'], 'photo.png', { type: 'image/png' }),
        image: 'https://example.com/photo.png',
      },
    });

    await wrapper.get('[data-testid="form-file-upload-remove"]').trigger('click');

    expect(wrapper.emitted('on:remove')).toEqual([[]]);
    expect(wrapper.get('[data-testid="form-file-upload-preview"]').exists()).toBe(true);

    await wrapper.setProps({
      file: undefined,
    });

    expect(wrapper.find('[data-testid="form-file-upload-preview"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="form-file-upload-dropzone"]').exists()).toBe(true);
  });

  it('does not bind custom keyup.enter to remove button in preview state', async () => {
    const wrapper = mountComponent({
      file: {
        file: new File(['photo'], 'photo.png', { type: 'image/png' }),
        image: 'https://example.com/photo.png',
      },
    });

    await wrapper.get('[data-testid="form-file-upload-remove"]').trigger('keyup', { key: 'Enter' });

    expect(wrapper.emitted('on:remove')).toBeUndefined();
    expect(wrapper.get('[data-testid="form-file-upload-preview"]').exists()).toBe(true);
  });

  it('renders danger variant message and disables interactive controls', () => {
    const wrapper = mountComponent({
      variant: 'danger',
      disabled: true,
    });

    expect(wrapper.get('[data-testid="form-file-upload-message"]').text()).toContain(
      ERROR_MESSAGES.required,
    );
    expect(wrapper.find('[data-testid="form-file-upload-input"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="form-file-upload-button"]').attributes()).toHaveProperty(
      'disabled',
    );
  });
});
