export const formatAmount = (value: number): string => (
  (value / 100).toFixed(2)
);
export const formatFiat = (value: unknown): string => Number(value).toFixed(2);

/**
 * Converts passed value to the system one, since system does not have decimals
 *
 * @param {Number} value
 * @returns Correct system amount with no decimals
 */
export const toSystemAmount = (value: number): number => (
  Number((value * 100).toFixed(0))
);

/**
 *
 * @param value
 * @returns System value which might be displayed to the user
 */
export const fromSystemAmount = (value: number): number => value / 100;
