/** @jsxImportSource react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  formTagsInputDemoProps,
  formTagsInputDemoSuggestions,
  formTagsInputLongLabel,
} from './form-tags-input.demo';
import FormTagsInput from './index';

const { value: demoValue, suggestions: demoSuggestions, ...demoProps } = formTagsInputDemoProps;

const meta = {
  title: 'React/form/FormTagsInput',
  component: FormTagsInput,
  args: {
    ...demoProps,
    defaultValue: [...demoValue],
    suggestions: [...demoSuggestions],
  },
  parameters: {
    layout: 'padded',
    description:
      'Natywny FormTagsInput React z identyczną walidacją, DOM, wyglądem, ARIA i klawiaturą jak Vue i WC.',
  },
} satisfies Meta<typeof FormTagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { dataTestId: 'form-tags-input-default' } };

export const SuggestionsOnly: Story = {
  args: {
    allowCreate: false,
    dataTestId: 'form-tags-input-suggestions',
    defaultValue: ['Vue'],
    mode: 'suggestions-only',
  },
};

export const PasteEditAndKeyboard: Story = {
  render: () => (
    <div data-tags-keyboard style={{ maxInlineSize: '100%', width: '34rem' }}>
      <p>
        Wklej wartości oddzielone przecinkiem. Backspace wybiera i usuwa, strzałki przenoszą fokus,
        F2 edytuje, a Escape anuluje.
      </p>
      <FormTagsInput
        dataTestId="form-tags-input-keyboard"
        defaultValue={['Vue', 'React']}
        description="Każda zmiana przechodzi walidację przed aktualizacją modelu."
        id="tags-keyboard-react"
        label="Tagi obsługiwane klawiaturą"
        name="tagsKeyboard"
        suggestions={[...formTagsInputDemoSuggestions]}
      />
    </div>
  ),
};

export const ObjectsAndCustomContent: Story = {
  render: function Render() {
    const suggestions = [
      { id: 'a11y', label: 'Dostępność', value: 'accessibility' },
      { id: 'perf', label: 'Wydajność', value: 'performance' },
      { id: 'docs', label: 'Dokumentacja', value: 'documentation' },
    ];
    return (
      <div style={{ maxInlineSize: '100%', width: '34rem' }}>
        <FormTagsInput
          allowCreate={false}
          defaultValue={[suggestions[0]!]}
          id="tags-objects-react"
          label="Obszary jakości"
          mode="suggestions-only"
          name="areas"
          renderSuggestion={({ suggestion }) =>
            typeof suggestion === 'string'
              ? suggestion
              : `${suggestion.label} · ${String(suggestion.value)}`
          }
          renderTagContent={({ tag }) => (
            <strong>{typeof tag === 'string' ? tag : tag.label}</strong>
          )}
          suggestions={suggestions}
        />
      </div>
    );
  },
};

export const ValidationAndStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '1.25rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,19rem),1fr))',
      }}
    >
      <FormTagsInput id="tags-required-react" label="Pole wymagane" name="required" required />
      <FormTagsInput
        defaultValue={['Nieobsługiwany']}
        error="Usuń nieobsługiwany tag."
        id="tags-error-react"
        label="Błąd walidacji"
        name="error"
      />
      <FormTagsInput
        defaultValue={['Vue', 'React']}
        id="tags-max-react"
        label="Osiągnięty limit"
        max={2}
        name="max"
      />
      <FormTagsInput
        defaultValue={['Vue', 'React']}
        id="tags-readonly-react"
        label="Tylko do odczytu"
        name="readonly"
        readonly
      />
      <FormTagsInput id="tags-loading-react" label="Ładowanie sugestii" loading name="loading" />
      <FormTagsInput
        defaultValue={['Vue']}
        disabled
        id="tags-disabled-react"
        label="Niedostępne"
        name="disabled"
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [tags, setTags] = useState<import('./index').FormTagsInputTag[]>(['Vue']);
    const [query, setQuery] = useState('');
    return (
      <div style={{ display: 'grid', gap: '.75rem', maxInlineSize: '100%', width: '34rem' }}>
        <FormTagsInput
          id="tags-controlled-react"
          inputValue={query}
          label="Kontrolowane tagi"
          name="controlled"
          onInputValueChange={setQuery}
          onValueChange={setTags}
          suggestions={[...formTagsInputDemoSuggestions]}
          value={tags}
        />
        <output>
          Tagi:{' '}
          {tags.map((tag) => (typeof tag === 'string' ? tag : tag.label)).join(', ') || 'brak'}
          {' · '}Zapytanie: {query || 'puste'}
        </output>
      </div>
    );
  },
};

export const MobileLongContentAndRtl: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div
      data-tags-mobile
      dir="rtl"
      style={{ maxInlineSize: '100%', paddingBlock: '1rem', width: '19rem' }}
    >
      <FormTagsInput
        dataTestId="form-tags-input-mobile"
        defaultValue={['Bardzo długa nazwa technologii interfejsowej', 'WCAG 2.2 AA']}
        description="Długie etykiety i tagi zawijają się bez poziomego overflow."
        id="tags-mobile-react"
        label={formTagsInputLongLabel}
        layout="stacked"
        name="mobile"
        suggestions={['Responsywny projekt wielojęzyczny']}
      />
    </div>
  ),
};
