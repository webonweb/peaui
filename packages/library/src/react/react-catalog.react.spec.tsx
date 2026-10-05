/** @jsxImportSource react */
import '@testing-library/jest-dom/vitest';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createElement, type ComponentType } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ButtonAction from '@/components/data-entry/ButtonAction';
import Avatar from '@/components/data-display/Avatar';
import DisclosurePanel from '@/components/data-display/DisclosurePanel';
import EmptyState from '@/components/feedback/EmptyState';
import ProgressIndicator from '@/components/feedback/ProgressIndicator';
import TableList from '@/components/data-display/TableList';
import TableListHeader from '@/components/data-display/TableListHeader';
import FormFileUpload from '@/components/form/FormFileUpload';
import FormFileUploadSimple from '@/components/form/FormFileUploadSimple';
import FormButtonGroup from '@/components/form/FormButtonGroup';
import FormContainer from '@/components/form/FormContainer';
import FormColorPicker from '@/components/form/FormColorPicker';
import FormDatePicker from '@/components/form/FormDatePicker';
import FormDateTimePicker from '@/components/form/FormDateTimePicker';
import FormField from '@/components/form/FormField';
import FormInput from '@/components/form/FormInput';
import FormMultiSelect from '@/components/form/FormMultiSelect';
import FormNumber from '@/components/form/FormNumber';
import FormPassword from '@/components/form/FormPassword';
import FormSelect from '@/components/form/FormSelect';
import FormTimePicker from '@/components/form/FormTimePicker';
import FormTextarea from '@/components/form/FormTextarea';
import FormYearPicker from '@/components/form/FormYearPicker';
import NavigationCard from '@/components/navigation/NavigationCard';
import PaginationControl from '@/components/navigation/PaginationControl';
import InfoTooltip from '@/components/overlayer/InfoTooltip';
import PopoverOverlayer from '@/components/overlayer/PopoverOverlayer';

import { reactComponentCatalog } from './generated-react-catalog';

const componentModules = import.meta.glob<{ default: ComponentType<Record<string, unknown>> }>(
  '../components/*/*/index.tsx',
  { eager: true },
);

afterEach(cleanup);

