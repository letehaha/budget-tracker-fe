import { MutationTree, ActionTree, GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { api } from '@/api';
import { AccountRecord } from '@/js/records';
import { accountsVuexTypes } from './types';

interface State {
  accounts: unknown[];
}

const initialState = (): State => ({
  accounts: [],
});

const state = initialState();

const getters: GetterTree<State, RootState> = {
  [accountsVuexTypes.GET_ACCOUNTS]: state => state.accounts,
};

const mutations: MutationTree<State> = {
  [accountsVuexTypes.SET_ACCOUNTS](state, accounts) {
    state.accounts = accounts;
  },
  [accountsVuexTypes.RESET_STATE](state) {
    Object.assign(state, initialState());
  },
};

const actions: ActionTree<State, RootState> = {
  async [accountsVuexTypes.FETCH_ACCOUNTS]({ commit }) {
    try {
      const result = await api.get('/accounts');

      commit(
        accountsVuexTypes.SET_ACCOUNTS,
        result.map(i => new AccountRecord(i)),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
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
