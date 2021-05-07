import { api } from '@/api';
import { CategoryRecord } from '@/js/records';
import { categoriesVuexTypes } from './types';
import { getRawCategories } from './helpers';

const initialState = () => ({
  categories: [],
  rawCategories: [],
});

const state = initialState();

const getters = {
  [categoriesVuexTypes.GET_CATEGORIES]: state => state.categories,
  [categoriesVuexTypes.GET_RAW_CATEGORIES]: state => state.rawCategories,
  [categoriesVuexTypes.GET_CATEGORY_BY_ID]: state => id => state.rawCategories
    .find(item => item.id === id),
};

const mutations = {
  [categoriesVuexTypes.SET_CATEGORIES](state, categories) {
    state.categories = categories;
  },
  [categoriesVuexTypes.SET_RAW_CATEGORIES](state, categories) {
    state.rawCategories = categories;
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
      commit(
        categoriesVuexTypes.SET_RAW_CATEGORIES,
        getRawCategories(result).map(i => new CategoryRecord(i)),
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
