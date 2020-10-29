import { transactionsVuexTypes } from './types';

export const getters = {
  [transactionsVuexTypes.GET_TRANSACTIONS]: state => state.transactions,
  [transactionsVuexTypes.GET_TRANSACTION_BY_ID]:
    state => id => state.transactions.find(item => item.id === id),
};
