<template>
  <div class="type-selector">
    <div
      class="type-selector__item"
      :class="{
        'type-selector__item--active': selectedTransactionType === FORM_TYPES.expense,
      }"
      @click="selectTransactionType(FORM_TYPES.expense)"
    >
      Expense
    </div>
    <div
      class="type-selector__item"
      :class="{
        'type-selector__item--active': selectedTransactionType === FORM_TYPES.income,
      }"
      @click="selectTransactionType(FORM_TYPES.income)"
    >
      Income
    </div>
    <div
      class="type-selector__item"
      :class="{
        'type-selector__item--active': selectedTransactionType === FORM_TYPES.transfer,
      }"
      @click="selectTransactionType(FORM_TYPES.transfer)"
    >
      Transfer
    </div>
  </div>
</template>

<script lang="ts">
import { PAYMENT_TYPES } from 'shared-types';
import { defineComponent, PropType } from 'vue';

import {
  createTransaction,
  editTransaction,
  deleteTransaction,
} from '@/api/transactions';

import { FORM_TYPES } from './types';

export default defineComponent({
  props: {
    selectedTransactionType: {
      type: String as PropType<FORM_TYPES>,
      required: true,
    },
  },
  emits: {
    'change-tx-type': function (value: FORM_TYPES) {
      return Object.values(FORM_TYPES).includes(value);
    },
  },
  setup(props, { emit }) {
    const selectTransactionType = (
      type: FORM_TYPES,
      disabled = false,
    ) => {
      if (!disabled) {
        emit('change-tx-type', type);
      }
    };

    return {
      FORM_TYPES,
      PAYMENT_TYPES,
      selectTransactionType,
      createTransaction,
      editTransaction,
      deleteTransaction,
    };
  },
});
</script>

<style lang="scss" scoped>
.type-selector {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  background-color: rgba(#000, .4);
  border-radius: 10px;
  margin-top: 24px;
}
.type-selector__item {
  padding: 6px;

  font-size: 16px;
  text-align: center;
  cursor: pointer;

  transition: .1s ease-out;
  color: #fff;

  &[disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.type-selector__item--active {
  background-color: #fff;
  border-radius: 10px;
  color: #000;
}
</style>
