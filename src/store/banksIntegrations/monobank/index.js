import { api } from '@/api';
import { TooManyRequestsError } from '@/js/errors';
import { TRANSACTION_TYPES as TYPES } from '@/js/const';
import {
  TransactionModelRecord,
  MONOTransactionRecord,
  MONOUserRecord,
  MONOAccountRecord,
} from '@/js/records';
import { bankMonobankVuexTypes } from './types';

const state = {
  transactions: [],
  accounts: [],
  user: null,
  isUserExist: false,
};

const getters = {
  [bankMonobankVuexTypes.GET_USER]: state => state.user,
  [bankMonobankVuexTypes.IS_USER_EXIST]: state => state.isUserExist,
  [bankMonobankVuexTypes.GET_TRANSACTIONS]: state => state.transactions,
  [bankMonobankVuexTypes.GET_ACCOUNTS]: state => state.accounts,
  [bankMonobankVuexTypes.GET_ACTIVE_ACCOUNTS]:
    state => state.accounts.filter(item => item.isEnabled),
};

const mutations = {
  [bankMonobankVuexTypes.SET_TRANSACTIONS](state, txs) {
    state.transactions = txs;
  },
  [bankMonobankVuexTypes.SET_USER](state, user) {
    state.user = user;
  },
  [bankMonobankVuexTypes.SET_USER_EXIST_STATUS](state, status) {
    state.isUserExist = status;
  },
  [bankMonobankVuexTypes.SET_ACCOUNTS](state, accounts) {
    state.accounts = accounts;
  },
};

const actions = {
  async [bankMonobankVuexTypes.FETCH_USER]({ commit }) {
    try {
      commit(bankMonobankVuexTypes.SET_USER_EXIST_STATUS, false);

      const result = await api.get('/banks/monobank/user');

      if (result) {
        commit(bankMonobankVuexTypes.SET_USER_EXIST_STATUS, true);
        commit(
          bankMonobankVuexTypes.SET_USER,
          new MONOUserRecord(result),
        );
      }
    } catch (e) {
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.FETCH_TRANSACTIONS]({ commit }) {
    try {
      const result = await api.get('/banks/monobank/transactions');

      commit(
        bankMonobankVuexTypes.SET_TRANSACTIONS,
        result.map(i => new TransactionModelRecord(
          TYPES.monobank,
          new MONOTransactionRecord(i),
        )),
      );
    } catch (e) {
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.FETCH_ACCOUNTS]({ commit }) {
    try {
      const result = await api.get('/banks/monobank/accounts');

      commit(
        bankMonobankVuexTypes.SET_ACCOUNTS,
        result.map(i => new MONOAccountRecord(i)),
      );
    } catch (e) {
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.UPDATE_WEBHOOK](ctx, { clientId }) {
    try {
      await api.post('/banks/monobank/update-webhook', { clientId });
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};

export { bankMonobankVuexTypes } from './types';