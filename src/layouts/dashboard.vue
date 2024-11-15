<template>
  <div class="page">
    <Sidebar />

    <ScrollArea class="page__wrapper">
      <ui-header class="sticky top-0 z-10 bg-background" />

      <template v-if="isAppInitialized">
        <router-view />
      </template>

      <ScrollBar />
    </ScrollArea>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { ROUTES_NAMES } from "@/routes/constants";
import { useRootStore, useCurrenciesStore } from "@/stores";

import { ScrollArea, ScrollBar } from "@/components/lib/ui/scroll-area";
import UiHeader from "@/components/ui-header.vue";
import Sidebar from "@/components/sidebar/index.vue";

const router = useRouter();
const rootStore = useRootStore();
const userCurrenciesStore = useCurrenciesStore();

const { isAppInitialized } = storeToRefs(rootStore);
const { isBaseCurrencyExists } = storeToRefs(userCurrenciesStore);

watch(isAppInitialized, (value) => {
  if (value && !isBaseCurrencyExists.value) {
    router.push({ name: ROUTES_NAMES.welcome });
  }
});
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  background-color: var(--background);
  height: 100dvh;
}
.page__wrapper {
  flex: 1;
}
</style>
