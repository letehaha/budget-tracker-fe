<template>
  <div
    class="transaction"
    :class="`transaction--${txType.name.toLowerCase()}`"
    @click="editTransaction"
  >
    <div class="transaction__info">
      <div class="transaction__category">
        {{ category?.name }}
      </div>
      <div class="transaction__note">
        {{ tx.description }}
      </div>
    </div>
    <div class="transaction__right">
      <div class="transaction__amount">
        {{ tx.formattedAmount }}
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
import { useTransactionTypesStore, useCategoriesStore } from '@/stores';
import { eventBus } from '@/js/utils';
import { MODAL_TYPES } from '@/components/Modal.vue';

export default defineComponent({
  props: {
    tx: { type: Object, required: true },
  },
  setup(props) {
    const { getTransactionTypeById } = useTransactionTypesStore();
    const { getCategoryTypeById } = useCategoriesStore();

    const txType = computed(
      () => getTransactionTypeById(props.tx.transactionTypeId),
    );

    const category = computed(
      () => getCategoryTypeById(props.tx.categoryId),
    );

    return {
      txType,
      category,
    };
  },
  methods: {
    formateDate(date) {
      return format(new Date(date), 'd MMMM y');
    },
    editTransaction() {
      eventBus.emit(eventBus.eventsList.modalOpen, {
        type: MODAL_TYPES.monobankTxForm,
        data: { transaction: this.tx },
      });
    },
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
