<template>
  <div
    class="transaction"
    :class="{
      'transaction--income': transaction.transactionType === TRANSACTION_TYPES.income,
      'transaction--expense': transaction.transactionType === TRANSACTION_TYPES.expense,
    }"
    @click="editTransaction"
  >
    <div class="transaction__info">
      <template v-if="transaction.isTransfer">
        <div class="transaction__category">
          {{ accountMovement }}
        </div>
      </template>
      <template v-else>
        <template v-if="category">
          <div class="transaction__category">
            {{ category.name }}
          </div>
        </template>
      </template>
      <div class="transaction__note">
        {{ transaction.note }}
      </div>
    </div>
    <div class="transaction__right">
      <div class="transaction__amount">
        {{ formattedAmount }}
        <!-- {{ tx.account.currency.asset }} -->
      </div>
      <div class="transaction__time">
        {{ formateDate(transaction.time) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { format } from 'date-fns';
import {
  defineComponent, computed, reactive, PropType, ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { TRANSACTION_TYPES } from 'shared-types';

import { useCategoriesStore, useAccountsStore } from '@/stores';
import { loadTransactionsByTransferId } from '@/api/transactions';

import { formatAmount } from '@/js/helpers';
import { TransactionRecord } from '@/js/records';

import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';

const setOppositeTransaction = async (transaction: TransactionRecord) => {
  const transactions = await loadTransactionsByTransferId(
    transaction.transferId,
  );

  return transactions.find(item => item.id !== transaction.id);
};

export default defineComponent({
  props: {
    tx: { type: Object as PropType<TransactionRecord>, required: true },
  },
  setup(props) {
    const { getCategoryTypeById } = useCategoriesStore();
    const accountsStore = useAccountsStore();
    const { addModal } = useModalCenter();
    const { accountsRecord } = storeToRefs(accountsStore);

    const transaction = reactive(props.tx);
    const oppositeTransferTransaction = ref<TransactionRecord | null>(null);

    if (transaction.isTransfer) {
      (async () => {
        oppositeTransferTransaction.value = (
          await setOppositeTransaction(transaction)
        );
      })();
    }

    const category = computed(
      () => getCategoryTypeById(transaction.categoryId),
    );
    const accountFrom = computed(
      () => accountsRecord.value[transaction.accountId],
    );
    const accountTo = computed(
      () => accountsRecord.value[oppositeTransferTransaction.value?.accountId],
    );

    const accountMovement = computed(
      () => `${accountFrom.value.name} => ${accountTo.value?.name}`,
    );

    const formateDate = date => format(new Date(date), 'd MMMM y');

    const editTransaction = async () => {
      let txToEdit = transaction;

      if (
        txToEdit.isTransfer
        && txToEdit.transactionType !== TRANSACTION_TYPES.expense
      ) {
        txToEdit = oppositeTransferTransaction.value;
      }

      addModal({
        type: MODAL_TYPES.systemTxForm,
        data: {
          transaction: txToEdit,
          oppositeTransaction: oppositeTransferTransaction.value,
        },
      });
    };

    const formattedAmount = computed(() => {
      let amount = transaction.amount;

      if (transaction.transactionType === TRANSACTION_TYPES.expense) {
        amount *= -1;
      }

      return formatAmount(amount);
    });

    return {
      TRANSACTION_TYPES,
      category,
      formatAmount,
      formateDate,
      formattedAmount,
      editTransaction,
      transaction,
      accountMovement,
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
}
</style>
