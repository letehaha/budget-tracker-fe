const mutations = {
  SET_TOKEN: 'SET_TOKEN',
  SET_IS_LOGGED_IN: 'SET_IS_LOGGED_IN',
};
const actions = {
  LOG_IN: 'LOG_IN',
  SIGN_UP: 'SIGN_UP',
  LOG_OUT: 'LOG_OUT',
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

export const namespace = 'auth';
