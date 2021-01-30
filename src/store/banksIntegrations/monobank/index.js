import { compareDesc } from 'date-fns';
import { api } from '@/api';
import { TooManyRequestsError } from '@/js/errors';
import { TRANSACTION_TYPES as TYPES, ERROR_CODES } from '@/js/const';
import {
  TransactionModelRecord,
  MONOTransactionRecord,
  MONOUserRecord,
  MONOAccountRecord,
} from '@/js/records';
import { transactionsVuexTypes } from '@/store/transactions/types';
import { bankMonobankVuexTypes } from './types';

const initialState = () => ({
  transactions: [],
  accounts: [],
  user: null,
  isUserExist: false,
  isMonoAccountPaired: true,
});

const state = initialState();

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
  [bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]:
    state => state.isMonoAccountPaired,
  [bankMonobankVuexTypes.IS_TOKEN_PRESENT]: state => !!state.user?.apiToken,
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
  [bankMonobankVuexTypes.RESET_STORE](state) {
    Object.assign(state, initialState());
  },
  [bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS](state, status) {
    state.isMonoAccountPaired = status;
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

    state.transactions[oldTx] = tx;
  },
  [bankMonobankVuexTypes.REPLACE_ACCOUNT](state, account) {
    const oldAccount = state.accounts
      .findIndex(item => account.accountId === item.accountId);

    state.accounts[oldAccount] = account;
  },
};

const actions = {
  async [bankMonobankVuexTypes.FETCH_USER]({ commit, getters }) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
    try {
      commit(bankMonobankVuexTypes.SET_USER_EXIST_STATUS, false);

      const result = await api.get('/banks/monobank/user');

      if (result) {
        commit(bankMonobankVuexTypes.SET_USER_EXIST_STATUS, true);
        commit(
          bankMonobankVuexTypes.SET_USER,
          new MONOUserRecord(result),
        );
        commit(bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS, true);
      }
    } catch (e) {
      if (e?.data?.code === ERROR_CODES.monobankUserNotPaired) {
        commit(bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS, false);
        return;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.FETCH_TRANSACTIONS]({ commit, getters }) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
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
      if (e?.data?.code === ERROR_CODES.monobankUserNotPaired) {
        commit(bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS, false);
        return;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.UPDATE_TRANSACTION_BY_ID](
    { commit, getters },
    { id, note, categoryId },
  ) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
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
      commit(
        `transactions/${transactionsVuexTypes.REPLACE_TRANSACTION}`,
        new MONOTransactionRecord(result),
        { root: true },
      );
    } catch (e) {
      if (e?.data?.code === ERROR_CODES.monobankUserNotPaired) {
        commit(bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS, false);
        return;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.FETCH_ACCOUNTS]({ commit, getters }) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
    try {
      const result = await api.get('/banks/monobank/accounts');

      commit(
        bankMonobankVuexTypes.SET_ACCOUNTS,
        result.map(i => new MONOAccountRecord(i)),
      );
      commit(bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS, true);
    } catch (e) {
      if (e?.data?.code === ERROR_CODES.monobankUserNotPaired) {
        commit(bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS, false);
        return;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.UPDATE_ACCOUNT_BY_ID](
    { commit, getters },
    { id, name, isEnabled },
  ) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
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
      if (e?.data?.code === ERROR_CODES.monobankUserNotPaired) {
        commit(bankMonobankVuexTypes.SET_PAIRED_ACCOUNT_STATUS, false);
        return;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.UPDATE_WEBHOOK]({ getters }, { clientId }) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
    try {
      await api.post('/banks/monobank/update-webhook', { clientId });
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.REFRESH_ACCOUNTS]({ commit, getters }) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
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
    { getters, dispatch },
    { accountId },
  ) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
    try {
      let latestTx = await api.get('/banks/monobank/transactions', {
        from: 1,
        limit: 1,
      });
      if (latestTx ?? latestTx.length) {
        latestTx = new MONOTransactionRecord(latestTx[0]);

        await dispatch(
          bankMonobankVuexTypes.LOAD_TRANSACTIONS_FOR_PERIOD,
          {
            accountId,
            from: new Date(latestTx.time).getTime(),
            to: new Date().getTime(),
          },
        );
      }
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.LOAD_TRANSACTIONS_FOR_PERIOD](
    { getters },
    { accountId, from, to },
  ) {
    if (!getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
    try {
      await api.get('/banks/monobank/load-transactions', {
        from,
        to,
        accountId,
      });
    } catch (e) {
      if (e instanceof TooManyRequestsError) {
        throw e;
      }
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.PAIR_ACCOUNT]({ getters }, { token }) {
    if (getters[bankMonobankVuexTypes.GET_ACCOUNT_PAIRED_STATUS]) {
      return;
    }
    try {
      await api.post('/banks/monobank/pair-user', { token });
    } catch (e) {
      throw new Error(e);
    }
  },
  async [bankMonobankVuexTypes.UPDATE_USER]({ commit }, { token, name }) {
    try {
      const response = await api.post('/banks/monobank/user', { apiToken: token, name });

      commit(
        bankMonobankVuexTypes.SET_USER,
        new MONOUserRecord(response),
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
