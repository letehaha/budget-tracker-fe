const mutations = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_USER: 'SET_USER',
};
const actions = {
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS',
  UPDATE_WEBHOOK: 'UPDATE_WEBHOOK',
  FETCH_USER: 'FETCH_USER',
};
const getters = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  GET_USER: 'GET_USER',
};

export const bankMonobankVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
