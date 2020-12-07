import { api } from '@/api';
import { authVuexTypes } from './types';

const state = {
  isLoggedIn: false,
  user: null,
  userToken: null,
};

const getters = {
  [authVuexTypes.GET_IS_LOGGED_IN]: state => state.isLoggedIn,
  [authVuexTypes.GET_USER]: state => state.user,
  [authVuexTypes.GET_USER_TOKEN]: state => state.userToken,
};

const mutations = {
  [authVuexTypes.SET_TOKEN](state, token) {
    state.userToken = token;
  },
  [authVuexTypes.SET_IS_LOGGED_IN](state, status) {
    state.isLoggedIn = status;
  },
};

const actions = {
  async [authVuexTypes.LOG_IN]({ commit }, { password, username }) {
    try {
      const result = await api.post('/auth/login', {
        password,
        username,
      });

      commit(authVuexTypes.SET_TOKEN, result.token);
      api.setToken(result.token);
      localStorage.setItem('user-token', result.token);
      commit(authVuexTypes.SET_IS_LOGGED_IN, true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
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

export { authVuexTypes } from './types';
