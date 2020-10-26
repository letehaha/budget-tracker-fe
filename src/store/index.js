import { createStore } from 'vuex';
import { api } from '@/api';

import {
  PaymentTypeRecord,
  AccountTypeRecord,
  AccountRecord,
  CurrencyRecord,
  CategoryRecord,
  TransactionRecord,
  TransactionTypeRecord,
} from '@/js/records';
import { COLLECTIONS_NAMES } from '@/js/const';
import { indexVuexTypes } from './types'

const rootModule = {
  actions: {
    async [indexVuexTypes.FETCH_INITIAL_DATA]({ dispatch }) {
      await Promise.all([
        dispatch(indexVuexTypes.FETCH_ACCOUNT_TYPES),
        dispatch(indexVuexTypes.FETCH_CURRENCIES),
        // dispatch(indexVuexTypes.FETCH_ACCOUNTS),
        // dispatch(indexVuexTypes.FETCH_CATEGORIES),
        // dispatch(indexVuexTypes.FETCH_PAYMENT_TYPES),
        // dispatch(indexVuexTypes.FETCH_TRANSACTION_TYPES),
      ]);
      // dispatch(`monobank/${monobankVuexTypes.FETCH_INITIAL_DATA}`);
      // dispatch(indexVuexTypes.FETCH_TRANSACTIONS);
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
      const data = [];
      const response = await this.$fireStore
        .collection(COLLECTIONS_NAMES.categories)
        .get();
      response.forEach(doc => {
        data.push(new CategoryRecord(doc.id, doc.data()));
      });
      commit(indexVuexTypes.SET_CATEGORIES, data);
    },
    async [indexVuexTypes.FETCH_TRANSACTION_TYPES]({ commit }) {
      const data = [];
      const response = await this.$fireStore
        .collection(COLLECTIONS_NAMES.transactionTypes)
        .get();
      response.forEach(doc => {
        data.push(new TransactionTypeRecord(doc.id, doc.data()));
      });
      commit(indexVuexTypes.SET_TRANSACTION_TYPES, data);
    },
    async [indexVuexTypes.FETCH_PAYMENT_TYPES]({ commit }) {
      const data = [];
      const response = await this.$fireStore
        .collection(COLLECTIONS_NAMES.paymentTypes)
        .get();
      response.forEach(doc => {
        data.push(new PaymentTypeRecord(doc.id, doc.data()));
      });
      commit(indexVuexTypes.SET_PAYMENT_TYPES, data);
    },
    async [indexVuexTypes.FETCH_ACCOUNTS]({ commit, getters }) {
      const data = [];
      const response = await this.$fireStore
        .collection(COLLECTIONS_NAMES.accounts)
        .get();

      response.forEach(doc => {
        const localData = doc.data();

        data.push(
          new AccountRecord(
            doc.id,
            {
              ...localData,
              type: getters[indexVuexTypes.GET_ACCOUNT_TYPES]
                .find(item => item.id === localData.type.id),
              currency: getters[indexVuexTypes.GET_CURRENCIES]
                .find(item => item.id === localData.currency.id),
            },
          ),
        );
      });
      commit(indexVuexTypes.SET_ACCOUNTS, data);
    },
    async [indexVuexTypes.FETCH_TRANSACTIONS]({ commit, getters }) {
      const listener = this.$fireStore
        .collection(COLLECTIONS_NAMES.transactions)
        .onSnapshot(snapshot => {
          const data = [];
          snapshot.forEach(doc => {
            const localData = doc.data();

            data.push(
              new TransactionRecord(
                doc.id,
                {
                  ...localData,
                  account: getters[indexVuexTypes.GET_ACCOUNTS]
                    .find(item => item.id === localData.account.id),
                  category: getters[indexVuexTypes.GET_CATEGORIES]
                    .find(item => item.id === localData.category.id),
                  paymentType: getters[indexVuexTypes.GET_PAYMENT_TYPES]
                    .find(item => item.id === localData.paymentType.id),
                  type: getters[indexVuexTypes.GET_TRANSACTION_TYPES]
                    .find(item => item.id === localData.type.id),
                },
              ),
            );
          });
          commit(indexVuexTypes.SET_TRANSACTIONS, data);
          commit(indexVuexTypes.SET_TRANSACTIONS_LISTENER, listener);
        });
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
    [indexVuexTypes.SET_TRANSACTIONS](state, transactions) {
      state.transactions = transactions;
    },
    [indexVuexTypes.SET_TRANSACTIONS_LISTENER](state, listener) {
      state.transactionsListener = listener;
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
    [indexVuexTypes.GET_TRANSACTIONS]: state => state.transactions,
    [indexVuexTypes.GET_TRANSACTION_BY_ID]:
      state => id => state.transactions.find(item => item.id === id),
    [indexVuexTypes.GET_TRANSACTION_TYPES]: state => state.transactionTypes,
  },
  state: {
    accounts: [],
    accountTypes: [],
    currencies: [],
    categories: [],
    paymentTypes: [],
    transactions: [],
    transactionTypes: [],
    transactionsListener: [],
  },
}

export const store = createStore({
  ...rootModule,
  modules: {},
})

export { indexVuexTypes } from './types'
