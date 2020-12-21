const mutations = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
};
const actions = {
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS',
};
const getters = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
};

export const bankMonobankVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
