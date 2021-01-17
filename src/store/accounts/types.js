const mutations = {
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  RESET_STATE: 'RESET_STATE',
};
const actions = {
  FETCH_ACCOUNTS: 'FETCH_ACCOUNTS',
};
const getters = {
  GET_ACCOUNTS: 'GET_ACCOUNTS',
};

export const accountsVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
