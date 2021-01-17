import { api } from '@/api';
import { UserRecord } from '@/js/records';
import { userVuexTypes } from './types';

const initialState = () => ({
  user: null,
});

const state = initialState();

const getters = {
  [userVuexTypes.GET_USER]: state => state.user,
};

const mutations = {
  [userVuexTypes.SET_USER](state, user) {
    state.user = user;
  },
  [userVuexTypes.RESET_STORE](state) {
    Object.assign(state, initialState());
  },
};

const actions = {
  async [userVuexTypes.FETCH_USER]({ commit }) {
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
