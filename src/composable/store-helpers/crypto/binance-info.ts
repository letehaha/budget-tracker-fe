import { computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { cryptoBinanceVuexTypes } from '@/store';

export const useCryptoBinanceInfo = (): {
  balances: ComputedRef<boolean>;
  totalBalance: ComputedRef<number>;
  fetchAccountData: () => Promise<void>
} => {
  const binanceNamespace = 'cryptoBinance';

  const store = useStore();

  const balances = computed(() => store.getters[`${binanceNamespace}/${cryptoBinanceVuexTypes.GET_EXISTING_BALANCES}`]);
  const totalBalance: ComputedRef<number> = computed(
    () => store.getters[`${binanceNamespace}/${cryptoBinanceVuexTypes.GET_TOTAL_USD_BALANCE}`],
  );

  const fetchAccountData = async () => {
    await store.dispatch(`${binanceNamespace}/${cryptoBinanceVuexTypes.FETCH_ACCOUNT_DATA}`);
  };

  return {
    balances,
    totalBalance,
    fetchAccountData,
  };
};
