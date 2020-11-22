const mutations = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
};
const actions = {
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS',
};
const getters = {
  GET_IS_LOGGED_IN: 'GET_IS_LOGGED_IN',
  GET_USER: 'GET_USER',
};

export const authVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
