export const formPinInputDemoProps = {
  autocomplete: 'one-time-code',
  dataTestId: 'form-pin-input-demo',
  description: 'Wpisz sześciocyfrowy kod otrzymany w wiadomości.',
  label: 'Kod weryfikacyjny',
  length: 6,
  name: 'verificationCode',
  type: 'numeric',
  value: '',
} as const;

export const formPinInputLongLabel =
  'Kod potwierdzający autoryzację tej operacji na urządzeniu mobilnym';
