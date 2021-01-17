import { api } from '@/api';
import { CategoryRecord } from '@/js/records';
import { categoriesVuexTypes } from './types';

const initialState = () => ({
  categories: [],
});

const state = initialState();

const getters = {
  [categoriesVuexTypes.GET_CATEGORIES]: state => state.categories,
  [categoriesVuexTypes.GET_CATEGORY_BY_ID]: state => id => state.categories
    .find(item => item.id === id),
};

const mutations = {
  [categoriesVuexTypes.SET_CATEGORIES](state, categories) {
    state.categories = categories;
  },
  [categoriesVuexTypes.RESET_STORE](state) {
    Object.assign(state, initialState());
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
