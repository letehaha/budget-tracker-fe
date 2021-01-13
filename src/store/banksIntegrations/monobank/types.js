const getters = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  GET_USER: 'GET_USER',
  IS_USER_EXIST: 'IS_USER_EXIST',
  GET_ACCOUNTS: 'GET_ACCOUNTS',
  GET_ACTIVE_ACCOUNTS: 'GET_ACTIVE_ACCOUNTS',
  GET_ACCOUNT_BY_ID: 'GET_ACCOUNT_BY_ID',
};
const mutations = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_USER: 'SET_USER',
  SET_USER_EXIST_STATUS: 'SET_USER_EXIST_STATUS',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  REPLACE_ACCOUNT: 'REPLACE_ACCOUNT',
  REPLACE_TRANSACTION: 'REPLACE_TRANSACTION',
};
const actions = {
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS',
  UPDATE_WEBHOOK: 'UPDATE_WEBHOOK',
  FETCH_USER: 'FETCH_USER',
  FETCH_ACCOUNTS: 'FETCH_ACCOUNTS',
  UPDATE_ACCOUNT_BY_ID: 'UPDATE_ACCOUNT_BY_ID',
  UPDATE_TRANSACTION_BY_ID: 'UPDATE_TRANSACTION_BY_ID',
  REFRESH_ACCOUNTS: 'REFRESH_ACCOUNTS',
  LOAD_TRANSACTIONS_FROM_LATEST: 'LOAD_TRANSACTIONS_FROM_LATEST',
};

export const bankMonobankVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});
