<template>
  <template
    v-for="item in transactions"
    :key="item.tx.id"
  >
    <component
      :is="components[item.type]"
      :tx="item.tx"
    />
  </template>
</template>

<script lang="ts">
import {
  markRaw,
  PropType,
  defineComponent,
  defineAsyncComponent,
} from 'vue';

import { TRANSACTION_TYPES } from '@/js/const';
import { TransactionModelRecord } from '@/js/records';

const components = {
  [TRANSACTION_TYPES.system]: markRaw(defineAsyncComponent(() => import('./SystemTransaction.vue'))),
  [TRANSACTION_TYPES.monobank]: markRaw(defineAsyncComponent(() => import('./MonoTransaction.vue'))),
};

export default defineComponent({
  props: {
    transactions: {
      type: Array as PropType<TransactionModelRecord[]>,
      required: true,
    },
  },
  setup() {
    return {
      components,
      TRANSACTION_TYPES,
    };
  },
});
</script>
