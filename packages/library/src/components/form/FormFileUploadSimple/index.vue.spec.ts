import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';

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
    ariaLabel: { type: String, required: false },
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

import FormFileUploadSimple from './index.vue';

function createFileList(files: File[]): FileList {
  return {
    ...files,
    length: files.length,
    item: (index: number) => files[index] ?? null,
  } as unknown as FileList;
}

function mountComponent(props: Record<string, unknown> = {}) {
  let wrapper: ReturnType<typeof mount>;

  wrapper = mount(FormFileUploadSimple, {
    props: {
      files: [],
      dataTestId: 'form-file-upload-simple',
      'onUpdate:files': async (files: File[]) => {
        await wrapper.setProps({ files });
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

describe('FormFileUploadSimple (index.vue)', () => {
  it('renders upload area with BEM root class, accessible input and visual button', () => {
    const wrapper = mountComponent();

    expect(wrapper.get('[data-testid="form-file-upload-simple"]').classes()).toContain(
      'peaui-form-file-upload-simple',
    );
    expect(wrapper.get('[data-testid="form-file-upload-simple-upload"]').exists()).toBe(true);
    expect(
      wrapper.get('[data-testid="form-file-upload-simple-button"]').attributes('data-size'),
    ).toBe('xs');

    const input = wrapper.get('[data-testid="form-file-upload-simple-input"]');

    expect(input.attributes('type')).toBe('file');
    expect(input.attributes('multiple')).toBeDefined();
    expect(input.attributes('accept')).toBe(
      'application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/jpg,image/png',
    );
    expect(input.attributes('aria-label')).toBe('Wgraj pliki');
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(input.attributes('aria-describedby')).toContain(
      'peaui-form-file-upload-simple-description-',
    );

    const button = wrapper.get('[data-testid="form-file-upload-simple-button"]');
    expect(button.attributes('aria-hidden')).toBe('true');
    expect(button.attributes('tabindex')).toBe('-1');
  });

  it('emits only valid files and appends context without changing the rest of the list logic', async () => {
    const wrapper = mountComponent({
      context: 'attachments',
    });
    const input = wrapper.get('[data-testid="form-file-upload-simple-input"]');
    const validFile = new File(['photo'], 'photo.png', { type: 'image/png' });
    const invalidFile = new File(['archive'], 'archive.zip', { type: 'application/zip' });

    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: createFileList([validFile, invalidFile]),
    });

    await input.trigger('change');

    expect(wrapper.emitted('update:files')?.[0]?.[0]).toEqual([validFile]);
    expect(
      (wrapper.emitted('update:files')?.[0]?.[0]?.[0] as File & { context?: string }).context,
    ).toBe('attachments');
    expect(wrapper.text()).toContain('photo.png');
    expect(wrapper.text()).toContain('archive.zip');
    expect(wrapper.text()).toContain(ERROR_MESSAGES.fileFormat);
  });

  it('sets aria-invalid when at least one uploaded file is invalid', async () => {
    const wrapper = mountComponent();
    const input = wrapper.get('[data-testid="form-file-upload-simple-input"]');
    const invalidFile = new File(['archive'], 'archive.zip', { type: 'application/zip' });

    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: createFileList([invalidFile]),
    });

    await input.trigger('change');

    expect(
      wrapper.get('[data-testid="form-file-upload-simple-input"]').attributes('aria-invalid'),
    ).toBe('true');
    expect(wrapper.text()).toContain(ERROR_MESSAGES.fileFormat);
  });

  it('keeps existing backend-style file naming and size presentation', () => {
    const wrapper = mountComponent({
      files: [
        {
          name: '123e4567-e89b-42d3-a456-426614174000.pdf',
          originalName: 'umowa.pdf',
          fileSize: '2048',
        } as unknown as File,
      ],
    });

    expect(wrapper.text()).toContain('umowa.pdf');
    expect(wrapper.text()).toContain('2.00 KB');
  });

  it('removes file on click and on keyup.enter without mutating unrelated items', async () => {
    const firstFile = new File(['one'], 'one.pdf', { type: 'application/pdf' });
    const secondFile = new File(['two'], 'two.pdf', { type: 'application/pdf' });

    const wrapper = mountComponent({
      files: [firstFile, secondFile],
    });

    const removeButtons = wrapper.findAll('button[aria-label="Usun plik"]');

    await removeButtons[0]?.trigger('click');

    expect(wrapper.emitted('update:files')?.[0]?.[0]).toEqual([secondFile]);
    expect(wrapper.text()).not.toContain('one.pdf');
    expect(wrapper.text()).toContain('two.pdf');

    const remainingRemoveButton = wrapper.find('button[aria-label="Usun plik"]');
    await remainingRemoveButton.trigger('keyup', { key: 'Enter' });

    expect(wrapper.emitted('update:files')?.[1]?.[0]).toEqual([]);
    expect(wrapper.text()).not.toContain('two.pdf');
  });

  it('hides the input when disabled but still renders existing files list', () => {
    const wrapper = mountComponent({
      disabled: true,
      files: [new File(['document'], 'zalacznik.pdf', { type: 'application/pdf' })],
    });

    expect(wrapper.find('[data-testid="form-file-upload-simple-input"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('zalacznik.pdf');
  });
});
