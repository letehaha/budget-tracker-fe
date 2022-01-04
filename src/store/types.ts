import { Dispatch, Commit, Store } from 'vuex';

const mutations = {
  SET_ACCOUNT_TYPES: 'SET_ACCOUNT_TYPES',
  SET_PAYMENT_TYPES: 'SET_PAYMENT_TYPES',
  SET_TRANSACTION_TYPES: 'SET_TRANSACTION_TYPES',
  SET_APP_INITIALIZE_STATUS: 'SET_APP_INITIALIZE_STATUS',
};
const actions = {
  FETCH_INITIAL_DATA: 'FETCH_INITIAL_DATA',
  FETCH_ACCOUNT_TYPES: 'FETCH_ACCOUNT_TYPES',
  FETCH_PAYMENT_TYPES: 'FETCH_PAYMENT_TYPES',
  FETCH_TRANSACTION_TYPES: 'FETCH_TRANSACTION_TYPES',
};
const getters = {
  GET_ACCOUNT_TYPES: 'GET_ACCOUNT_TYPES',
  GET_PAYMENT_TYPES: 'GET_PAYMENT_TYPES',
  GET_TRANSACTION_TYPES: 'GET_TRANSACTION_TYPES',
  GET_APP_INIT_STATUS: 'GET_APP_INIT_STATUS',
  GET_TRANSACTION_TYPE_BY_ID: 'GET_TRANSACTION_TYPE_BY_ID',
};

export const indexVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});

export type RootState = Record<string, never>;

export type ActionContext = {
  commit: Commit;
  dispatch: Dispatch;
}

export type CustomStore = Store<RootState>;
