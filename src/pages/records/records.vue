<template>
  <div class="records">
    <div class="records__list">
      <TransactionsList />
    </div>
    <button
      type="button"
      class="records__scroll-top"
      :class="{ 'records__scroll-top--visible': showScrollTopBtn }"
      @click="scrollTop"
    >
      Top
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';

import TransactionsList from './list.vue';

export default defineComponent({
  components: {
    TransactionsList,
  },
  setup() {
    const showScrollTopBtn = ref(false);

    const onWindowScroll = () => {
      showScrollTopBtn.value = window.pageYOffset > 150;
    };
    window.addEventListener('scroll', onWindowScroll);

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onWindowScroll);
    });

    const scrollTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    return {
      scrollTop,
      showScrollTopBtn,
    };
  },
});
</script>

<style lang="scss" scoped>
.records {
  padding: 24px;
  height: calc(100vh - var(--header-height));
}
.records__list {
  background-color: var(--app-surface-color);
  border-radius: 8px;
  padding: 24px;

  max-width: 560px;
  max-height: 100%;
  margin: 0 auto;
  overflow-y: auto;
}
.records__scroll-top {
  border: none;
  cursor: pointer;

  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: .3s ease-out;

  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-500);
  color: #fff;
  position: fixed;
  bottom: 30px;
  right: 30px;

}
.records__scroll-top--visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
</style>
