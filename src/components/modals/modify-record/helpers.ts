import { TRANSACTION_TYPES } from 'shared-types';

export const getDestinationAccountId = ({
  isRecordExternal,
  sourceTransaction,
  accountId,
  toAccountId,
}) => {
  if (isRecordExternal) {
    const isIncome = sourceTransaction.transactionType === TRANSACTION_TYPES.income;
    return isIncome ? accountId : toAccountId;
  }
  return toAccountId;
};

export const getDestinationAmount = ({
  fromAmount,
  toAmount,
  isCurrenciesDifferent,
  isRecordExternal,
  sourceTransaction,
}) => {
  if (isRecordExternal) {
    const isIncome = sourceTransaction.transactionType === TRANSACTION_TYPES.income;
    return isIncome ? fromAmount : toAmount;
  }
  return isCurrenciesDifferent
    ? toAmount
    : fromAmount;
};
