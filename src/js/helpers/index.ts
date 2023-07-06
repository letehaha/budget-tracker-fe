import { MonobankAccountRecord, AccountRecord } from '@/common/types';

export { deepFreeze } from './deep-freeze.helper';
export { writeToClipboard } from './clipboard';
export * from './formatters';
export * from './dates';

// TODO: probably need to normalize data on API
export const getBalanceFromAccount = (account: MonobankAccountRecord | AccountRecord) => {
  if ('currentBalance' in account) return account.currentBalance;
  if ('balance' in account) return account.balance;
  return 0;
};
