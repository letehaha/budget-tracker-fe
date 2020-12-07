const mutations = {
  SET_USER: 'SET_USER',
};
const actions = {
  FETCH_USER: 'FETCH_USER',
};
const getters = {
  GET_USER: 'GET_USER',
};

export const userVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
