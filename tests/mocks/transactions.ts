import {
  TRANSACTION_TYPES, TRANSACTION_TRANSFER_NATURE, TransactionModel, PAYMENT_TYPES, ACCOUNT_TYPES,
} from 'shared-types';
import { ACCOUNTS } from './accounts';

const SHARED_TX_BODY: TransactionModel = {
  id: 1274,
  amount: 9,
  refAmount: 322.65,
  note: null,
  time: new Date(),
  userId: 40,
  transactionType: TRANSACTION_TYPES.income,
  paymentType: PAYMENT_TYPES.creditCard,
  accountId: ACCOUNTS[0].id,
  categoryId: 3121,
  currencyId: 769,
  currencyCode: 'EUR',
  accountType: ACCOUNT_TYPES.system,
  refCurrencyCode: 'UAH',
  transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
  transferId: null,
  originalId: null,
  externalData: null,
  commissionRate: 0,
  refCommissionRate: 0,
  cashbackAmount: 0,
};

export const INCOME_TRANSACTION: TransactionModel = {
  ...SHARED_TX_BODY,
  transactionType: TRANSACTION_TYPES.income,
  transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
};
export const EXPENSE_TRANSACTION: TransactionModel = {
  ...SHARED_TX_BODY,
  transactionType: TRANSACTION_TYPES.expense,
  transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
};
export const COMMON_TRANSFER_TRANSACTION: TransactionModel = {
  ...SHARED_TX_BODY,
  transactionType: TRANSACTION_TYPES.expense,
  transferNature: TRANSACTION_TRANSFER_NATURE.common_transfer,
};
export const OUT_OF_WALLET_TRANSACTION: TransactionModel = {
  ...SHARED_TX_BODY,
  transactionType: TRANSACTION_TYPES.expense,
  transferNature: TRANSACTION_TRANSFER_NATURE.transfer_out_wallet,
};

export const EXTERNAL_EXPENSE_TRANSACTION: TransactionModel = {
  ...EXPENSE_TRANSACTION,
  accountType: ACCOUNT_TYPES.monobank,
};

export const EXTERNAL_INCOME_TRANSACTION: TransactionModel = {
  ...INCOME_TRANSACTION,
  accountType: ACCOUNT_TYPES.monobank,
};
