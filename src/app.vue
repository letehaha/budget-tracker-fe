<template>
  <main>
    <router-view />

    <ui-modal />
    <notifications-center />
  </main>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import {
  useRootStore,
  useAuthStore,
  useCurrenciesStore,
} from '@/stores';
import { ROUTES_NAMES } from '@/routes';
import UiModal from '@/components/modal-center/ui-modal.vue';

import NotificationsCenter from '@/components/notification-center/notifications-center.vue';

export default defineComponent({
  components: {
    UiModal,
    NotificationsCenter,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const rootStore = useRootStore();
    const userCurrenciesStore = useCurrenciesStore();

    const { isAppInitialized } = storeToRefs(rootStore);
    const { isLoggedIn } = storeToRefs(authStore);
    const { isBaseCurrencyExists } = storeToRefs(userCurrenciesStore);

    watch(
      isLoggedIn,
      (value, prevValue) => {
        if (prevValue && !value) {
          router.push({ name: ROUTES_NAMES.signIn });
        }
      },
      { immediate: true },
    );

    watch(
      isLoggedIn,
      async (value) => {
        if (value) {
          await rootStore.fetchInitialData();
          await rootStore.syncFinancialData();
        }
      },
      { immediate: true },
    );

    watch(
      isAppInitialized,
      (value) => {
        if (value && !isBaseCurrencyExists.value) {
          router.push({ name: ROUTES_NAMES.welcome });
        }
      },
    );

    return {
      isLoggedIn,
    };
  },
});
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  background-color: var(--app-bg-color);
  min-height: 100vh;
}
</style>
