<template>
  <template
    v-for="item in transactions"
    :key="item.tx.id"
  >
    <template v-if="item.type === TRANSACTION_TYPES.system">
      <Transaction :tx="item.tx" />
    </template>
    <template v-else-if="item.type === TRANSACTION_TYPES.monobank">
      <MonoTransaction :tx="item.tx" />
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { TRANSACTION_TYPES } from '@/js/const';
import { TransactionModelRecord } from '@/js/records';

import Transaction from './SystemTransaction.vue';
import MonoTransaction from './MonoTransaction.vue';

export default defineComponent({
  components: {
    Transaction,
    MonoTransaction,
  },
  props: {
    transactions: {
      type: Array as PropType<TransactionModelRecord[]>,
      required: true,
    },
  },
  setup() {
    return {
      TRANSACTION_TYPES,
    };
  },
});
</script>
