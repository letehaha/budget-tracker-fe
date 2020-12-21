import { api } from '@/api';
import { AccountRecord } from '@/js/records';
import { AuthError } from '@/js/errors';
import { authVuexTypes } from '@/store/auth/types';
import { accountsVuexTypes } from './types';

const state = {
  accounts: [],
};

const getters = {
  [accountsVuexTypes.GET_ACCOUNTS]: state => state.accounts,
};

const mutations = {
  [accountsVuexTypes.SET_ACCOUNTS](state, accounts) {
    state.accounts = accounts;
  },
};

const actions = {
  async [accountsVuexTypes.FETCH_ACCOUNTS]({ commit, dispatch }) {
    try {
      const result = await api.get('/accounts');

      commit(
        accountsVuexTypes.SET_ACCOUNTS,
        result.map(i => new AccountRecord(i)),
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

export { accountsVuexTypes } from './types';
