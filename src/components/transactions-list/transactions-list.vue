<template>
  <div class="transactions-list">
    <template
      v-for="item in transactions"
      :key="item.id + `render-id-${renderId}`"
    >
      <TransactionRecrod :tx="item" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TransactionModel } from 'shared-types';
import TransactionRecrod from './transaction-record.vue';

const props = defineProps<{
  transactions: TransactionModel[];
}>();

// Since transactions list might change inside but txId will remain the same
// there is no way except this one to rerender list elements
const renderId = ref(1);

watch(
  () => props.transactions,
  () => renderId.value++,
);
</script>

<style lang="scss">
.transactions-list {
  display: grid;
  gap: 8px;
}
</style>