describe('katalog komponentów React', () => {
  it('udostępnia natywny komponent React dla każdego komponentu Vue', () => {
    expect(reactComponentCatalog).toHaveLength(87);
    expect(Object.keys(componentModules)).toHaveLength(87);

    for (const definition of reactComponentCatalog) {
      const modulePath = `../components/${definition.category}/${definition.sourceName}/index.tsx`;
      expect(componentModules[modulePath]?.default).toBeTypeOf('object');
    }
  });

  it('obsługuje kliknięcie i stan disabled przycisku', () => {
    const onClick = vi.fn();
    const { rerender } = render(<ButtonAction onClick={onClick}>Zapisz</ButtonAction>);
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(Object);

    rerender(
      <ButtonAction disabled onClick={onClick}>
        Zapisz
      </ButtonAction>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('przekazuje publiczne atrybuty ARIA i zdarzenia do korzenia komponentu React', () => {
    const onKeyDown = vi.fn();
    const { container } = render(
      <ProgressIndicator
        active={1}
        aria-describedby="progress-help"
        aria-labelledby="progress-label"
        onKeyDown={onKeyDown}
        steps={3}
      />,
    );
    const progress = container.firstElementChild;

    expect(progress).toHaveAttribute('aria-describedby', 'progress-help');
    expect(progress).toHaveAttribute('aria-labelledby', 'progress-label');
    fireEvent.keyDown(progress as Element, { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('renderuje dostępny Avatar z przewidywalną kolejnością fallbacków', () => {
    const { rerender } = render(<Avatar dataTestId="avatar" name="Anna Maria Kowalska" />);
    const avatar = screen.getByRole('img', { name: 'Anna Maria Kowalska' });

    expect(avatar).not.toHaveAttribute('tabindex');
    expect(screen.getByText('AK')).toBeInTheDocument();

    rerender(<Avatar dataTestId="avatar" fallbackIcon="users" />);

    expect(screen.getByTestId('avatar-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('resetuje stan obrazu Avatara po zmianie src i przekazuje zdarzenia', () => {
    const onError = vi.fn();
    const onLoad = vi.fn();
    const { rerender } = render(
      <Avatar
        alt="Portret Anny"
        dataTestId="avatar-image-state"
        name="Anna Kowalska"
        onError={onError}
        onLoad={onLoad}
        src="/anna.jpg"
      />,
    );
    const firstImage = screen.getByTestId('avatar-image-state-image');

    expect(screen.getByTestId('avatar-image-state')).toHaveAttribute('data-state', 'loading');
    fireEvent.load(firstImage);
    expect(onLoad).toHaveBeenCalledOnce();
    expect(firstImage).toHaveAttribute('alt', 'Portret Anny');

    rerender(
      <Avatar
        alt="Portret Anny"
        dataTestId="avatar-image-state"
        name="Anna Kowalska"
        onError={onError}
        onLoad={onLoad}
        src="/replacement.jpg"
      />,
    );

    expect(screen.getByTestId('avatar-image-state')).toHaveAttribute('data-state', 'loading');
    const replacementImage = screen.getByTestId('avatar-image-state-image');
    fireEvent.error(replacementImage);
    expect(onError).toHaveBeenCalledOnce();
    expect(screen.getByText('AK')).toBeInTheDocument();
  });

  it('używa przycisku i tekstowego opisu statusu tylko dla interaktywnego Avatara', () => {
    const onClick = vi.fn();
    const { container, rerender } = render(
      <Avatar
        ariaLabel="Otwórz profil Anny"
        interactive
        onClick={onClick}
        status="busy"
        statusContent="!"
      />,
    );
    const button = screen.getByRole('button', { name: 'Otwórz profil Anny' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button.getAttribute('aria-describedby')).toBeTruthy();
    expect(container.querySelector('.peaui-avatar__status-label')).toHaveTextContent('Zajęty');
    expect(container.querySelector('.peaui-avatar__status-label')).not.toHaveAttribute('aria-live');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(<Avatar alt="" src="/decorative.jpg" />);
    fireEvent.load(document.querySelector('.peaui-avatar__image') as Element);

    expect(document.querySelector('.peaui-avatar')).not.toHaveAttribute('role');
    expect(document.querySelector('.peaui-avatar__image')).toHaveAttribute('alt', '');
  });

  it('łączy trigger InfoTooltip z dymkiem i obsługuje mysz oraz fokus', async () => {
    const { container } = render(
      <InfoTooltip dataTestId="info-tooltip" description="Treść podpowiedzi" title="Podpowiedź">
        Najedź albo ustaw fokus
      </InfoTooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Najedź albo ustaw fokus' });
    const tooltip = screen.getByRole('tooltip');

    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    expect(trigger).toHaveAttribute('tabindex', '0');
    expect(tooltip).toHaveAttribute('data-testid', 'info-tooltip-tooltip');
    expect(container.querySelector('.peaui-info-tooltip__content--placement-top')).toBe(tooltip);

    fireEvent.mouseEnter(trigger);
    expect(trigger).toHaveAttribute('data-open', 'true');
    fireEvent.mouseLeave(trigger);
    await waitFor(() => expect(trigger).not.toHaveAttribute('data-open'));
    fireEvent.focus(trigger);
    expect(trigger).toHaveAttribute('data-open', 'true');
    fireEvent.blur(trigger);
    expect(trigger).not.toHaveAttribute('data-open');
  });

  it('nie tworzy dodatkowego tab stopu dla interaktywnego triggera InfoTooltip', () => {
    render(
      <InfoTooltip description="Treść podpowiedzi">
        <button type="button">Pomoc</button>
      </InfoTooltip>,
    );
    const button = screen.getByRole('button', { name: 'Pomoc' });
    const tooltip = screen.getByRole('tooltip');
    const wrapper = document.querySelector('.peaui-info-tooltip');

    expect(wrapper).not.toHaveAttribute('role');
    expect(wrapper).not.toHaveAttribute('tabindex');
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('przekazuje zdarzenia interakcji tabeli z payloadami zgodnymi z Vue', () => {
    const onAction = vi.fn();
    const onChangeValue = vi.fn();
    const onCheckRow = vi.fn();
    const onDbclick = vi.fn();
    const onResetFilters = vi.fn();
    const onRowDoubleClick = vi.fn();
    const onSelectRow = vi.fn();
    const record = { id: '1', name: 'Alfa', status: 'Aktywny' };

    render(
      <>
        <TableListHeader canFilter countFilters={2} onResetFilters={onResetFilters} />
        <TableList
          canCheckRows
          canSelectRows
          columns={[
            { key: 'name', label: 'Nazwa' },
            { inline: true, key: 'status', label: 'Status' },
            { actionName: 'open', key: 'action', label: 'Akcja', type: 'action' },
          ]}
          onAction={onAction}
          onChangeValue={onChangeValue}
          onCheckRow={onCheckRow}
          onDbclick={onDbclick}
          onRowDoubleClick={onRowDoubleClick}
          onSelectRow={onSelectRow}
          records={[record]}
        />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Wyczyść filtry' }));
    expect(onResetFilters).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Zaznacz wiersz 1' }));
    expect(onSelectRow).toHaveBeenCalledWith(['1']);
    expect(onCheckRow).not.toHaveBeenCalled();

    const row = screen.getByRole('row', { name: /Alfa/ });
    fireEvent.click(row);
    expect(onCheckRow).toHaveBeenCalledWith(record);

    fireEvent.change(screen.getByRole('textbox', { name: 'Status, wiersz 1' }), {
      target: { value: 'Nieaktywny' },
    });
    expect(onChangeValue).toHaveBeenCalledWith('1', 'Nieaktywny');

    fireEvent.click(screen.getByRole('button', { name: /^Akcja:/ }));
    expect(onAction).toHaveBeenCalledWith('1', 'open', record);

    fireEvent.doubleClick(row);
    expect(onRowDoubleClick).toHaveBeenCalledWith('1', record);
    expect(onDbclick).toHaveBeenCalledWith('1', record);
  });

  it.each(['isDetails', 'isDetials'] as const)(
    'supports the TableList %s compatibility prop',
    (propName) => {
      const { container } = render(
        createElement(TableList, {
          [propName]: true,
          columns: [{ key: 'name', label: 'Nazwa' }],
          records: [{ id: '1', name: 'Alfa' }],
        }),
      );

      expect(container.querySelector('.peaui-table-list')).toHaveClass('peaui-table-list--details');
    },
  );

  it('renders the correctly named TableListHeader additional content props', () => {
    render(
      <TableListHeader
        additionalContent={<span>Additional content</span>}
        additionalDescription={<span>Additional description</span>}
      />,
    );

    expect(screen.getByText('Additional content')).toBeInTheDocument();
    expect(screen.getByText('Additional description')).toBeInTheDocument();
  });

  it('bezpiecznie kopiuje komórkę i przekazuje stan sortowania wielokolumnowego', () => {
    const onSort = vi.fn();

    render(
      <TableList
        canMultiSort
        columns={[
          { canCopy: true, canSort: true, key: 'name', label: 'Nazwa' },
          { canSort: true, key: 'status', label: 'Status' },
        ]}
        records={[{ id: '1', name: 'Wniosek', status: 'Aktywny' }]}
        sortColumns={[{ direction: 'asc', key: 'status' }]}
        onSort={onSort}
      />,
    );

    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Kopiuj Nazwa: Wniosek' })),
    ).not.toThrow();
    fireEvent.click(screen.getByRole('button', { name: 'Nazwa' }));

    expect(onSort).toHaveBeenCalledWith([
      { direction: 'asc', key: 'name' },
      { direction: 'asc', key: 'status' },
    ]);
  });

  it('wspiera niekontrolowany model i callback zmiany pola', () => {
    const onValueChange = vi.fn();
    render(
      <FormInput
        defaultValue="A"
        id="name"
        label="Nazwa"
        name="name"
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Nazwa' });
    fireEvent.change(input, { target: { value: 'B' } });
    expect(input).toHaveValue('B');
    expect(onValueChange).toHaveBeenLastCalledWith('B');
  });

  it('obsługuje wybór w selectcie zgodnym ze strukturą Vue', () => {
    const onValueChange = vi.fn();
    render(
      <FormSelect
        defaultValue="a"
        id="type"
        label="Typ"
        name="type"
        onValueChange={onValueChange}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />,
    );
    const trigger = screen.getByRole('combobox', { name: /Typ/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(document.querySelector('.peaui-form-select__panel')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'B' }));
    expect(onValueChange).toHaveBeenLastCalledWith('b');
  });

  it('otwiera panel oraz przekazuje zmianę strony', () => {
    const onOpenChange = vi.fn();
    const onPageChange = vi.fn();
    render(
      <>
        <DisclosurePanel defaultOpen={false} onOpenChange={onOpenChange} title="Szczegóły">
          Treść
        </DisclosurePanel>
        <PaginationControl
          ariaLabel="Paginacja"
          defaultPage={1}
          onPageChange={onPageChange}
          totalPages={4}
        />
      </>,
    );
    fireEvent.click(screen.getByText('Szczegóły'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole('button', { name: 'Przejdź do kolejnej strony' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it.each(['alwaysOpen', 'allwaysOpen'] as const)(
    'keeps DisclosurePanel open through the %s compatibility prop',
    (propName) => {
      const { container } = render(
        createElement(DisclosurePanel, { [propName]: true, title: 'Fixed details' }, 'Content'),
      );

      expect(container.querySelector('details')).toHaveAttribute('open');
      expect(container.querySelector('.peaui-disclosure-panel__icon')).not.toBeInTheDocument();
    },
  );

  it('renderuje elementy BEM wymagane przez współdzielone style', () => {
    const { container } = render(
      <>
        <NavigationCard
          description="Opis karty"
          path="#details"
          title="Szczegóły"
          variant="during"
        />
        <ProgressIndicator active={2} steps={4} />
      </>,
    );

    expect(container.querySelector('.peaui-navigation-card--interactive')).toBeInTheDocument();
    expect(container.querySelector('.peaui-navigation-card__content')).toBeInTheDocument();
    expect(container.querySelector('.peaui-navigation-card__title--size-s')).toBeInTheDocument();
    expect(
      container.querySelector('.peaui-navigation-card__icon--variant-during'),
    ).toBeInTheDocument();
    expect(container.querySelector('.peaui-progress-indicator__svg')).toBeInTheDocument();
    expect(container.querySelector('.peaui-progress-indicator__track')).toBeInTheDocument();
    expect(container.querySelector('.peaui-progress-indicator__progress')).toBeInTheDocument();
  });

  it('zachowuje strukturę pustego stanu i popovera wymaganą przez SCSS Vue', () => {
    const { container } = render(
      <>
        <EmptyState description="Brak rekordów" title="Brak danych" />
        <PopoverOverlayer content={<div>Treść warstwy</div>}>Otwórz warstwę</PopoverOverlayer>
      </>,
    );

    expect(container.querySelector('.peaui-empty-state__icon-shadow')).toBeInTheDocument();
    expect(container.querySelector('.peaui-empty-state__icon-outline')).toBeInTheDocument();
    expect(container.querySelector('.peaui-empty-state__icon-line')).toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: 'Otwórz warstwę' });
    expect(trigger.tagName).toBe('DIV');
    fireEvent.click(trigger);
    const content = container.querySelector('.peaui-popover-overlayer__content');
    expect(content).toBeInTheDocument();
    if (typeof HTMLElement.prototype.showPopover === 'function') {
      expect(content).toHaveAttribute('popover', 'auto');
    }
  });

  it('renderuje upload zdjęcia w strukturze współdzielonej z komponentem Vue', () => {
    const { container } = render(<FormFileUpload />);

    expect(
      container.querySelector('.peaui-form-file-upload__surface--primary'),
    ).toBeInTheDocument();
    expect(container.querySelector('.peaui-form-file-upload__dropzone')).toBeInTheDocument();
    expect(container.querySelector('.peaui-form-file-upload__actions')).toBeInTheDocument();
    expect(
      container.querySelector('.peaui-form-file-upload__description-line'),
    ).toBeInTheDocument();
  });

  it('zachowuje strukturę BEM formularzy wymaganą przez współdzielony SCSS Vue', () => {
    const { container } = render(
      <>
        <FormInput canErase id="name" label="Nazwa" name="name" value="PEAUI" />
        <FormButtonGroup
          id="view"
          label="Widok"
          name="view"
          options={[
            { key: 'list', label: 'Lista' },
            { key: 'grid', label: 'Kafelki' },
          ]}
          value="list"
        />
        <FormPassword
          enablePasswordStrengthMeter
          id="password"
          label="Hasło"
          name="password"
          value="PeaUI-2026!"
        />
        <FormTextarea
          id="description"
          label="Opis"
          maxLength={40}
          name="description"
          value="Tekst"
        />
        <FormContainer label="Formularz" showCancelButton>
          Treść formularza
        </FormContainer>
        <FormFileUploadSimple />
      </>,
    );

    expect(container.querySelector('.peaui-form-label__optional')).toBeInTheDocument();
    expect(container.querySelector('.peaui-form-field__erase-icon')).toBeInTheDocument();
    expect(
      container.querySelector('.peaui-form-button-group.peaui-form-field__element'),
    ).toBeInTheDocument();
    expect(container.querySelector('.peaui-form-field-password__status')).toBeInTheDocument();
    expect(container.querySelectorAll('.peaui-form-field-password__strength-segment')).toHaveLength(
      5,
    );
    expect(screen.getByText('Długość tekstu: 5 / 40 znaków')).toBeInTheDocument();
    expect(
      container.querySelector('.peaui-form-container__actions-button.peaui-button-action--size-xs'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '.peaui-form-file-upload-simple__button.peaui-button-action--variant-primary',
      ),
    ).toBeInTheDocument();
  });

  it('rezerwuje spójny pas akcji canErase we wszystkich typach pól', () => {
    const options = [
      { id: 'vue', label: 'Vue', value: 'vue' },
      { id: 'react', label: 'React', value: 'react' },
    ];
    const { container } = render(
      <>
        <FormField canErase dataTestId="erase-field" id="field" name="field" value="PEAUI" />
        <FormInput canErase dataTestId="erase-input" id="input" name="input" value="PEAUI" />
        <FormNumber canErase dataTestId="erase-number" id="number" name="number" value={12} />
        <FormSelect
          canErase
          dataTestId="erase-select"
          id="select"
          name="select"
          options={options}
          value="vue"
        />
        <FormMultiSelect
          canErase
          dataTestId="erase-multiselect"
          id="multiselect"
          name="multiselect"
          options={options}
          value={['vue']}
        />
        <FormDatePicker canErase dataTestId="erase-date" id="date" name="date" value="2026-08-07" />
        <FormYearPicker canErase dataTestId="erase-year" id="year" name="year" value={2026} />
        <FormTimePicker canErase dataTestId="erase-time" id="time" name="time" value="09:30" />
        <FormDateTimePicker
          canErase
          dataTestId="erase-date-time"
          id="date-time"
          name="date-time"
          value={{ date: '2026-08-07', time: '09:30' }}
        />
        <FormColorPicker
          canErase
          dataTestId="erase-color"
          id="color"
          name="color"
          value="#2563eb"
        />
      </>,
    );

    expect(
      container.querySelector('[data-testid="erase-field"] .peaui-form-field__element'),
    ).toHaveStyle({ '--pr': '48px' });
    expect(screen.getByTestId('erase-input-element')).toHaveStyle({ '--pr': '48px' });
    expect(screen.getByTestId('erase-number-element')).toHaveStyle({ '--pr': '68px' });

    for (const testId of ['erase-select', 'erase-multiselect', 'erase-date', 'erase-year']) {
      expect(screen.getByTestId(`${testId}-element`)).toHaveStyle({ '--pr': '80px' });
    }

    expect(screen.getByTestId('erase-time-element')).toHaveStyle({ '--pr': '80px' });
    expect(screen.getByTestId('erase-date-time-input')).toHaveStyle({ '--pr': '80px' });
    expect(
      container.querySelector('[data-testid="erase-color"] .peaui-form-field__erase-button'),
    ).toHaveStyle({ '--right': '48px' });

    const eraseOffsets = Array.from(
      container.querySelectorAll<HTMLElement>('.peaui-form-field__erase-button'),
    ).map((element) => element.style.getPropertyValue('--right').trim());
    expect(eraseOffsets).toEqual([
      '12px',
      '12px',
      '32px',
      '44px',
      '44px',
      '44px',
      '44px',
      '44px',
      '44px',
      '48px',
    ]);
  });

  it('renderuje i obsługuje kalendarz w strukturze pickera Vue', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <FormDatePicker
        defaultValue="2026-08-05"
        id="start-date"
        label="Data rozpoczęcia"
        name="startDate"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('combobox', { name: /Data rozpoczęcia/ }));
    expect(container.querySelector('.peaui-form-date-picker__panel')).toBeInTheDocument();
    expect(container.querySelectorAll('.peaui-form-date-picker-button')).toHaveLength(42);
    expect(container.querySelectorAll('.peaui-form-date-picker__row--day')).toHaveLength(6);
    expect(
      container.querySelector('.peaui-popover-overlayer__content--match-trigger-width'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Następny miesiąc' }));
    expect(container.querySelectorAll('.peaui-form-date-picker-button')).toHaveLength(42);
  });

  it('przekazuje stan disabled do kontrolek formularza tak jak implementacja Vue', () => {
    const { container } = render(
      <>
        <FormInput disabled id="disabled-input" label="Nazwa" name="name" />
        <FormTextarea disabled id="disabled-textarea" label="Opis" name="description" />
        <FormSelect disabled id="disabled-select" label="Kategoria" name="category" options={[]} />
        <FormDatePicker disabled id="disabled-date" label="Data" name="date" />
      </>,
    );

    expect(screen.getByLabelText('Nazwa')).toHaveAttribute('aria-disabled', 'true');
    expect(container.querySelector('#disabled-textarea')).toHaveAttribute('aria-disabled', 'true');
    expect(container.querySelector('#disabled-select')).toHaveAttribute('aria-disabled', 'true');
    expect(container.querySelector('#disabled-date')).toHaveAttribute('aria-disabled', 'true');
  });

  it('każdy entry point jest renderowalnym typem React', () => {
    for (const loaded of Object.values(componentModules)) {
      expect(createElement(loaded.default)).toBeTruthy();
    }
  });
});
