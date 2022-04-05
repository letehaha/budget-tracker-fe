import {
  createStore, GetterTree, MutationTree, ActionTree,
} from 'vuex';

import { indexVuexTypes, RootState } from './types';
import bankMonobank, {
  bankMonobankVuexTypes,
  namespace as bankMonobankNamespace,
} from './banksIntegrations/monobank';

const state: RootState = {
  isAppInitialized: false,
};

const getters: GetterTree<RootState, RootState> = {
  [indexVuexTypes.GET_APP_INIT_STATUS]: state => state.isAppInitialized,
};

const mutations: MutationTree<RootState> = {
  [indexVuexTypes.SET_APP_INITIALIZE_STATUS](state, status) {
    state.isAppInitialized = status;
  },
};

const actions: ActionTree<RootState, RootState> = {
  async [indexVuexTypes.FETCH_INITIAL_DATA]({ commit, dispatch }) {
    commit(indexVuexTypes.SET_APP_INITIALIZE_STATUS, false);

    await Promise.all([
      dispatch(`bankMonobank/${bankMonobankVuexTypes.FETCH_USER}`),
    ]);

    commit(indexVuexTypes.SET_APP_INITIALIZE_STATUS, true);
  },
};

export const store = createStore({
  strict: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    [bankMonobankNamespace]: bankMonobank,
  },
});

export { useRootStore } from './composable';
export { indexVuexTypes } from './types';
export { bankMonobankVuexTypes, useBankMonobankStore } from './banksIntegrations/monobank';
