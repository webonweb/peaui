/** @jsxImportSource react */
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import Upload from '../form/FormFileUpload';
import Simple from '../form/FormFileUploadSimple';
import { afterEach, describe, expect, it, vi } from 'vitest';
const file = (name = 'a.png', type = 'image/png') => new File(['abc'], name, { type });

afterEach(cleanup);
describe('regressions: React uploads', () => {
  it('emits the shared file/image model and supports the legacy file mode', async () => {
    for (const valueMode of ['object', 'file'] as const) {
      const change = vi.fn();
      const view = render(<Upload {...{ valueMode }} onFileChange={change} />);
      const selected = file();
      fireEvent.change(view.container.querySelector('input')!, { target: { files: [selected] } });
      await waitFor(() => expect(change).toHaveBeenCalled());
      expect(change.mock.calls.at(-1)?.[0]).toEqual(
        valueMode === 'file'
          ? selected
          : { file: selected, image: expect.stringMatching(/^data:image\/png;base64,/) },
      );
      view.unmount();
    }
  });
  it('reports rejected files without emitting a destructive replacement', async () => {
    const change = vi.fn();
    const { container } = render(<Upload onFileChange={change} />);
    fireEvent.change(container.querySelector('input')!, {
      target: { files: [file('bad.txt', 'text/plain')] },
    });
    expect(change).not.toHaveBeenCalled();
    expect(container.querySelector('[role="status"]')?.textContent).toMatch(/format/);
    expect(container.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
  });
  it('enforces maxFiles and prevents removing disabled files', () => {
    const change = vi.fn();
    const { container, rerender } = render(<Simple maxFiles={1} onFilesChange={change} />);
    fireEvent.change(container.querySelector('input')!, {
      target: { files: [file(), file('b.png')] },
    });
    expect(change.mock.calls.at(-1)?.[0]).toHaveLength(1);
    rerender(<Simple maxFiles={1} disabled onFilesChange={change} />);
    change.mockClear();
    fireEvent.click(container.querySelector('button.peaui-form-file-upload-simple__remove')!);
    expect(change).not.toHaveBeenCalled();
  });
});
