const getters = {
  GET_CATEGORIES: 'GET_CATEGORIES',
  GET_CATEGORY_BY_ID: 'GET_CATEGORY_BY_ID',
};
const mutations = {
  SET_CATEGORIES: 'SET_CATEGORIES',
  RESET_STORE: 'RESET_STORE',
};
const actions = {
  FETCH_CATEGORIES: 'FETCH_CATEGORIES',
};

export const categoriesVuexTypes = Object.freeze({
  ...getters,
  ...mutations,
  ...actions,
});
