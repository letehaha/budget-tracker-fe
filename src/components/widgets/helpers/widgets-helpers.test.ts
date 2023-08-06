// import { subDays, parseISO } from 'date-fns';
import { aggregateData } from './index';

describe('aggregateData', () => {
  test.each([
    ['should handle an empty array', [], []],
    ['should aggregate data for a single account with a gap in data', [
      { date: '2021-01-01', amount: 100, accountId: 1 },
      { date: '2021-01-05', amount: 150, accountId: 1 },
    ], [
      { date: '2021-01-01', amount: 100 },
      { date: '2021-01-02', amount: 100 },
      { date: '2021-01-03', amount: 100 },
      { date: '2021-01-04', amount: 100 },
      { date: '2021-01-05', amount: 150 },
    ]],
    ['handle simple dataset', [
      { date: '2021-01-01', amount: 100, accountId: 1 },
      { date: '2021-01-02', amount: 150, accountId: 1 },
      { date: '2021-01-01', amount: 200, accountId: 2 },
      { date: '2021-01-03', amount: -50, accountId: 2 },
    ], [
      // 1 100 + 200 = 300
      // 2 150 + 200 = 350
      // 3 150 + -50 = 100
      { date: '2021-01-01', amount: 300 },
      { date: '2021-01-02', amount: 350 },
      { date: '2021-01-03', amount: 100 },
    ]],
  ])('%s', (_, input, output) => {
    expect(aggregateData(input)).toStrictEqual(output);
  });
});