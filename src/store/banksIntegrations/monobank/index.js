import { compareDesc } from 'date-fns';
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
  [bankMonobankVuexTypes.GET_TRANSACTIONS]: state => state.transactions
    .sort((a, b) => compareDesc(new Date(a.time), new Date(b.time))),
  [bankMonobankVuexTypes.GET_ACCOUNTS]: state => {
    const temp = [...state.accounts];

    return temp.sort(
      (a, b) => (b.accountId).localeCompare(a.accountId),
    );
  },
  [bankMonobankVuexTypes.GET_ACCOUNT_BY_ID]:
    state => id => state.accounts.find(i => i.accountId === id),
  [bankMonobankVuexTypes.GET_ACTIVE_ACCOUNTS]:
    state => state.accounts.filter(item => item.isEnabled),
};

const mutations = {
  [bankMonobankVuexTypes.SET_TRANSACTIONS](state, txs) {
    const txsIds = txs.map(item => item.id);
    state.transactions = [
      ...txs,
      ...state.transactions.filter(tx => !txsIds.includes(tx.id)),
    ];
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
  [bankMonobankVuexTypes.REPLACE_TRANSACTION](state, tx) {
    const oldTx = state.transactions
      .findIndex(item => tx.id === item.id);

    state.accounts[oldTx] = tx;
  },
  [bankMonobankVuexTypes.REPLACE_ACCOUNT](state, account) {
    const oldAccount = state.accounts
      .findIndex(item => account.accountId === item.accountId);

    state.accounts[oldAccount] = account;
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
  async [bankMonobankVuexTypes.UPDATE_TRANSACTION_BY_ID](
    { commit },
    { id, note, categoryId },
  ) {
    try {
      const result = await api.post('/banks/monobank/transaction', {
        id,
        note,
        categoryId,
      });

      commit(
        bankMonobankVuexTypes.REPLACE_TRANSACTION,
        new MONOTransactionRecord(result),
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
  async [bankMonobankVuexTypes.UPDATE_ACCOUNT_BY_ID](
    { commit },
    { id, name, isEnabled },
  ) {
    try {
      const result = await api.post('/banks/monobank/account', {
        accountId: id,
        name,
        isEnabled,
      });

      commit(
        bankMonobankVuexTypes.REPLACE_ACCOUNT,
        new MONOAccountRecord(result),
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
  async [bankMonobankVuexTypes.REFRESH_ACCOUNTS]({ commit }) {
    try {
      const accounts = await api.get('/banks/monobank/refresh-accounts');

      commit(
        bankMonobankVuexTypes.SET_ACCOUNTS,
        accounts.map(i => new MONOAccountRecord(i)),
      );
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.LOAD_TRANSACTIONS_FROM_LATEST](
    ctx,
    { accountId },
  ) {
    try {
      let latestTx = await api.get('/banks/monobank/transactions', {
        from: 1,
        limit: 1,
      });
      if (latestTx ?? latestTx.length) {
        latestTx = new MONOTransactionRecord(latestTx[0]);

        await api.get('/banks/monobank/load-transactions', {
          from: new Date(latestTx.time).getTime(),
          to: new Date().getTime(),
          accountId,
        });
      }
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
