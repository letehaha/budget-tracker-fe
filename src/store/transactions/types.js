const mutations = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
};
const actions = {
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS',
  CREATE_TRANSACTION: 'CREATE_TRANSACTION',
  EDIT_TRANSACTION: 'EDIT_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
};
const getters = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
};

export const transactionsVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
