import { api } from '@/api';
import { transactionsVuexTypes } from './types';
import { indexVuexTypes } from '../'
import { TransactionRecord } from '@/js/records';

export const actions = {
  async [transactionsVuexTypes.FETCH_TRANSACTIONS]({ commit, rootGetters }) {
    const result = await api.get('/transactions');

    commit(
      transactionsVuexTypes.SET_TRANSACTIONS,
      result.map(tx => new TransactionRecord({
        ...tx,
        paymentType: rootGetters[indexVuexTypes.GET_PAYMENT_TYPES]
          .find(item => item.id === tx.paymentType),
        account: rootGetters[indexVuexTypes.GET_ACCOUNTS]
          .find(item => item.id === tx.account),
        category: rootGetters[indexVuexTypes.GET_CATEGORIES]
          .find(item => item.id === tx.category),
        type: rootGetters[indexVuexTypes.GET_TRANSACTION_TYPES]
          .find(item => item.id === tx.type),
      })),
    );
  },
};
