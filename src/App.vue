<template>
  <main>
    <template v-if="currentLayout === ROUTER_LAYOUTS.auth">
      <router-view />
    </template>
    <template v-else-if="currentLayout === ROUTER_LAYOUTS.dashboard">
      <div class="page">
        <Sidebar />
        <div class="page__wrapper">
          <Header />
          <router-view />
        </div>
      </div>
    </template>
    <Modal
      :data="modalData"
      :is-active="isModalVisible"
      @close="closeModal"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { authVuexTypes } from '@/store';
import { ROUTER_LAYOUTS } from '@/routes';
import { eventBus } from '@/js/utils';
import Modal from '@/components/Modal.vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';

export default defineComponent({
  components: {
    Modal,
    Header,
    Sidebar,
  },
  data: () => ({
    isModalVisible: false,
    modalData: {},
    ROUTER_LAYOUTS,
  }),
  computed: {
    ...mapGetters('auth', {
      isLoggedIn: authVuexTypes.GET_IS_LOGGED_IN,
    }),
    currentLayout() {
      return this.$route.meta.layout;
    },
  },
  watch: {
    isLoggedIn: {
      immediate: true,
      handler(value) {
        if (!value) {
          this.$router.push('/sign-in');
        }
      },
    },
  },
  mounted() {
    eventBus.on(eventBus.eventsList.modalOpen, this.onOpenMessage);
    eventBus.on(eventBus.eventsList.modalClose, this.closeModal);
  },
  methods: {
    onOpenMessage(data) {
      this.isModalVisible = true;
      this.modalData = data;
    },
    closeModal() {
      this.modalData = {};
      this.isModalVisible = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  background-color: #fafafa;
  min-height: 100vh;
}
</style>
