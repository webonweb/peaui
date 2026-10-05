import { mount, flushPromises } from '@vue/test-utils';
import Upload from '../form/FormFileUpload/index.vue';
import Simple from '../form/FormFileUploadSimple/index.vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
const file = (name = 'a.png', type = 'image/png') => new File(['abc'], name, { type });

const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach((fn) => fn()));
describe('regressions: Vue uploads', () => {
  it('enforces maxFiles for a multiple-file selection', async () => {
    const wrapper = mount(Simple, { props: { files: [], maxFiles: 1 } });
    cleanups.push(() => wrapper.unmount());
    Object.defineProperty(wrapper.get('input').element, 'files', {
      value: [file(), file('b.png')],
    });
    await wrapper.get('input').trigger('change');
    expect(wrapper.emitted('update:files')?.at(-1)?.[0]).toHaveLength(1);
  });
  it('does not remove disabled files', async () => {
    const wrapper = mount(Simple, { props: { files: [file()], disabled: true } });
    cleanups.push(() => wrapper.unmount());
    await wrapper.get('.peaui-form-file-upload-simple__remove').trigger('click');
    expect(wrapper.emitted('update:files')).toBeUndefined();
  });
  it('supports explicit legacy file mode', async () => {
    const wrapper = mount(Upload, { props: { valueMode: 'file' } });
    cleanups.push(() => wrapper.unmount());
    const selected = file();
    Object.defineProperty(wrapper.get('input').element, 'files', { value: [selected] });
    await wrapper.get('input').trigger('change');
    await flushPromises();
    await vi.waitFor(() => expect(wrapper.emitted('update:file')?.at(-1)?.[0]).toBe(selected));
  });
});
