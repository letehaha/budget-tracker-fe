import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { state } from './state';

export { authVuexTypes } from './types';

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
