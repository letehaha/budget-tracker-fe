const getters = {
  GET_CATEGORIES: 'GET_CATEGORIES',
  GET_CATEGORY_BY_ID: 'GET_CATEGORY_BY_ID',
  GET_RAW_CATEGORIES: 'GET_RAW_CATEGORIES',
};
const mutations = {
  SET_CATEGORIES: 'SET_CATEGORIES',
  RESET_STORE: 'RESET_STORE',
  SET_RAW_CATEGORIES: 'SET_RAW_CATEGORIES',
};
const actions = {
  FETCH_CATEGORIES: 'FETCH_CATEGORIES',
};

export const categoriesVuexTypes = Object.freeze({
  ...getters,
  ...mutations,
  ...actions,
});
