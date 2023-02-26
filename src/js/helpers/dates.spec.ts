import { getHoursInMilliseconds } from './dates';

describe('js/helpers/dates', () => {
  test.each([
    [10, 36_000_000],
    [1.5, 5_400_000],
    [0.1, 360_000],
  ])('%s hours is %s millliseconds', (value, expected) => {
    expect(getHoursInMilliseconds(value)).toBe(expected);
  });
});
