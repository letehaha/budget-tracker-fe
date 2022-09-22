<template>
  <div class="settings-page">
    <settings-tabs />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SettingsTabs from './tabs.vue';

export default defineComponent({
  components: {
    SettingsTabs,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.settings-page {
  padding: 24px;
}
</style>
