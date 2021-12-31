import {
  MutationTree,
  ActionTree,
  GetterTree,
  Commit,
} from 'vuex';
import { api } from '@/api';
import { UserRecord } from '@/js/records';
import { RootState } from '@/store/types';
import { userVuexTypes } from './types';

interface State {
  user: null;
}

const initialState = (): State => ({
  user: null,
});

const state = initialState();

const getters: GetterTree<State, RootState> = {
  [userVuexTypes.GET_USER]: state => state.user,
};

const mutations: MutationTree<State> = {
  [userVuexTypes.SET_USER](state, user) {
    state.user = user;
  },
  [userVuexTypes.RESET_STORE](state) {
    Object.assign(state, initialState());
  },
};

const actions: ActionTree<State, RootState> = {
  async [userVuexTypes.FETCH_USER]({ commit }: { commit: Commit }) {
    try {
      const result = await api.get('/user');

      commit(userVuexTypes.SET_USER, new UserRecord(result));
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

export { userVuexTypes } from './types';
