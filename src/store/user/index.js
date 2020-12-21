import { api } from '@/api';
import { UserRecord } from '@/js/records';
import { AuthError } from '@/js/errors';
import { authVuexTypes } from '@/store/auth/types';
import { userVuexTypes } from './types';

const state = {
  user: null,
};

const getters = {
  [userVuexTypes.GET_USER]: state => state.user,
};

const mutations = {
  [userVuexTypes.SET_USER](state, user) {
    state.user = user;
  },
};

const actions = {
  async [userVuexTypes.FETCH_USER]({ commit, dispatch }) {
    try {
      const result = await api.get('/user');

      commit(userVuexTypes.SET_USER, new UserRecord(result));
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

export { userVuexTypes } from './types';
