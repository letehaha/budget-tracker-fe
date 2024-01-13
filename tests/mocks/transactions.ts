import {
  TRANSACTION_TYPES, TRANSACTION_TRANSFER_NATURE, TransactionModel, PAYMENT_TYPES, ACCOUNT_TYPES,
} from 'shared-types';
import { USER } from './user';
import { USER_CATEGORIES } from './categories';
import { getUahAccount, getUah2Account } from './accounts';
import { USER_BASE_CURRENCY, USER_CURRENCIES } from './currencies';

const SHARED_TX_ACCOUNT = getUahAccount();
const SHARED_TX_BODY: TransactionModel = {
  id: 1,
  amount: 9,
  refAmount: 322.65,
  note: null,
  time: new Date(),
  userId: USER.id,
  transactionType: TRANSACTION_TYPES.income,
  paymentType: PAYMENT_TYPES.creditCard,
  accountId: SHARED_TX_ACCOUNT.id,
  categoryId: USER_CATEGORIES[0].id,
  currencyId: SHARED_TX_ACCOUNT.currencyId,
  currencyCode: USER_CURRENCIES
    .find(item => item.currencyId === SHARED_TX_ACCOUNT.currencyId).currency.code,
  accountType: ACCOUNT_TYPES.system,
  refCurrencyCode: USER_BASE_CURRENCY.currency.code,
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
  transferId: 'dsfsdfsdfsdf',
  transferNature: TRANSACTION_TRANSFER_NATURE.common_transfer,
};
export const COMMON_TRANSFER_TRANSACTION_OPPOSITE: TransactionModel = {
  ...COMMON_TRANSFER_TRANSACTION,
  transactionType: TRANSACTION_TYPES.income,
  amount: 20,
  accountId: getUah2Account().id,
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

export const buildExternalTransferTransaction = (type: TRANSACTION_TYPES): TransactionModel => ({
  ...COMMON_TRANSFER_TRANSACTION,
  transactionType: type,
  accountType: ACCOUNT_TYPES.monobank,
});

export const buildExtendedCommonTx = (data: Partial<TransactionModel> = {}): TransactionModel => ({
  ...SHARED_TX_BODY,
  ...data,
});
