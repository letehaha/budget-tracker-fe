import { api } from '@/api';
import { TRANSACTION_TYPES as TYPES } from '@/js/const';
import {
  TransactionRecord,
  TransactionModelRecord,
  MONOTransactionRecord,
} from '@/js/records';
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
  async [transactionsVuexTypes.FETCH_TRANSACTIONS]({ commit }, { limit }) {
    try {
      const result = await api.get('/transactions', { limit });

      commit(
        transactionsVuexTypes.SET_TRANSACTIONS,
        result.map((i) => {
          if (i.transactionEntityId === TYPES.system) {
            return new TransactionModelRecord(
              TYPES.system,
              new TransactionRecord(i),
            );
          }
          if (i.transactionEntityId === TYPES.monobank) {
            return new TransactionModelRecord(
              TYPES.monobank,
              new MONOTransactionRecord(i),
            );
          }
          return undefined;
        }),
      );
    } catch (e) {
      throw new Error(e);
    }
  },
  async [transactionsVuexTypes.CREATE_TRANSACTION](
    { dispatch },
    {
      amount,
      note = '',
      time,
      transactionTypeId,
      paymentTypeId,
      accountId,
      categoryId,
    },
  ) {
    try {
      await api.post('/transactions', {
        amount,
        note,
        time,
        transactionTypeId,
        paymentTypeId,
        accountId,
        categoryId,
      });

      await dispatch(transactionsVuexTypes.FETCH_TRANSACTIONS);
    } catch (e) {
      throw new Error(e);
    }
  },
  async [transactionsVuexTypes.EDIT_TRANSACTION](
    { dispatch },
    {
      txId,
      amount,
      note = '',
      time,
      transactionTypeId,
      paymentTypeId,
      accountId,
      categoryId,
    },
  ) {
    try {
      await api.put(`/transactions/${txId}`, {
        amount,
        note,
        time,
        transactionTypeId,
        paymentTypeId,
        accountId,
        categoryId,
      });

      await dispatch(transactionsVuexTypes.FETCH_TRANSACTIONS);
    } catch (e) {
      throw new Error(e);
    }
  },
  async [transactionsVuexTypes.DELETE_TRANSACTION]({ dispatch }, { txId }) {
    try {
      await api.delete(`/transactions/${txId}`);

      await dispatch(transactionsVuexTypes.FETCH_TRANSACTIONS);
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

export { transactionsVuexTypes } from './types';
