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
    <Modal
      :data="modalData"
      :is-active="isModalVisible"
      @close="closeModal"
    />
    <NotificationsCenter />
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  onMounted,
  computed,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/newStore';
import { ROUTER_LAYOUTS } from '@/routes';
import { eventBus } from '@/js/utils';
import Modal from '@/components/Modal.vue';
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
    const authStore = useAuthStore();

    const { isLoggedIn } = storeToRefs(authStore);

    watch(
      isLoggedIn,
      (value) => {
        if (!value) {
          useRouter().push({ name: 'auth/sign-in' });
        }
      },
      { immediate: true },
    );

    const isModalVisible = ref(false);
    const modalData = ref(undefined);

    const onOpenMessage = (data) => {
      isModalVisible.value = true;
      modalData.value = data;
    };
    const closeModal = () => {
      modalData.value = {};
      isModalVisible.value = false;
    };

    onMounted(() => {
      eventBus.on(eventBus.eventsList.modalOpen, onOpenMessage);
      eventBus.on(eventBus.eventsList.modalClose, closeModal);
    });

    const currentLayout = computed(() => route.meta.layout);

    return {
      ROUTER_LAYOUTS,
      isLoggedIn,
      isModalVisible,
      modalData,
      currentLayout,

      onOpenMessage,
      closeModal,
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
