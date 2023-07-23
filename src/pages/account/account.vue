<template>
  <div class="account">
    <template v-if="account.type === ACCOUNT_TYPES.monobank">
      <MonobankAccount :account="account" />
    </template>
    <template v-else-if="account.type === ACCOUNT_TYPES.system">
      <SystemAccount :account="account" />
    </template>
  </div>
</template>

<script lang="ts">
import { ACCOUNT_TYPES } from 'shared-types';
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAccountsStore } from '@/stores';

import MonobankAccount from './types/monobank/monobank.vue';
import SystemAccount from './types/system/system.vue';

export default defineComponent({
  components: {
    MonobankAccount,
    SystemAccount,
  },
  setup() {
    const route = useRoute();
    const accountsStore = useAccountsStore();
    const { accountsRecord } = storeToRefs(accountsStore);
    const account = computed(() => accountsRecord.value[+route.params.id]);

    return {
      ACCOUNT_TYPES,
      account,
    };
  },
});
</script>

<style lang="scss" scoped>
.account {
  padding: 24px;
}
</style>
