<template>
  <div class="settings-page">
    <UiTabs
      :options="tabs"
      tabs-alignment="flex-start"
    />

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from '@/routes';
import UiTabs, { type Tab } from '@/components/ui-tabs.vue';

const tabs: Tab[] = [
  {
    name: 'currencies',
    label: 'Currencies',
    to: { name: ROUTES_NAMES.settingsCurrencies },
    initial: true,
  },
  {
    name: 'categories',
    label: 'Categories',
    to: { name: ROUTES_NAMES.settingsCategories },
  },
];
</script>

<style lang="scss" scoped>
.settings-page {
  padding: 24px;
}
</style>
