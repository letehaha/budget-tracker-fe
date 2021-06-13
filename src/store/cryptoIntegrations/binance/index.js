import { api } from '@/api';
import { BinanceAccountDataRecord } from '@/js/records';
import { cryptoBinanceVuexTypes } from './types';

const initialState = () => ({
  accountData: {},
  userSettings: null,
});

const state = initialState();

const getters = {
  [cryptoBinanceVuexTypes.GET_ACCOUNT_DATA]: state => state.accountData,
  [cryptoBinanceVuexTypes.GET_BALANCES]: state => state.accountData?.balances,
  [cryptoBinanceVuexTypes.GET_EXISTING_BALANCES]: state => state.accountData
    ?.balances?.filter(item => Number(item.free) || Number(item.locked)),
  [cryptoBinanceVuexTypes.GET_SETTINGS]: state => state.userSettings,
};

const mutations = {
  [cryptoBinanceVuexTypes.SET_ACCOUNT_DATA](state, data) {
    state.accountData = data;
  },
  [cryptoBinanceVuexTypes.SET_SETTINGS](state, data) {
    state.userSettings = data;
  },
};

const actions = {
  async [cryptoBinanceVuexTypes.FETCH_ACCOUNT_DATA]({ commit }) {
    try {
      const result = await api.get('/crypto/binance/account');

      commit(
        cryptoBinanceVuexTypes.SET_ACCOUNT_DATA,
        new BinanceAccountDataRecord(result),
      );
    } catch (e) {
      throw new Error(e);
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
