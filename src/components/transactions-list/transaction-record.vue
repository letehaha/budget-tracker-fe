<template>
  <button
    class="button-style-reset transaction-record"
    type="button"
    aria-haspopup="true"
    :class="{
      'transaction-record--income': transaction.transactionType === TRANSACTION_TYPES.income,
      'transaction-record--expense': transaction.transactionType === TRANSACTION_TYPES.expense,
    }"
    @click="editTransaction"
  >
    <div class="transaction-record__info">
      <template v-if="!transaction.isTransfer && category">
        <CategoryCircle :category="category" />
      </template>
      <div>
        <template v-if="transaction.isTransfer">
          <div class="transaction-record__category">
            {{ accountMovement }}
          </div>
        </template>
        <template v-else>
          <template v-if="category">
            <div class="transaction-record__category">
              {{ category.name }}
            </div>
          </template>
        </template>
        <div class="transaction-record__note">
          {{ transaction.note }}
        </div>
      </div>
    </div>
    <div class="transaction-record__right">
      <div class="transaction-record__amount">
        {{ formattedAmount }}
      </div>
      <div class="transaction-record__time">
        {{ formateDate(transaction.time) }}
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { computed, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { TRANSACTION_TYPES, TransactionModel } from 'shared-types';

import { useCategoriesStore, useAccountsStore } from '@/stores';
import { loadTransactionsByTransferId } from '@/api/transactions';

import { formatUIAmount } from '@/js/helpers';

import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';
import CategoryCircle from '@/components/common/category-circle.vue';

const setOppositeTransaction = async (transaction: TransactionModel) => {
  const transactions = await loadTransactionsByTransferId(
    transaction.transferId,
  );

  return transactions.find(item => item.id !== transaction.id);
};

const props = defineProps<{
  tx: TransactionModel;
}>();

const { categoriesMap } = storeToRefs(useCategoriesStore());
const accountsStore = useAccountsStore();
const { addModal } = useModalCenter();
const { accountsRecord } = storeToRefs(accountsStore);

const transaction = reactive(props.tx);
const oppositeTransferTransaction = ref<TransactionModel | null>(null);

if (transaction.isTransfer) {
  (async () => {
    oppositeTransferTransaction.value = (
      await setOppositeTransaction(transaction)
    );
  })();
}

const category = computed(() => categoriesMap.value[transaction.categoryId]);
const accountFrom = computed(() => accountsRecord.value[transaction.accountId]);
const accountTo = computed(
  () => accountsRecord.value[oppositeTransferTransaction.value?.accountId],
);

const accountMovement = computed(
  () => `${accountFrom.value.name} => ${accountTo.value?.name}`,
);

const formateDate = date => format(new Date(date), 'd MMMM y');

const editTransaction = async () => {
  const baseTx = transaction;
  const oppositeTx = oppositeTransferTransaction.value;

  const modalOptions = {
    transaction: baseTx,
    oppositeTransaction: undefined,
  };

  if (baseTx.isTransfer) {
    const isValid = baseTx.transactionType === TRANSACTION_TYPES.expense;

    modalOptions.transaction = isValid ? baseTx : oppositeTx;
    modalOptions.oppositeTransaction = isValid ? oppositeTx : baseTx;
  }

  addModal({
    type: MODAL_TYPES.createRecord,
    data: modalOptions,
  });
};

const formattedAmount = computed(() => {
  let amount = transaction.amount;

  if (transaction.transactionType === TRANSACTION_TYPES.expense) {
    amount *= -1;
  }

  return formatUIAmount(amount, {
    currency: props.tx.currencyCode,
  });
});
</script>

<style lang="scss">
.transaction-record {
  padding: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  width: 100%;
}
.transaction-record__info {
  display: grid;
  grid-template-columns: min-content minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}
.transaction-record__category {
  font-size: 16px;
  white-space: nowrap;
  letter-spacing: 0.5px;
  color: var(--app-on-surface-color);
}
.transaction-record__time {
  color: var(--app-on-surface-color);
}
.transaction-record__note {
  color: #666;
  font-size: 14px;
  letter-spacing: 0.5px;
}
.transaction-record__right {
  flex: none;
}
.transaction-record__amount {
  text-align: right;

  .transaction-record--income & {
    color: #2ecc71;
  }
  .transaction-record--expense & {
    color: #e74c3c;
  }
}
</style>
