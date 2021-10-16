import { TRANSACTION_TYPES } from 'shared-types';

export interface TransactionModel {
  type: TRANSACTION_TYPES;
  tx: unknown;
}
