import {
  formatUIAmount,
  formatFiat,
  toSystemAmount,
  fromSystemAmount,
} from './formatters';

describe('js/helpers/formatters', () => {
  describe('formatUIAmount', () => {
    test.each([
      [10_000, '$100.00'],
      [1, '$0.01'],
      [-1, '-$0.01'],
      [-10_000, '-$100.00'],
      [0.0125, '$0.00'],
      [NaN, 'NaN'],
      [Infinity, 'Infinity'],
    ])('%s to be %s', (value, expected) => {
      expect(formatUIAmount(value)).toBe(expected);
    });
  });

  describe('formatFiat', () => {
    test.each([
      [10_000, '10000.00'],
      [1, '1.00'],
      [-1, '-1.00'],
      [-10_000, '-10000.00'],
      [0.0125, '0.01'],
      [NaN, 'NaN'],
      [Infinity, 'Infinity'],
    ])('%s to be %s', (value, expected) => {
      expect(formatFiat(value)).toBe(expected);
    });
  });

  describe('toSystemAmount', () => {
    test.each([
      [10, 1_000],
      [1, 100],
      [-1, -100],
      [-10_000, -1_000_000],
      [0.0125, 1],
      [NaN, NaN],
      [Infinity, Infinity],
    ])('%s to be %s', (value, expected) => {
      expect(toSystemAmount(value)).toBe(expected);
    });
  });

  describe('fromSystemAmount', () => {
    test.each([
      [1000, 10],
      [100, 1],
      [-100, -1],
      [-1_000_000, -10_000],
      [1.25, 0.0125],
      [NaN, NaN],
      [Infinity, Infinity],
    ])('%s to be %s', (value, expected) => {
      expect(fromSystemAmount(value)).toBe(expected);
    });
  });
});
