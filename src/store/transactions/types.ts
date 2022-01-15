const getters = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  GET_LATEST_TRANSACTIONS: 'GET_LATEST_TRANSACTIONS',
};
const mutations = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  REPLACE_TRANSACTION: 'REPLACE_TRANSACTION',
  RESET_STORE: 'RESET_STORE',
};
const actions = {
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS',
  CREATE_TRANSACTION: 'CREATE_TRANSACTION',
  EDIT_TRANSACTION: 'EDIT_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
};

export const transactionsVuexTypes = Object.freeze({
  ...getters,
  ...mutations,
  ...actions,
});

export const namespace = 'transactions';
