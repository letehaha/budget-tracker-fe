import { createStore } from 'vuex';
import { api } from '@/api';

import {
  PaymentTypeRecord,
  AccountTypeRecord,
  TransactionTypeRecord,
} from '@/js/records';
import { indexVuexTypes } from './types';
import auth from './auth';
import transactions from './transactions';
import user from './user';
import categories from './categories';

const rootModule = {
  actions: {
    async [indexVuexTypes.FETCH_INITIAL_DATA]({ dispatch }) {
      await Promise.all([
        dispatch(indexVuexTypes.FETCH_ACCOUNT_TYPES),
        dispatch(indexVuexTypes.FETCH_PAYMENT_TYPES),
        dispatch(indexVuexTypes.FETCH_TRANSACTION_TYPES),
      ]);
    },
    async [indexVuexTypes.FETCH_ACCOUNT_TYPES]({ commit }) {
      const result = await api.get('/models/account-types');
      commit(
        indexVuexTypes.SET_ACCOUNT_TYPES,
        result.map(item => new AccountTypeRecord(item)),
      );
    },
    async [indexVuexTypes.FETCH_TRANSACTION_TYPES]({ commit }) {
      const result = await api.get('/models/transaction-types');
      commit(
        indexVuexTypes.SET_TRANSACTION_TYPES,
        result.map(item => new TransactionTypeRecord(item)),
      );
    },
    async [indexVuexTypes.FETCH_PAYMENT_TYPES]({ commit }) {
      const result = await api.get('/models/payment-types');
      commit(
        indexVuexTypes.SET_PAYMENT_TYPES,
        result.map(item => new PaymentTypeRecord(item)),
      );
    },
  },
  mutations: {
    [indexVuexTypes.SET_ACCOUNT_TYPES](state, accountTypes) {
      state.accountTypes = accountTypes;
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
    [indexVuexTypes.GET_PAYMENT_TYPES]: state => state.paymentTypes,
    [indexVuexTypes.GET_TRANSACTION_TYPES]: state => state.transactionTypes,
  },
  state: {
    accountTypes: [],
    paymentTypes: [],
    transactionTypes: [],
  },
};

export const store = createStore({
  strict: true,
  ...rootModule,
  modules: {
    auth,
    user,
    categories,
    transactions,
  },
});

export { indexVuexTypes } from './types';
export { authVuexTypes } from './auth';
export { transactionsVuexTypes } from './transactions';
export { userVuexTypes } from './user';
export { categoriesVuexTypes } from './categories';
