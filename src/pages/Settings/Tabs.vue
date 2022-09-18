<template>
  <Tabs
    :options="tabs"
    :tabs-alignment="CSSJustifyContentValues.flexStart"
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
import { defineComponent } from 'vue';
import Tabs, { CSSJustifyContentValues } from '@/components/Tabs.vue';
import Currencies from './tabs/currencies/list.vue';

export default defineComponent({
  components: {
    Tabs,
    Currencies,
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
      CSSJustifyContentValues,
      tabs,
    };
  },
});
</script>
