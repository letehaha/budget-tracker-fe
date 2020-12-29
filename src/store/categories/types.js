const mutations = {
  SET_CATEGORIES: 'SET_CATEGORIES',
};
const actions = {
  FETCH_CATEGORIES: 'FETCH_CATEGORIES',
};
const getters = {
  GET_CATEGORIES: 'GET_CATEGORIES',
  GET_CATEGORY_BY_ID: 'GET_CATEGORY_BY_ID',
};

export const categoriesVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
