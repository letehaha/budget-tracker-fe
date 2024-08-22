import {
  TRANSACTION_TYPES,
  TRANSACTION_TRANSFER_NATURE,
  TransactionModel,
  PAYMENT_TYPES,
  ACCOUNT_TYPES,
} from "shared-types";
import { faker } from "@faker-js/faker";
import { USER } from "./user";
import { USER_CATEGORIES } from "./categories";
import { getUahAccount, getUah2Account } from "./accounts";
import { USER_BASE_CURRENCY, USER_CURRENCIES } from "./currencies";

const SHARED_TX_ACCOUNT = getUahAccount();
const buildCommonTxBody = (overrides: Partial<TransactionModel> = {}): TransactionModel => {
  const amount = faker.number.int({ min: 1000, max: 100000 });
  const currencyId = SHARED_TX_ACCOUNT.currencyId;
  const currency = USER_CURRENCIES.find((item) => item.currencyId === currencyId);
  const refAmount = amount * currency.exchangeRate;

  return {
    id: faker.number.int({ min: 1, max: 100000 }),
    amount,
    refAmount,
    note: null,
    time: new Date(),
    userId: USER.id,
    transactionType: TRANSACTION_TYPES.income,
    paymentType: PAYMENT_TYPES.creditCard,
    accountId: SHARED_TX_ACCOUNT.id,
    categoryId: USER_CATEGORIES[0].id,
    currencyId,
    currencyCode: currency.currency.code,
    accountType: ACCOUNT_TYPES.system,
    refCurrencyCode: USER_BASE_CURRENCY.currency.code,
    transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
    transferId: null,
    originalId: null,
    externalData: null,
    commissionRate: 0,
    refCommissionRate: 0,
    cashbackAmount: 0,
    ...overrides,
  };
};

export const buildSystemIncomeTransaction = (
  overrides: Partial<TransactionModel> = {},
): TransactionModel =>
  buildCommonTxBody({
    transactionType: TRANSACTION_TYPES.income,
    ...overrides,
  });

export const buildSystemExpenseTransaction = (
  overrides: Partial<TransactionModel> = {},
): TransactionModel =>
  buildCommonTxBody({
    transactionType: TRANSACTION_TYPES.expense,
    ...overrides,
  });

export const buildSystemTransferExpenseTransaction = (
  overrides: Partial<TransactionModel> = {},
): TransactionModel =>
  buildSystemExpenseTransaction({
    transferId: faker.string.uuid(),
    transferNature: TRANSACTION_TRANSFER_NATURE.common_transfer,
    ...overrides,
  });

export const buildSystemTransferOppositeTransaction = (
  overrides: Partial<TransactionModel> = {},
): TransactionModel =>
  buildSystemTransferExpenseTransaction({
    transactionType: TRANSACTION_TYPES.income,
    accountId: getUah2Account().id,
    ...overrides,
  });
export const buildOutOfWalletTransaction = (): TransactionModel =>
  buildCommonTxBody({
    transactionType: TRANSACTION_TYPES.expense,
    transferNature: TRANSACTION_TRANSFER_NATURE.transfer_out_wallet,
  });

export const buildExternalExpenseTransaction = (
  overrides: Partial<TransactionModel> = {},
): TransactionModel =>
  buildSystemExpenseTransaction({
    accountType: ACCOUNT_TYPES.monobank,
    ...overrides,
  });

export const buildExternalIncomeTransaction = (
  overrides: Partial<TransactionModel> = {},
): TransactionModel =>
  buildSystemIncomeTransaction({
    accountType: ACCOUNT_TYPES.monobank,
    ...overrides,
  });

export const buildExternalTransferTransaction = (type: TRANSACTION_TYPES): TransactionModel => ({
  ...buildSystemTransferExpenseTransaction(),
  transactionType: type,
  accountType: ACCOUNT_TYPES.monobank,
});

export const buildExtendedCommonTx = (data: Partial<TransactionModel> = {}): TransactionModel => ({
  ...buildCommonTxBody(),
  ...data,
});
