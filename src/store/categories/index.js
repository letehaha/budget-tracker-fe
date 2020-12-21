import { api } from '@/api';
import { CategoryRecord } from '@/js/records';
import { AuthError } from '@/js/errors';
import { authVuexTypes } from '@/store/auth/types';
import { categoriesVuexTypes } from './types';

const state = {
  categories: [],
};

const getters = {
  [categoriesVuexTypes.GET_CATEGORIES]: state => state.categories,
};

const mutations = {
  [categoriesVuexTypes.SET_CATEGORIES](state, categories) {
    state.categories = categories;
  },
};

const actions = {
  async [categoriesVuexTypes.FETCH_CATEGORIES]({ commit, dispatch }) {
    try {
      const result = await api.get('/categories');

      commit(
        categoriesVuexTypes.SET_CATEGORIES,
        result.map(i => new CategoryRecord(i)),
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

export { categoriesVuexTypes } from './types';
