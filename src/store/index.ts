import {
  createStore, GetterTree, MutationTree, ActionTree,
} from 'vuex';
import { PaymentTypeResponse } from 'shared-types';
import { api } from '@/api';

import {
  PaymentTypeRecord,
  AccountTypeRecord,
  CurrencyRecord,
  TransactionTypeRecord,
} from '@/js/records';
import { indexVuexTypes, RootState } from './types';
import auth, { namespace as authNamespace } from './auth';
import transactions, { namespace as txsNamespace } from './transactions';
import user from './user';
import categories from './categories';
import accounts, { accountsVuexTypes } from './accounts';
import bankMonobank, {
  bankMonobankVuexTypes,
  namespace as bankMonobankNamespace,
} from './banksIntegrations/monobank';
import cryptoBinance from './cryptoIntegrations/binance';

const state: RootState = {
  accountTypes: [],
  paymentTypes: [],
  currencies: [],
  transactionTypes: [],
  isAppInitialized: false,
};

const getters: GetterTree<RootState, RootState> = {
  [indexVuexTypes.GET_APP_INIT_STATUS]: state => state.isAppInitialized,
  [indexVuexTypes.GET_ACCOUNT_TYPES]: state => state.accountTypes,
  [indexVuexTypes.GET_PAYMENT_TYPES]: state => state.paymentTypes,
  [indexVuexTypes.GET_CURRENCIES]: state => state.currencies,
  [indexVuexTypes.GET_TRANSACTION_TYPES]: state => state.transactionTypes,
  [indexVuexTypes.GET_TRANSACTION_TYPE_BY_ID]: state => id => state
    .transactionTypes.find(item => item.id === id),
};

const mutations: MutationTree<RootState> = {
  [indexVuexTypes.SET_APP_INITIALIZE_STATUS](state, status) {
    state.isAppInitialized = status;
  },
  [indexVuexTypes.SET_ACCOUNT_TYPES](state, accountTypes) {
    state.accountTypes = accountTypes;
  },
  [indexVuexTypes.SET_PAYMENT_TYPES](state, paymentTypes) {
    state.paymentTypes = paymentTypes;
  },
  [indexVuexTypes.SET_TRANSACTION_TYPES](state, types) {
    state.transactionTypes = types;
  },
  [indexVuexTypes.SET_CURRENCIES](state, currencies) {
    state.currencies = currencies;
  },
};

const actions: ActionTree<RootState, RootState> = {
  async [indexVuexTypes.FETCH_INITIAL_DATA]({ commit, dispatch }) {
    commit(indexVuexTypes.SET_APP_INITIALIZE_STATUS, false);

    await Promise.all([
      dispatch(indexVuexTypes.FETCH_ACCOUNT_TYPES),
      dispatch(indexVuexTypes.FETCH_PAYMENT_TYPES),
      dispatch(indexVuexTypes.FETCH_TRANSACTION_TYPES),
      dispatch(indexVuexTypes.FETCH_CURRENCIES),
      dispatch(`accounts/${accountsVuexTypes.FETCH_ACCOUNTS}`),
      dispatch(`bankMonobank/${bankMonobankVuexTypes.FETCH_USER}`),
    ]);

    commit(indexVuexTypes.SET_APP_INITIALIZE_STATUS, true);
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
    const result: PaymentTypeResponse[] = await api.get('/models/payment-types');

    commit(
      indexVuexTypes.SET_PAYMENT_TYPES,
      result.map(item => new PaymentTypeRecord(item)),
    );
  },
  async [indexVuexTypes.FETCH_CURRENCIES]({ commit }) {
    const result = await api.get('/models/currencies');

    commit(
      indexVuexTypes.SET_CURRENCIES,
      result.map(item => new CurrencyRecord(item)),
    );
  },
};

export const store = createStore({
  strict: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    [authNamespace]: auth,
    user,
    categories,
    accounts,
    [txsNamespace]: transactions,
    [bankMonobankNamespace]: bankMonobank,
    cryptoBinance,
  },
});

export { useRootStore } from './composable';
export { indexVuexTypes } from './types';
export { authVuexTypes, useAuthStore } from './auth';
export { transactionsVuexTypes, useTransactionsStore } from './transactions';
export { userVuexTypes } from './user';
export { categoriesVuexTypes } from './categories';
export { accountsVuexTypes } from './accounts';
export { bankMonobankVuexTypes, useBankMonobankStore } from './banksIntegrations/monobank';
export { cryptoBinanceVuexTypes } from './cryptoIntegrations/binance';
