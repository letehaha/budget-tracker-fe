import { computed, ComputedRef } from 'vue';
import { useStore } from 'vuex';
import { indexVuexTypes } from './types';

export const useRootStore = (): {
  isAppInitialized: ComputedRef<boolean>;
} => {
  const store = useStore();

  const isAppInitialized = computed(
    () => store.getters[indexVuexTypes.GET_APP_INIT_STATUS],
  );

  return {
    isAppInitialized,
  };
};
