const getters = {
  GET_USER: 'GET_USER',
};
const mutations = {
  SET_USER: 'SET_USER',
  RESET_STORE: 'RESET_STORE',
};
const actions = {
  FETCH_USER: 'FETCH_USER',
};

export const userVuexTypes = Object.freeze({
  ...getters,
  ...mutations,
  ...actions,
});
