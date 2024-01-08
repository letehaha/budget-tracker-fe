import { AccountModel, CategoryModel } from 'shared-types';
import type { VerbosePaymentType } from '@/common/const';

export enum FORM_TYPES {
  income = 'income',
  expense = 'expense',
  transfer = 'transfer',
}

export interface UI_FORM_STRUCT {
  amount: number;
  account: AccountModel;
  toAccount?: AccountModel;
  category: CategoryModel;
  time: string;
  paymentType: VerbosePaymentType;
  note?: string;
  type: FORM_TYPES;
  targetAmount?: number;
}
