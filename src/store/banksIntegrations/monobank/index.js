import { api } from '@/api';
import { TooManyRequestsError } from '@/js/errors';
import { TransactionRecord, MONOUserRecord } from '@/js/records';
import { bankMonobankVuexTypes } from './types';

const state = {
  transactions: [],
  user: null,
};

const getters = {
  [bankMonobankVuexTypes.GET_TRANSACTIONS]: state => state.transactions,
  [bankMonobankVuexTypes.GET_USER]: state => state.user,
};

const mutations = {
  [bankMonobankVuexTypes.SET_TRANSACTIONS](state, txs) {
    state.transactions = txs;
  },
  [bankMonobankVuexTypes.SET_USER](state, user) {
    state.user = user;
  },
};

const actions = {
  async [bankMonobankVuexTypes.FETCH_USER]({ commit }) {
    try {
      const result = await api.get('/banks/monobank/user');

      commit(
        bankMonobankVuexTypes.SET_USER,
        new MONOUserRecord(result),
      );
    } catch (e) {
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.FETCH_TRANSACTIONS]({ commit }) {
    try {
      const result = await api.get('/banks/monobank/transactions');

      commit(
        bankMonobankVuexTypes.SET_TRANSACTIONS,
        result.map(i => new TransactionRecord(i)),
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
