import { AccountModel, MonobankAccountModel } from 'shared-types';

export { deepFreeze } from './deep-freeze.helper';
export { writeToClipboard } from './clipboard';
export * from './formatters';
export * from './dates';

// TODO: probably need to normalize data on API
export const getBalanceFromAccount = (account: MonobankAccountModel | AccountModel) => {
  if ('currentBalance' in account) return account.currentBalance;
  if ('balance' in account) return account.balance;
  return 0;
};
