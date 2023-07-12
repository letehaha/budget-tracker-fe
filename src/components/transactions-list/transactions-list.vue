<template>
  <template
    v-for="item in transactions"
    :key="item.tx.id + `render-id-${renderId}`"
  >
    <component
      :is="components[item.type]"
      :tx="item.tx"
    />
  </template>
</template>

<script lang="ts">
import {
  ref,
  watch,
  markRaw,
  PropType,
  defineComponent,
  defineAsyncComponent,
} from 'vue';

import { TRANSACTION_TYPES } from '@/js/const';
import { TransactionModelRecord } from '@/js/records';

const components = {
  [TRANSACTION_TYPES.system]: markRaw(defineAsyncComponent(() => import('./system-transaction.vue'))),
  [TRANSACTION_TYPES.monobank]: markRaw(defineAsyncComponent(() => import('./mono-transaction.vue'))),
};

export default defineComponent({
  props: {
    transactions: {
      type: Array as PropType<TransactionModelRecord[]>,
      required: true,
    },
  },
  setup(props) {
    // Since transactions list might change inside but txId will remain the same
    // there is no way except this one to rerender list elements
    const renderId = ref(1);

    watch(
      () => props.transactions,
      () => renderId.value++,
    );
    return {
      renderId,
      components,
      TRANSACTION_TYPES,
    };
  },
});
</script>
