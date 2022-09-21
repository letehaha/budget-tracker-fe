<template>
  <main>
    <template v-if="currentLayout === ROUTER_LAYOUTS.auth">
      <router-view />
    </template>
    <template v-else-if="currentLayout === ROUTER_LAYOUTS.dashboard">
      <div class="page">
        <ui-sidebar />

        <div class="page__wrapper">
          <ui-header />

          <router-view />
        </div>
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
import { useRootStore, useAuthStore, useBanksMonobankStore } from '@/stores';
import { ROUTER_LAYOUTS } from '@/routes';
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

    const { isLoggedIn } = storeToRefs(authStore);

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
          monobankStore.loadAccounts();
        }
      },
      { immediate: true },
    );

    const currentLayout = computed(() => route.meta.layout);

    return {
      ROUTER_LAYOUTS,
      isLoggedIn,
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
