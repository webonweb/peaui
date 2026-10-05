/** @jsxImportSource react */
/* eslint-disable no-nested-ternary */
import {
  type RuntimeProps,
  text,
  useModel,
  num,
  common,
  cx,
  bool,
  callback,
} from './runtime.shared';
import {
  iconDownload,
  iconFile,
  iconHelp,
  iconImageUpload,
  iconPicture,
  iconTrash,
} from '../generated-static-icons';
import { type ForwardedRef, type ReactElement, useState, useEffect, useId, useRef } from 'react';
import { Svg } from './svg.renderer';
import {
  getUploadFile,
  readUploadImage,
  validateUploadFile,
} from '../../components/form/FormFileUpload/file-upload.shared';

export function FileRenderer({
  forwardedRef,
  ...props
}: RuntimeProps & { forwardedRef?: ForwardedRef<HTMLElement> }): ReactElement {
  const simple = text(props, '__name') === 'FormFileUploadSimple';
  const modelName = simple ? 'files' : 'file';
  const [value, setValue] = useModel<unknown>(props, modelName, simple ? [] : undefined);
  const files = (Array.isArray(value) ? value : [value]).flatMap((entry) => {
    const file = getUploadFile(entry);
    return file ? [file] : [];
  });
  const [validationError, setValidationError] = useState<string | undefined>();
  const uid = useId();
  const messageId = `${uid}-error`;
  const descriptionId = `${uid}-description`;
  const imageRequest = useRef(0);
  useEffect(
    () => () => {
      imageRequest.current += 1;
    },
    [],
  );
  useEffect(() => {
    if (props.disabled === true) imageRequest.current += 1;
  }, [props.disabled]);
  const defaultTypes = simple
    ? [
        'application/msword',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ]
    : ['image/jpeg', 'image/png', 'image/jpg'];
  const allowedTypes = Array.isArray(props.allowedTypes) ? props.allowedTypes : defaultTypes;
  const accept = allowedTypes.join(',');
  const maxFileSize = num(props, 'maxFileSize', 5 * 1024 * 1024);
  const maxFiles = num(props, 'maxFiles', 4);
  const selectedFile = files[0];
  const modelImage =
    !simple &&
    typeof value === 'object' &&
    value !== null &&
    'image' in value &&
    typeof value.image === 'string'
      ? value.image
      : '';
  const [previewUrl, setPreviewUrl] = useState('');
  useEffect(() => {
    if (modelImage) {
      setPreviewUrl(modelImage);
      return;
    }
    if (!selectedFile || typeof URL.createObjectURL !== 'function') {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile, modelImage]);
  const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const amount = bytes / 1024 ** index;
    const fractionDigits = simple ? (index > 0 ? 2 : 0) : amount >= 10 || index === 0 ? 0 : 1;
    return `${amount.toFixed(fractionDigits)} ${units[index]}`;
  };
  const typeLabels: Record<string, string> = {
    'application/msword': 'DOC',
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
    'image/png': 'PNG',
  };
  const updateFiles = (next: File[]): void => {
    if (bool(props, 'disabled')) return;
    const errors = next.map((file) => validateUploadFile(file, allowedTypes, maxFileSize, !simple));
    setValidationError(errors.find(Boolean));
    const valid = next.filter((_, index) => !errors[index]);
    if (!valid.length) return;
    if (simple) {
      const unique = [...files];
      for (const file of valid)
        if (unique.length < maxFiles && !unique.some((existing) => existing.name === file.name))
          unique.push(file);
      setValue(unique);
    } else {
      const selected = valid[0];
      if (!selected) return;
      const request = ++imageRequest.current;
      void readUploadImage(selected)
        .then((image) => {
          if (request === imageRequest.current)
            setValue(props.valueMode === 'file' ? selected : { file: selected, image });
        })
        .catch(() => {
          if (request === imageRequest.current) setValidationError('Nie można odczytać pliku');
        });
    }
  };
  if (simple)
    return (
      <div
        {...common(props)}
        aria-live="polite"
        className={cx('peaui-form-file-upload-simple', props.className)}
        ref={forwardedRef as ForwardedRef<HTMLDivElement>}
      >
        <div className="peaui-form-file-upload-simple__upload">
          <input
            accept={accept}
            aria-label="Wgraj pliki"
            aria-describedby={`${descriptionId}${validationError ? ` ${messageId}` : ''}`}
            aria-invalid={Boolean(validationError)}
            className="peaui-form-file-upload-simple__input"
            disabled={bool(props, 'disabled')}
            multiple
            type="file"
            onChange={(event) => updateFiles(Array.from(event.target.files ?? []))}
          />
          <Svg
            data={iconDownload}
            className="peaui-form-file-upload-simple__icon"
            name="download"
          />
          <div className="peaui-form-file-upload-simple__content">
            <p className="peaui-form-file-upload-simple__title">
              Przeciagnij i upusc plik tutaj lub przeslij
            </p>
            <p id={descriptionId} className="peaui-form-file-upload-simple__description">
              {' Format pliku: '}
              {allowedTypes.map((type, index) => (
                <span key={type} className="peaui-form-file-upload-simple__type">
                  {`${typeLabels[type] ?? type} `}
                  {index < allowedTypes.length - 1 ? <span>,</span> : null}
                </span>
              ))}
              <br />
              {` Rozmiar pliku: maksimum ${formatBytes(maxFileSize)}`}
            </p>
          </div>
          <button
            aria-hidden="true"
            className={cx(
              'peaui-form-file-upload-simple__button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-primary',
              bool(props, 'disabled') && 'peaui-button-action--is-disabled',
            )}
            disabled={bool(props, 'disabled')}
            tabIndex={-1}
            type="button"
          >
            Wgraj
          </button>
        </div>
        {validationError ? (
          <p id={messageId} role="status">
            {validationError}
          </p>
        ) : null}
        {files.map((file) => (
          <div
            key={`${file.name}-${file.lastModified}`}
            aria-atomic="true"
            className="peaui-form-file-upload-simple__item"
            role="status"
          >
            <Svg data={iconFile} className="peaui-form-file-upload-simple__item-icon" name="file" />
            <div className="peaui-form-file-upload-simple__item-body">
              <div className="peaui-form-file-upload-simple__item-text">
                <span className="peaui-form-file-upload-simple__item-name">{file.name}</span>
                <br />
                {formatBytes(file.size)}
              </div>
              <div>
                <button
                  aria-label={`Usuń ${file.name}`}
                  className="peaui-form-file-upload-simple__remove"
                  type="button"
                  disabled={bool(props, 'disabled')}
                  onClick={() => {
                    if (bool(props, 'disabled')) return;
                    const next = files.filter((item) => item !== file);
                    setValue(next);
                    callback(props, 'onRemove')?.(file);
                  }}
                >
                  <Svg
                    data={iconTrash}
                    className="peaui-form-file-upload-simple__remove-icon"
                    name="trash"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  const variant = text(props, 'variant', 'primary');
  return (
    <div
      {...common(props)}
      className={cx('peaui-form-file-upload', props.className)}
      ref={forwardedRef as ForwardedRef<HTMLDivElement>}
    >
      <div
        className={cx(
          'peaui-form-file-upload__surface',
          `peaui-form-file-upload__surface--${variant}`,
        )}
      >
        {!selectedFile ? (
          <div className="peaui-form-file-upload__dropzone" role="group">
            <Svg
              data={variant === 'primary' ? iconImageUpload : iconHelp}
              className={cx(
                'peaui-form-file-upload__dropzone-icon',
                `peaui-form-file-upload__dropzone-icon--${variant}`,
              )}
              name={variant === 'primary' ? 'imageUpload' : 'help'}
            />
            {validationError || variant === 'danger' ? (
              <p id={messageId} className="peaui-form-file-upload__message" role="status">
                {validationError || 'Pole jest wymagane'}
              </p>
            ) : null}
            <div className="peaui-form-file-upload__actions">
              <button
                aria-hidden="true"
                className={cx(
                  'peaui-form-file-upload__button peaui-button-action peaui-button-action--size-xs peaui-button-action--variant-primary',
                  bool(props, 'disabled') && 'peaui-button-action--is-disabled',
                )}
                disabled={bool(props, 'disabled')}
                tabIndex={-1}
                type="button"
              >
                Wybierz zdjecie z dysku
              </button>
              <p className="peaui-form-file-upload__actions-text">lub przeciagnij i upusc tutaj</p>
            </div>
            <p id={descriptionId} className="peaui-form-file-upload__description">
              <span className="peaui-form-file-upload__description-line">
                Format zdjecia: JPEG, JPG lub PNG
              </span>
              <span className="peaui-form-file-upload__description-line">
                {`Rozmiar zdjecia: maksimum ${formatBytes(maxFileSize)}`}
              </span>
            </p>
            {!bool(props, 'disabled') ? (
              <input
                accept={accept}
                aria-label="Wybierz zdjecie z dysku"
                aria-describedby={`${descriptionId}${validationError || variant === 'danger' ? ` ${messageId}` : ''}`}
                aria-invalid={Boolean(validationError)}
                className="peaui-form-file-upload__input"
                type="file"
                onChange={(event) => updateFiles(Array.from(event.target.files ?? []))}
              />
            ) : null}
          </div>
        ) : (
          <div className="peaui-form-file-upload__preview">
            {previewUrl ? (
              <img
                alt={selectedFile.name}
                className="peaui-form-file-upload__image"
                src={previewUrl}
              />
            ) : null}
          </div>
        )}
      </div>
      {selectedFile ? (
        <div className="peaui-form-file-upload__details">
          <div className="peaui-form-file-upload__details-main">
            <Svg
              data={iconPicture}
              className="peaui-form-file-upload__details-icon"
              name="picture"
            />
            <div className="peaui-form-file-upload__details-text">
              <p className="peaui-form-file-upload__details-name">{selectedFile.name}</p>
              <p className="peaui-form-file-upload__details-size">
                {formatBytes(selectedFile.size)}
              </p>
            </div>
          </div>
          {!bool(props, 'disabled') ? (
            <button
              aria-label={`Usuń ${selectedFile.name}`}
              className="peaui-form-file-upload__remove"
              type="button"
              onClick={() => {
                setValue(undefined);
                callback(props, 'onRemove')?.(selectedFile);
              }}
            >
              <Svg data={iconTrash} className="peaui-form-file-upload__remove-icon" name="trash" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
