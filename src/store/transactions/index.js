import { api } from '@/api';
import { TransactionRecord } from '@/js/records';
import { transactionsVuexTypes } from './types';

const state = {
  transactions: [],
};

const getters = {
  [transactionsVuexTypes.GET_TRANSACTIONS]: state => state.transactions,
};

const mutations = {
  [transactionsVuexTypes.SET_TRANSACTIONS](state, txs) {
    state.transactions = txs;
  },
};

const actions = {
  async [transactionsVuexTypes.FETCH_TRANSACTIONS]({ commit }) {
    try {
      const result = await api.get('/transactions');

      commit(
        transactionsVuexTypes.SET_TRANSACTIONS,
        result.map(i => new TransactionRecord(i)),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
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

export { transactionsVuexTypes } from './types';
