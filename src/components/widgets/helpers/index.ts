import { BalanceHistoryEntity } from '@/api';

// TODO: optimize implementation
export function aggregateData(data: BalanceHistoryEntity[]) {
  const accountIds = new Set(data.map(item => item.accountId));
  const datesList = new Set(data.map(item => item.date));
  const firstDate = new Date([...datesList][0]);
  const lastDate = new Date([...datesList].at(-1));
  const allDates = [];

  for (let dt = firstDate; dt <= lastDate; dt.setDate(dt.getDate() + 1)) {
    allDates.push(new Date(dt).toISOString().slice(0, 10));
  }

  const filledDataPerAccount = allDates.reduce((acc, currDate, currIndex, dates) => {
    [...accountIds].forEach(accountId => {
      if (!acc[accountId]) acc[accountId] = {};
      const prevDate = dates[currIndex - 1];
      const prevAmount = prevDate ? acc[accountId][prevDate] : 0;

      acc[accountId][currDate] = data.find(
        item => item.accountId === accountId && item.date === currDate,
      )?.amount || prevAmount;
    });

    return acc;
  }, {});

  const aggregatedData = Object.keys(filledDataPerAccount).reduce((acc, accountId) => {
    const accountData = filledDataPerAccount[Number(accountId)];

    for (const [date, amount] of Object.entries(accountData)) {
      acc[date] = (acc[date] || 0) + (amount as number);
    }

    return acc;
  }, {} as Record<string, number>);

  const toArray = Object.entries(aggregatedData)
    .map(([key, value]) => ({ date: key, amount: value }));

  return toArray;
}
