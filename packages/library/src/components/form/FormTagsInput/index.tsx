import type { ReactElement, ReactNode, RefAttributes } from 'react';

import { createDirectReactComponent } from '@/react/create-direct-react-component';
import { FormTagsInputRenderer } from '@/react/form-tags-input.renderer';
import type { PeauiReactProps } from '@/react/generated-react-props';
import type {
  FormTagsInputInvalidDetail,
  FormTagsInputKeyGetter,
  FormTagsInputNormalizer,
  FormTagsInputSerializer,
  FormTagsInputSuggestionProvider,
  FormTagsInputTag,
  FormTagsInputValidator,
} from './tags-input.shared';

type GeneratedFormTagsInputProps = PeauiReactProps<'FormTagsInput'>;

export type FormTagsInputProps = Omit<
  GeneratedFormTagsInputProps,
  | 'defaultValue'
  | 'description'
  | 'error'
  | 'getTagKey'
  | 'inputValue'
  | 'normalizeTag'
  | 'onAdd'
  | 'onEdit'
  | 'onInputValueChange'
  | 'onInvalidTag'
  | 'onMaxReached'
  | 'onRemove'
  | 'onSearch'
  | 'onValueChange'
  | 'serializeTag'
  | 'suggestionProvider'
  | 'suggestions'
  | 'validateTag'
  | 'value'
> & {
  value?: FormTagsInputTag[];
  defaultValue?: FormTagsInputTag[];
  inputValue?: string;
  defaultInputValue?: string;
  suggestions?: readonly FormTagsInputTag[];
  suggestionProvider?: FormTagsInputSuggestionProvider;
  normalizeTag?: FormTagsInputNormalizer;
  validateTag?: FormTagsInputValidator;
  getTagKey?: FormTagsInputKeyGetter;
  serializeTag?: FormTagsInputSerializer;
  description?: ReactNode;
  error?: ReactNode;
  onValueChange?: (value: FormTagsInputTag[]) => void;
  onInputValueChange?: (value: string) => void;
  onAdd?: (tag: FormTagsInputTag, index: number, event: Event) => void;
  onRemove?: (tag: FormTagsInputTag, index: number, event: Event) => void;
  onEdit?: (
    previous: FormTagsInputTag,
    next: FormTagsInputTag,
    index: number,
    event: Event,
  ) => void;
  onInvalidTag?: (detail: FormTagsInputInvalidDetail, event: Event) => void;
  onSearch?: (query: string, requestId: number) => void;
  onMaxReached?: (max: number, event: Event) => void;
  renderLabel?: (state: { count: number }) => ReactNode;
  renderHint?: (state: { count: number; max?: number }) => ReactNode;
  renderTag?: (state: {
    tag: FormTagsInputTag;
    index: number;
    selected: boolean;
    editing: boolean;
    disabled: boolean;
  }) => ReactNode;
  renderTagContent?: (state: { tag: FormTagsInputTag; index: number }) => ReactNode;
  renderSuggestion?: (state: {
    suggestion: FormTagsInputTag;
    index: number;
    active: boolean;
  }) => ReactNode;
  renderEmptySuggestions?: (state: { query: string }) => ReactNode;
  labelContent?: ReactNode;
  hintContent?: ReactNode;
  emptySuggestionsContent?: ReactNode;
  loadingContent?: ReactNode;
  prefixContent?: ReactNode;
  suffixContent?: ReactNode;
  descriptionContent?: ReactNode;
  errorContent?: ReactNode;
};

export type {
  FormTagsInputCommitOptions,
  FormTagsInputCommitResult,
  FormTagsInputInvalidDetail,
  FormTagsInputInvalidReason,
  FormTagsInputItem,
  FormTagsInputKeyGetter,
  FormTagsInputLayout,
  FormTagsInputMode,
  FormTagsInputNormalizer,
  FormTagsInputPlacement,
  FormTagsInputSerializer,
  FormTagsInputSuggestionProvider,
  FormTagsInputTag,
  FormTagsInputValidator,
} from './tags-input.shared';

const FormTagsInputBase = createDirectReactComponent('FormTagsInput', FormTagsInputRenderer);
const FormTagsInput = FormTagsInputBase as unknown as (
  props: FormTagsInputProps & RefAttributes<HTMLInputElement>,
) => ReactElement | null;

export default FormTagsInput;
