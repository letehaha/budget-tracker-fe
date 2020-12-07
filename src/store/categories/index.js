import { api } from '@/api';
import { CategoryRecord } from '@/js/records';
import { categoriesVuexTypes } from './types';

const state = {
  categories: [],
};

const getters = {
  [categoriesVuexTypes.GET_CATEGORIES]: state => state.user,
};

const mutations = {
  [categoriesVuexTypes.SET_CATEGORIES](state, user) {
    state.user = user;
  },
};

const actions = {
  async [categoriesVuexTypes.FETCH_CATEGORIES]({ commit }) {
    try {
      const result = await api.get('/categories');

      commit(
        categoriesVuexTypes.SET_CATEGORIES,
        result.map(i => new CategoryRecord(i)),
      );
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

export { categoriesVuexTypes } from './types';
