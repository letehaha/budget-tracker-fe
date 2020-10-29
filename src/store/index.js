import { createStore } from 'vuex';
import { api } from '@/api';

import {
  PaymentTypeRecord,
  AccountTypeRecord,
  AccountRecord,
  CurrencyRecord,
  CategoryRecord,
  TransactionTypeRecord,
} from '@/js/records';
import { indexVuexTypes } from './types'
import { transactionsVuexTypes } from './transactions';
import transactions from './transactions';

const rootModule = {
  actions: {
    async [indexVuexTypes.FETCH_INITIAL_DATA]({ dispatch }) {
      await Promise.all([
        dispatch(indexVuexTypes.FETCH_ACCOUNT_TYPES),
        dispatch(indexVuexTypes.FETCH_CURRENCIES),
        dispatch(indexVuexTypes.FETCH_CATEGORIES),
        dispatch(indexVuexTypes.FETCH_PAYMENT_TYPES),
        dispatch(indexVuexTypes.FETCH_TRANSACTION_TYPES),
      ]);
      await dispatch(indexVuexTypes.FETCH_ACCOUNTS);
      await dispatch(`transactions/${transactionsVuexTypes.FETCH_TRANSACTIONS}`);
      // dispatch(`monobank/${monobankVuexTypes.FETCH_INITIAL_DATA}`);
    },
    async [indexVuexTypes.FETCH_ACCOUNT_TYPES]({ commit }) {
      const result = await api.get('/models/account-types');
      commit(indexVuexTypes.SET_ACCOUNT_TYPES, result.map(item => new AccountTypeRecord(item)));
    },
    async [indexVuexTypes.FETCH_CURRENCIES]({ commit }) {
      const result = await api.get('/models/currencies');
      commit(indexVuexTypes.SET_CURRENCIES, result.map(item => new CurrencyRecord(item)));
    },
    async [indexVuexTypes.FETCH_CATEGORIES]({ commit }) {
      const result = await api.get('/models/categories');
      commit(indexVuexTypes.SET_CATEGORIES, result.map(item => new CategoryRecord(item)));
    },
    async [indexVuexTypes.FETCH_TRANSACTION_TYPES]({ commit }) {
      const result = await api.get('/models/transaction-types');
      commit(indexVuexTypes.SET_TRANSACTION_TYPES, result.map(item => new TransactionTypeRecord(item)));
    },
    async [indexVuexTypes.FETCH_PAYMENT_TYPES]({ commit }) {
      const result = await api.get('/models/payment-types');
      commit(indexVuexTypes.SET_PAYMENT_TYPES, result.map(item => new PaymentTypeRecord(item)));
    },
    async [indexVuexTypes.FETCH_ACCOUNTS]({ commit, getters }) {
      const result = await api.get('/accounts');

      commit(
        indexVuexTypes.SET_ACCOUNTS,
        result.map(type => new AccountRecord({
          ...type,
          type: getters[indexVuexTypes.GET_ACCOUNT_TYPES]
            .find(item => item.id === type.type),
          currency: getters[indexVuexTypes.GET_CURRENCIES]
            .find(item => item.id === type.currency),
        })),
      );
    },
  },
  mutations: {
    [indexVuexTypes.SET_ACCOUNT_TYPES](state, accountTypes) {
      state.accountTypes = accountTypes;
    },
    [indexVuexTypes.SET_ACCOUNTS](state, accounts) {
      state.accounts = accounts;
    },
    [indexVuexTypes.SET_CURRENCIES](state, currencies) {
      state.currencies = currencies;
    },
    [indexVuexTypes.SET_CATEGORIES](state, categories) {
      state.categories = categories;
    },
    [indexVuexTypes.SET_PAYMENT_TYPES](state, paymentTypes) {
      state.paymentTypes = paymentTypes;
    },
    [indexVuexTypes.SET_TRANSACTION_TYPES](state, types) {
      state.transactionTypes = types;
    },
  },
  getters: {
    [indexVuexTypes.GET_ACCOUNT_TYPES]: state => state.accountTypes,
    [indexVuexTypes.GET_ACCOUNTS]: state => state.accounts,
    [indexVuexTypes.GET_CURRENCIES]: state => state.currencies,
    [indexVuexTypes.GET_CATEGORIES]: state => state.categories,
    [indexVuexTypes.GET_PAYMENT_TYPES]: state => state.paymentTypes,
    [indexVuexTypes.GET_TRANSACTION_TYPES]: state => state.transactionTypes,
  },
  state: {
    accounts: [],
    accountTypes: [],
    currencies: [],
    categories: [],
    paymentTypes: [],
    transactionTypes: [],
  },
};

export const store = createStore({
  strict: true,
  ...rootModule,
  modules: {
    transactions,
  },
});

export { indexVuexTypes } from './types';
export { transactionsVuexTypes } from './transactions';
