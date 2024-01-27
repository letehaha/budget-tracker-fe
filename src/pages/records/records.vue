<template>
  <div class="p-4">
    <Card class="p-6 rounded-md max-w-[560px] mx-auto">
      <TransactionsList />
    </Card>
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

<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";

import { Card } from "@/components/lib/ui/card";
import TransactionsList from "./list.vue";

const showScrollTopBtn = ref(false);

const onWindowScroll = () => {
  showScrollTopBtn.value = window.pageYOffset > 150;
};
window.addEventListener("scroll", onWindowScroll);

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onWindowScroll);
});

const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<style lang="scss" scoped>
.records__scroll-top {
  border: none;
  cursor: pointer;

  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: 0.3s ease-out;

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
