<template>
  <template
    v-for="item in transactions"
    :key="item.id + `render-id-${renderId}`"
  >
    <TransactionRecrod :tx="item" />
  </template>
</template>

<script lang="ts">
import {
  ref,
  watch,
  PropType,
  defineComponent,
} from 'vue';
import { TransactionModel } from 'shared-types';
import { TRANSACTION_TYPES } from '@/js/const';
import TransactionRecrod from './transaction-record.vue';

export default defineComponent({
  components: {
    TransactionRecrod,
  },
  props: {
    transactions: {
      type: Array as PropType<TransactionModel[]>,
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
      TRANSACTION_TYPES,
    };
  },
});
</script>
