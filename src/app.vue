<template>
  <main>
    <template v-if="currentLayout === ROUTER_LAYOUTS.auth">
      <router-view />
    </template>
    <template v-else-if="currentLayout === ROUTER_LAYOUTS.dashboard">
      <div class="page">
        <template v-if="isAppInitialized">
          <ui-sidebar />

          <div class="page__wrapper">
            <ui-header />

            <router-view />
          </div>
        </template>
        <template v-else>
          Syncing
        </template>
      </div>
    </template>
    <ui-modal />
    <notifications-center />
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  computed,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import {
  useRootStore,
  useAuthStore,
  useBanksMonobankStore,
  useCurrenciesStore,
} from '@/stores';
import { ROUTER_LAYOUTS } from '@/routes';
import { getHoursInMilliseconds } from '@/js/helpers';
import UiModal from '@/components/modal-center/ui-modal.vue';
import UiHeader from '@/components/ui-header.vue';
import UiSidebar from '@/components/ui-sidebar.vue';

import NotificationsCenter from '@/components/notification-center/notifications-center.vue';

export default defineComponent({
  components: {
    UiModal,
    UiHeader,
    UiSidebar,
    NotificationsCenter,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const rootStore = useRootStore();
    const monobankStore = useBanksMonobankStore();
    const userCurrenciesStore = useCurrenciesStore();
    const { enabledAccounts: enabledMonoAccounts } = storeToRefs(monobankStore);

    const { isAppInitialized } = storeToRefs(rootStore);
    const { isLoggedIn } = storeToRefs(authStore);
    const { isBaseCurrencyExists } = storeToRefs(userCurrenciesStore);

    const refreshAccountsInfoIfNeeded = async () => {
      const latestAccountRefreshDate = new Date(+localStorage.getItem('latest-account-refresh-date')).getTime();

      if (new Date().getTime() - latestAccountRefreshDate > getHoursInMilliseconds(24)) {
        // Load latest transactions for all enabled monobank accounts
        enabledMonoAccounts.value.forEach(item => {
          monobankStore.loadTransactionsFromLatest({
            accountId: item.accountId,
          });
        });

        // refresh balances of all monobank accounts
        await Promise.allSettled([
          monobankStore.refreshAccounts(),
          monobankStore.loadTransactionsForAllAccounts(),
        ]);

        localStorage.setItem('latest-account-refresh-date', `${new Date().getTime()}`);
      }
    };

    watch(
      isLoggedIn,
      (value, prevValue) => {
        if (prevValue && !value) {
          router.push({ name: 'auth/sign-in' });
        }
      },
      { immediate: true },
    );

    watch(
      isLoggedIn,
      async (value) => {
        if (value) {
          await rootStore.fetchInitialData();

          await refreshAccountsInfoIfNeeded();

          monobankStore.loadAccounts();
        }
      },
      { immediate: true },
    );

    watch(
      isAppInitialized,
      (value) => {
        if (value && !isBaseCurrencyExists.value) {
          router.push({ name: 'auth/welcome' });
        }
      },
    );

    const currentLayout = computed(() => route.meta.layout);

    return {
      ROUTER_LAYOUTS,
      isLoggedIn,
      isAppInitialized,
      currentLayout,
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
