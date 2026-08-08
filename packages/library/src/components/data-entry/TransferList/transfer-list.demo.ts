import type { TransferListItem, TransferListLabels } from './transfer-list.shared';

export const transferListItems: readonly TransferListItem[] = [
  { key: 'analytics', label: 'Analityka', description: 'Raporty i pulpity danych' },
  { key: 'billing', label: 'Rozliczenia', description: 'Faktury i metody płatności' },
  { key: 'customers', label: 'Klienci', description: 'Profile oraz historia kontaktów' },
  { key: 'exports', label: 'Eksport danych', description: 'Pobieranie raportów' },
  { key: 'integrations', label: 'Integracje', description: 'Połączenia z usługami zewnętrznymi' },
  { key: 'security', label: 'Bezpieczeństwo', description: 'Role, audyt i kontrola dostępu' },
  { key: 'settings', label: 'Ustawienia organizacji', description: 'Konfiguracja całego konta' },
  {
    key: 'system',
    label: 'Administracja systemowa',
    description: 'Element wymagany przez system',
    disabled: true,
  },
];

export const transferListDemoValue = ['analytics', 'security'] as const;

export const transferListEnglishLabels: Partial<TransferListLabels> = {
  sourceTitle: 'Available permissions',
  targetTitle: 'Assigned permissions',
  sourceSearchAria: 'Filter available permissions',
  targetSearchAria: 'Filter assigned permissions',
  moved: 'Moved',
};

export const transferListLongItems: readonly TransferListItem[] = [
  ...transferListItems,
  {
    key: 'long',
    label: 'Zarządzanie bardzo długimi nazwami uprawnień w organizacjach międzynarodowych',
    description:
      'Opis celowo zawiera wiele słów, aby zweryfikować zawijanie treści w wąskim kontenerze.',
  },
];
