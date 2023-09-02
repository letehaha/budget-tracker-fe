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

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import Tabs from '@/components/ui-tabs.vue';

const Currencies = defineAsyncComponent(() => import('./tabs/currencies/index.vue'));

const tabs = [
  {
    name: 'currencies',
    label: 'Currencies',
  },
];
</script>
