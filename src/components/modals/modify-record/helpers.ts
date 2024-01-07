import {
  TRANSACTION_TYPES, TRANSACTION_TRANSFER_NATURE, TransactionModel, AccountModel,
} from 'shared-types';
import { FORM_TYPES } from './types';

export const getDestinationAccount = ({
  isRecordExternal,
  sourceTransaction,
  account,
  toAccount,
}: {
  isRecordExternal: boolean;
  sourceTransaction: TransactionModel;
  account: AccountModel;
  toAccount: AccountModel;
}) => {
  if (isRecordExternal) {
    const isIncome = sourceTransaction.transactionType === TRANSACTION_TYPES.income;
    return isIncome ? account : toAccount;
  }
  return toAccount;
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

export const getFormTypeFromTransaction = (tx: TransactionModel): FORM_TYPES => {
  if ([
    TRANSACTION_TRANSFER_NATURE.common_transfer,
    TRANSACTION_TRANSFER_NATURE.transfer_out_wallet,
  ].includes(tx.transferNature)) {
    return FORM_TYPES.transfer;
  }

  return tx.transactionType === TRANSACTION_TYPES.expense
    ? FORM_TYPES.expense
    : FORM_TYPES.income;
};

export const getTxTypeFromFormType = (formType: FORM_TYPES): TRANSACTION_TYPES => {
  if (formType === FORM_TYPES.transfer) return TRANSACTION_TYPES.expense;

  return formType === FORM_TYPES.expense
    ? TRANSACTION_TYPES.expense
    : TRANSACTION_TYPES.income;
};
