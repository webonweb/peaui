export type VirtualListDemoItem = {
  description: string;
  id: string;
  label: string;
};

export const virtualListDemoItems: VirtualListDemoItem[] = Array.from(
  { length: 10_000 },
  (_, index) => ({
    id: `result-${index + 1}`,
    label: `Wynik ${String(index + 1).padStart(5, '0')}`,
    description: `Stabilny rekord katalogu o indeksie ${index + 1}.`,
  }),
);
