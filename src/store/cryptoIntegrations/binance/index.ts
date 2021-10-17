import { RawAccountDataResponse, NormalizedAccountData } from 'shared-types/responses/crypto/binance';
import { MutationTree, ActionTree, GetterTree } from 'vuex';
import { api } from '@/api';
import { RootState } from '@/store/types';
import { cryptoBinanceVuexTypes } from './types';
import { normalizeAccountData } from './response-normalizer';

interface State {
  accountData: NormalizedAccountData | null;
  userSettings: unknown;
}

const initialState = (): State => ({
  accountData: null,
  userSettings: null,
});

const state: State = initialState();

const getters: GetterTree<State, RootState> = {
  [cryptoBinanceVuexTypes.GET_ACCOUNT_DATA]: state => state.accountData,
  [cryptoBinanceVuexTypes.GET_BALANCES]: state => state.accountData?.balances,
  [cryptoBinanceVuexTypes.GET_EXISTING_BALANCES]: state => state.accountData
    ?.balances?.filter(item => Number(item.free) || Number(item.locked)),
  [cryptoBinanceVuexTypes.GET_TOTAL_USD_BALANCE]: (state): number => {
    const balances = state.accountData
      ?.balances?.filter(item => Number(item.free) || Number(item.locked));

    return (balances || []).reduce((acc, item) => {
      const price = item.price ?? 1;

      return acc + (Number(item.total) * Number(price ?? 0));
    }, 0);
  },
  [cryptoBinanceVuexTypes.GET_SETTINGS]: state => state.userSettings,
};

const mutations: MutationTree<State> = {
  [cryptoBinanceVuexTypes.SET_ACCOUNT_DATA](
    state,
    data: NormalizedAccountData,
  ) {
    state.accountData = data;
  },
  [cryptoBinanceVuexTypes.SET_SETTINGS](state, data) {
    state.userSettings = data;
  },
};

const actions: ActionTree<State, RootState> = {
  async [cryptoBinanceVuexTypes.FETCH_ACCOUNT_DATA]({ commit }) {
    try {
      const result: RawAccountDataResponse = await api.get('/crypto/binance/account');

      commit(
        cryptoBinanceVuexTypes.SET_ACCOUNT_DATA,
        normalizeAccountData(result),
      );
    } catch (e) {
      throw e;
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};

export { cryptoBinanceVuexTypes } from './types';
