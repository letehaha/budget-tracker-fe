<template>
  <main class="container">
    <router-view />
    <Modal
      :data="modalData"
      :is-active="isModalVisible"
      @close="closeModal"
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import { authVuexTypes } from '@/store';
import Modal from '@/components/Modal';

export default {
  components: {
    Modal,
  },
  data: () => ({
    isModalVisible: false,
    modalData: {},
  }),
  computed: {
    ...mapGetters('auth', {
      isLoggedIn: authVuexTypes.GET_IS_LOGGED_IN,
    }),
  },
  watch: {
    isLoggedIn(value) {
      if (!value) {
        this.$router.push('/sign-in');
      }
    },
  },
  mounted() {
    this.$bus.on(this.$bus.eventsList.modalOpen, this.onOpenMessage);
    this.$bus.on(this.$bus.eventsList.modalClose, this.closeModal);
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
};
</script>
