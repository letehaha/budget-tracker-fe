import { Dispatch, Commit, Store } from 'vuex';

const mutations = {
  SET_APP_INITIALIZE_STATUS: 'SET_APP_INITIALIZE_STATUS',
};
const actions = {
  FETCH_INITIAL_DATA: 'FETCH_INITIAL_DATA',
};
const getters = {
  GET_APP_INIT_STATUS: 'GET_APP_INIT_STATUS',
};

export const indexVuexTypes = Object.freeze({
  ...mutations,
  ...actions,
  ...getters,
});

export interface RootState {
  isAppInitialized: boolean;
}

export type ActionContext = {
  commit: Commit;
  dispatch: Dispatch;
}

export type CustomStore = Store<RootState>;
