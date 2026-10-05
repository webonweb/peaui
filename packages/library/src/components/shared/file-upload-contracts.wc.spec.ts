import { nextTick } from 'vue';
import Upload from '../form/FormFileUpload/index.wc';
import Simple from '../form/FormFileUploadSimple/index.wc';
import { afterEach, describe, expect, it, vi } from 'vitest';
const file = (name = 'a.png', type = 'image/png') => new File(['abc'], name, { type });

afterEach(() => document.body.replaceChildren());
describe('regressions: WC uploads', () => {
  it('enforces maxFiles and blocks disabled removal', async () => {
    const element = new Simple();
    Object.assign(element, { files: [], maxFiles: 1 });
    document.body.append(element);
    await nextTick();
    const changes = vi.fn();
    element.addEventListener('update:files', changes);
    Object.defineProperty(element.querySelector('input')!, 'files', {
      value: [file(), file('b.png')],
    });
    element.querySelector('input')!.dispatchEvent(new Event('change'));
    await nextTick();
    expect((changes.mock.calls.at(-1)?.[0] as CustomEvent<File[]>).detail).toHaveLength(1);
    Object.assign(element, { disabled: true });
    await nextTick();
    changes.mockClear();
    (element.querySelector('.peaui-form-file-upload-simple__remove') as HTMLButtonElement).click();
    expect(changes).not.toHaveBeenCalled();
  });
  it('supports explicit legacy file mode', async () => {
    const element = new Upload();
    Object.assign(element, { valueMode: 'file' });
    document.body.append(element);
    await nextTick();
    const changes = vi.fn();
    element.addEventListener('update:file', changes);
    const selected = file();
    Object.defineProperty(element.querySelector('input')!, 'files', { value: [selected] });
    element.querySelector('input')!.dispatchEvent(new Event('change'));
    await vi.waitFor(() =>
      expect((changes.mock.calls.at(-1)?.[0] as CustomEvent<File>)?.detail).toBe(selected),
    );
  });
});
