<template>
  <div class="settings-page">
    <UiTabs :initial-tab="initialTab" :options="tabs" tabs-alignment="flex-start" />

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from "@/routes";
import UiTabs, { type Tab } from "@/components/ui-tabs.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tabs: Tab[] = [
  {
    name: "currencies",
    label: "Currencies",
    to: { name: ROUTES_NAMES.settingsCurrencies },
  },
  {
    name: "categories",
    label: "Categories",
    to: { name: ROUTES_NAMES.settingsCategories },
  },
];
const initialTab = tabs.find((i) => i.name === route.path.split("/").at(-1));
</script>

<style lang="scss" scoped>
.settings-page {
  padding: 24px;
}
</style>
