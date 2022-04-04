import { Dispatch, Commit, Store } from 'vuex';
import {
  PaymentTypeRecord,
  AccountTypeRecord,
  CurrencyRecord,
  TransactionTypeRecord,
} from '@/js/records';

const mutations = {
  SET_ACCOUNT_TYPES: 'SET_ACCOUNT_TYPES',
  SET_PAYMENT_TYPES: 'SET_PAYMENT_TYPES',
  SET_TRANSACTION_TYPES: 'SET_TRANSACTION_TYPES',
  SET_APP_INITIALIZE_STATUS: 'SET_APP_INITIALIZE_STATUS',
  SET_CURRENCIES: 'SET_CURRENCIES',
};
const actions = {
  FETCH_INITIAL_DATA: 'FETCH_INITIAL_DATA',
  FETCH_ACCOUNT_TYPES: 'FETCH_ACCOUNT_TYPES',
  FETCH_PAYMENT_TYPES: 'FETCH_PAYMENT_TYPES',
  FETCH_TRANSACTION_TYPES: 'FETCH_TRANSACTION_TYPES',
  FETCH_CURRENCIES: 'FETCH_CURRENCIES',
};
const getters = {
  GET_ACCOUNT_TYPES: 'GET_ACCOUNT_TYPES',
  GET_PAYMENT_TYPES: 'GET_PAYMENT_TYPES',
  GET_TRANSACTION_TYPES: 'GET_TRANSACTION_TYPES',
  GET_APP_INIT_STATUS: 'GET_APP_INIT_STATUS',
  GET_TRANSACTION_TYPE_BY_ID: 'GET_TRANSACTION_TYPE_BY_ID',
  GET_CURRENCIES: 'GET_CURRENCIES',
};

export const indexVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});

export interface RootState {
  accountTypes: AccountTypeRecord[];
  paymentTypes: PaymentTypeRecord[];
  currencies: CurrencyRecord[];
  transactionTypes: TransactionTypeRecord[];
  isAppInitialized: boolean;
}

export type ActionContext = {
  commit: Commit;
  dispatch: Dispatch;
}

export type CustomStore = Store<RootState>;
