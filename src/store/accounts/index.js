import { api } from '@/api';
import { AccountRecord } from '@/js/records';
import { accountsVuexTypes } from './types';

const initialState = () => ({
  accounts: [],
});

const state = initialState();

const getters = {
  [accountsVuexTypes.GET_ACCOUNTS]: state => state.accounts,
};

const mutations = {
  [accountsVuexTypes.SET_ACCOUNTS](state, accounts) {
    state.accounts = accounts;
  },
  [accountsVuexTypes.RESET_STATE](state) {
    Object.assign(state, initialState());
  },
};

const actions = {
  async [accountsVuexTypes.FETCH_ACCOUNTS]({ commit }) {
    try {
      const result = await api.get('/accounts');

      commit(
        accountsVuexTypes.SET_ACCOUNTS,
        result.map(i => new AccountRecord(i)),
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

export { accountsVuexTypes } from './types';
