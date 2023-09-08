export { deepFreeze } from './deep-freeze.helper';
export { writeToClipboard } from './clipboard';
export * from './formatters';
export * from './dates';
export * from './strings';

export function calculatePercentageDifference(a: number, b: number) {
  return 100 * ((a - b) / ((a + b) / 2));
}
