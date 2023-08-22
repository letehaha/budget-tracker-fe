import { format } from 'date-fns';
import { getBalanceHistory, BalanceHistoryEntity } from '@/api';
import { fromSystemAmount } from '@/js/helpers';

// TODO: optimize implementation
export function aggregateBalanceTrendData(data: BalanceHistoryEntity[]) {
  // Extract unique account IDs and dates from the data.
  const accountIds = new Set(data.map(item => item.accountId));
  const datesList = new Set(data.map(item => format(new Date(item.date), 'yyyy-MM-dd')));

  // Determine the earliest and latest dates in the dataset.
  const firstDate = new Date([...datesList][0]);
  const lastDate = new Date([...datesList].at(-1));

  // Generate a list of all dates from the earliest to the latest.
  const allDates = [];
  for (let dt = firstDate; dt <= lastDate; dt.setDate(dt.getDate() + 1)) {
    allDates.push(new Date(dt).toISOString().slice(0, 10));
  }

  // Initialize an object to store the filled data per account.
  const filledDataPerAccount: Record<number, Record<string, number>> = {};

  // For each account, find the earliest transaction and fill that
  // transaction's amount for all prior dates in our dataset.
  [...accountIds].forEach(accountId => {
    const firstEntry = data.filter(item => item.accountId === accountId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    if (firstEntry) {
      allDates.forEach(date => {
        if (new Date(date) < new Date(firstEntry.date)) {
          if (!filledDataPerAccount[accountId]) filledDataPerAccount[accountId] = {};
          filledDataPerAccount[accountId][date] = firstEntry.amount;
        }
      });
    }
  });

  // For each date, iterate over all accounts. If there's data for an account
  // on the given date, use it. Otherwise, propagate the last known amount for that account.
  allDates.forEach(date => {
    [...accountIds].forEach(accountId => {
      if (!filledDataPerAccount[accountId]) filledDataPerAccount[accountId] = {};

      const currentEntry = data.find(item => item.accountId === accountId && item.date === date);
      if (currentEntry) {
        filledDataPerAccount[accountId][date] = currentEntry.amount;
      } else if (!filledDataPerAccount[accountId][date]) {
        const previousDate = new Date(date);
        previousDate.setDate(previousDate.getDate() - 1);
        filledDataPerAccount[accountId][date] = (
          filledDataPerAccount[accountId][previousDate.toISOString().slice(0, 10)] || 0
        );
      }
    });
  });

  // Sum the amounts for all accounts on each date to get the
  // aggregate amount for each date in the dataset.
  const aggregatedData = Object.keys(filledDataPerAccount).reduce((acc, accountId) => {
    const accountData = filledDataPerAccount[Number(accountId)];
    for (const [date, amount] of Object.entries(accountData)) {
      acc[date] = (acc[date] || 0) + (amount as number);
    }
    return acc;
  }, {} as Record<string, number>);

  // Convert the aggregated data from an object to an array of objects.
  const toArray = Object.entries(aggregatedData)
    .map(([key, value]) => ({ date: key, amount: value }));

  return toArray;
}

export const loadBalanceTrendData = async ({ from }: { from: Date }) => {
  let result = await getBalanceHistory({ from });

  if (!result?.length) return [];

  result = result.map(item => ({
    ...item,
    amount: fromSystemAmount(item.amount),
  }));

  return aggregateBalanceTrendData(result);
};
