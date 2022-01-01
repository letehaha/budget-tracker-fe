export const formatAmount = (value: number): string => (
  (value / 100).toFixed(2)
);
export const formatFiat = (value: unknown): string => Number(value).toFixed(2);
