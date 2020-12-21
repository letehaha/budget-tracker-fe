import { api } from '@/api';
import { TransactionRecord } from '@/js/records';
import { AuthError } from '@/js/errors';
import { authVuexTypes } from '@/store/auth/types';
import { bankMonobankVuexTypes } from './types';

const state = {
  transactions: [],
};

const getters = {
  [bankMonobankVuexTypes.GET_TRANSACTIONS]: state => state.transactions,
};

const mutations = {
  [bankMonobankVuexTypes.SET_TRANSACTIONS](state, txs) {
    state.transactions = txs;
  },
};

const actions = {
  async [bankMonobankVuexTypes.FETCH_TRANSACTIONS]({ commit, dispatch }) {
    try {
      const result = await api.get('/transactions');

      commit(
        bankMonobankVuexTypes.SET_TRANSACTIONS,
        result.map(i => new TransactionRecord(i)),
      );
    } catch (e) {
      if (e.constructor === AuthError) {
        dispatch(`auth/${authVuexTypes.LOG_OUT}`, null, { root: true });
        return;
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
