<template>
  <div class="page">
    <ui-sidebar />

    <div class="page__wrapper">
      <ui-header />

      <template v-if="isAppInitialized">
        <router-view />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { ROUTES_NAMES } from "@/routes/constants";
import { useRootStore, useCurrenciesStore } from "@/stores";

import UiHeader from "@/components/ui-header.vue";
import UiSidebar from "@/components/ui-sidebar.vue";

export default defineComponent({
  components: {
    UiHeader,
    UiSidebar,
  },
  setup() {
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

    return {
      isAppInitialized,
    };
  },
});
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  background-color: var(--app-bg-color);
  min-height: 100vh;
}
.page__wrapper {
  flex: 1;
}
</style>
