import { transactionsVuexTypes } from './types';

export const mutations = {
  [transactionsVuexTypes.SET_TRANSACTIONS](state, transactions) {
    state.transactions = transactions;
  },
};
