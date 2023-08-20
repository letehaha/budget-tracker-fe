<template>
  <Tabs
    :options="tabs"
    tabs-alignment="flex-start"
  >
    <template #default="{ activeTab }">
      <transition
        name="fade"
        mode="out-in"
      >
        <template v-if="activeTab.name === 'currencies'">
          <Currencies />
        </template>
      </transition>
    </template>
  </Tabs>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import Tabs from '@/components/ui-tabs.vue';

export default defineComponent({
  components: {
    Tabs,
    Currencies: defineAsyncComponent(() => import('./tabs/currencies/index.vue')),
  },
  setup() {
    const tabs = [
      {
        name: 'currencies',
        label: 'Currencies',
      },
      {
        name: 'account-types',
        label: 'Account types',
      },
    ];
    return {
      tabs,
    };
  },
});
</script>
