import { api } from '@/api';
import { TransactionRecord } from '@/js/records';
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
  async [bankMonobankVuexTypes.FETCH_TRANSACTIONS]({ commit }) {
    try {
      const result = await api.get('/transactions');

      commit(
        bankMonobankVuexTypes.SET_TRANSACTIONS,
        result.map(i => new TransactionRecord(i)),
      );
    } catch (e) {
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
