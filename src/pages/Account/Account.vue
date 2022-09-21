<template>
  <div class="account">
    <template v-if="accountType === ACCOUNT_TYPES.monobank">
      <MonobankAccount />
    </template>
    <template v-else-if="accountType === ACCOUNT_TYPES.system">
      <SystemAccount />
    </template>
  </div>
</template>

<script lang="ts">
import { ACCOUNT_TYPES } from 'shared-types';
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

import MonobankAccount from './types/monobank/monobank.vue';
import SystemAccount from './types/system/system.vue';

export default defineComponent({
  components: {
    MonobankAccount,
    SystemAccount,
  },
  setup() {
    const route = useRoute();
    const accountType = computed(() => route.query.type as ACCOUNT_TYPES);

    return {
      ACCOUNT_TYPES,
      accountType,
    };
  },
});
</script>

<style lang="scss" scoped>
.account {
  padding: 24px;
}
</style>
