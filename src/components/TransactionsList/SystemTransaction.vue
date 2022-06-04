<template>
  <div
    class="transaction"
    :class="{
      'transaction--income': tx.type === TRANSACTION_TYPES.income,
      'transaction--expense': tx.type === TRANSACTION_TYPES.expense,
      'transaction--transfer': tx.type === TRANSACTION_TYPES.transfer,
    }"
    @click="editTransaction"
  >
    <div class="transaction__info">
      <div class="transaction__category">
        {{ category.name }}
      </div>
      <div class="transaction__note">
        {{ tx.note }}
      </div>
    </div>
    <div class="transaction__right">
      <div class="transaction__amount">
        {{ formatAmount(tx.amount) }}
        <!-- {{ tx.account.currency.asset }} -->
      </div>
      <div class="transaction__time">
        {{ formateDate(tx.time) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { format } from 'date-fns';
import { defineComponent, computed } from 'vue';
import { TRANSACTION_TYPES } from 'shared-types';

import { useCategoriesStore } from '@/stores';

import { formatAmount } from '@/js/helpers';

import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';

export default defineComponent({
  props: {
    tx: { type: Object, required: true },
  },
  setup(props) {
    const { getCategoryTypeById } = useCategoriesStore();
    const { addModal } = useModalCenter();

    const category = computed(
      () => getCategoryTypeById(props.tx.categoryId),
    );

    const formateDate = date => format(new Date(date), 'd MMMM y');

    const editTransaction = () => {
      addModal({
        type: MODAL_TYPES.systemTxForm,
        data: { transaction: props.tx },
      });
    };

    return {
      TRANSACTION_TYPES,
      category,
      formatAmount,
      formateDate,
      editTransaction,
    };
  },
});
</script>

<style lang="scss" scoped>
.transaction {
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
}
.transaction__category {
  font-size: 16px;
  white-space: nowrap;
  letter-spacing: 0.5px;
  color: var(--app-on-surface-color);
}
.transaction__time {
  color: var(--app-on-surface-color);
}
.transaction__note {
  color: #666;
  font-size: 14px;
  letter-spacing: 0.5px;
}
.transaction__right {
  flex: none;
}
.transaction__amount {
  text-align: right;

  .transaction--income & {
    color: #2ecc71;
  }
  .transaction--expense & {
    color: #e74c3c;
  }
  .transaction--transfer & {
    color: #34495e;
  }
}
</style>
