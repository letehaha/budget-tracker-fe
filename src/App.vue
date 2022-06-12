<template>
  <main>
    <template v-if="currentLayout === ROUTER_LAYOUTS.auth">
      <router-view />
    </template>
    <template v-else-if="currentLayout === ROUTER_LAYOUTS.dashboard">
      <div class="page">
        <Sidebar />
        <div class="page__wrapper">
          <UIHeader />
          <router-view />
        </div>
      </div>
    </template>
    <Modal />
    <NotificationsCenter />
  </main>
</template>

<script lang="ts">
import { defineComponent, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores';
import { ROUTER_LAYOUTS } from '@/routes';
import Modal from '@/components/modal-center/Modal.vue';
import UIHeader from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';

import NotificationsCenter from '@/components/notification-center/NotificationsCenter.vue';

export default defineComponent({
  components: {
    Modal,
    UIHeader,
    Sidebar,
    NotificationsCenter,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

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
