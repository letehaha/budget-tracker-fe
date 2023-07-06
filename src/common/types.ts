import { ACCOUNT_TYPES } from 'shared-types';

export type UserRecord = {
  id?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  avatar?: string;
  totalBalance?: number;
  defaultCategoryId?: number;
}

export type AccountRecord = {
  systemType: ACCOUNT_TYPES.system,
  id?: number;
  name?: string;
  currentBalance?: number;
  refCurrentBalance?: number;
  creditLimit?: number;
  refCreditLimit?: number;
  accountTypeId?: number;
  currencyId?: number;
  userId?: number;
}

export type MonobankAccountRecord = {
  systemType: ACCOUNT_TYPES.monobank,
  accountId?: string;
  balance?: number;
  creditLimit?: number;
  cashbackType?: string;
  maskedPan?: string;
  type?: string;
  iban?: string;
  isEnabled?: boolean;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  monoUserId?: number;
  currencyId?: number;
  accountTypeId?: number;
}
