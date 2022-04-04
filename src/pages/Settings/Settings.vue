<template>
  <div class="settings-page">
    <Tabs />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Tabs from './Tabs.vue';

export default defineComponent({
  components: {
    Tabs,
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
