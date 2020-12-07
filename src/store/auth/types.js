const mutations = {
  SET_TOKEN: 'SET_TOKEN',
};
const actions = {
  LOG_IN: 'LOG_IN',
};
const getters = {
  GET_IS_LOGGED_IN: 'GET_IS_LOGGED_IN',
  GET_USER: 'GET_USER',
  GET_USER_TOKEN: 'GET_USER_TOKEN',
};

export const authVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
