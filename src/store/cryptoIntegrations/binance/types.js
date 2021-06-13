const getters = {
  GET_ACCOUNT_DATA: 'GET_ACCOUNT_DATA',
  GET_BALANCES: 'GET_BALANCES',
  GET_EXISTING_BALANCES: 'GET_EXISTING_BALANCES',
  GET_SETTINGS: 'GET_SETTINGS',
};
const mutations = {
  SET_ACCOUNT_DATA: 'SET_ACCOUNT_DATA',
  SET_SETTINGS: 'SET_SETTINGS',
};
const actions = {
  FETCH_ACCOUNT_DATA: 'FETCH_ACCOUNT_DATA',
  SET_SETTINGS: 'SET_SETTINGS',
};

export const cryptoBinanceVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
