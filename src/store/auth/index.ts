import { ERROR_CODES } from 'shared-types';
import { MutationTree, ActionTree, GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { api } from '@/api';
import { userVuexTypes } from '@/store/user';
import { categoriesVuexTypes } from '@/store/categories';
import { bankMonobankVuexTypes } from '@/store/banksIntegrations/monobank';
import { transactionsVuexTypes } from '@/store/transactions';
import { authVuexTypes } from './types';

interface State {
  user: null;
  isLoggedIn: boolean;
  userToken: string | null;
}

const state: State = {
  isLoggedIn: false,
  user: null,
  userToken: null,
};

const getters: GetterTree<State, RootState> = {
  [authVuexTypes.GET_IS_LOGGED_IN]: state => state.isLoggedIn,
  [authVuexTypes.GET_USER]: state => state.user,
  [authVuexTypes.GET_USER_TOKEN]: state => state.userToken,
};

const mutations: MutationTree<State> = {
  [authVuexTypes.SET_TOKEN](state, token) {
    state.userToken = token;
  },
  [authVuexTypes.SET_IS_LOGGED_IN](state, status) {
    state.isLoggedIn = status;
  },
};

const actions: ActionTree<State, RootState> = {
  async [authVuexTypes.LOG_IN]({ commit, dispatch }, { password, username }) {
    try {
      const result = await api.post('/auth/login', {
        password,
        username,
      });

      if (result.token) {
        api.setToken(result.token);

        await dispatch(`user/${userVuexTypes.FETCH_USER}`, null, { root: true });
        await dispatch(`categories/${categoriesVuexTypes.FETCH_CATEGORIES}`, null, { root: true });

        commit(authVuexTypes.SET_TOKEN, result.token);
        localStorage.setItem('user-token', result.token);
        commit(authVuexTypes.SET_IS_LOGGED_IN, true);
      }
    } catch (e) {
      const possibleErrorCodes = [
        ERROR_CODES.notFound,
        ERROR_CODES.invalidCredentials,
      ];

      if (possibleErrorCodes.includes(e.data.code)) {
        throw e.data;
      }
    }
  },
  async [authVuexTypes.SIGN_UP]({ dispatch }, { password, username }) {
    try {
      await api.post('/auth/register', { password, username });

      await dispatch(authVuexTypes.LOG_IN, { password, username });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  },
  [authVuexTypes.LOG_OUT]({ commit }) {
    api.setToken('');
    localStorage.setItem('user-token', '');
    commit(authVuexTypes.SET_TOKEN, null);
    commit(authVuexTypes.SET_IS_LOGGED_IN, false);
    // TODO:
    // commit(`accounts/${accountsVuexTypes.RESET_STATE}`, null, { root: true });
    commit(`bankMonobank/${bankMonobankVuexTypes.RESET_STORE}`, null, { root: true });
    commit(`categories/${categoriesVuexTypes.RESET_STORE}`, null, { root: true });
    commit(`transactions/${transactionsVuexTypes.RESET_STORE}`, null, { root: true });
    commit(`user/${userVuexTypes.RESET_STORE}`, null, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export { authVuexTypes, namespace } from './types';
export { useAuthStore } from './composable';
