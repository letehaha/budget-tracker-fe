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
        {{ currenciesMap[tx.currencyId].code }}
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
import { TRANSACTION_TYPES, TransactionModel } from 'shared-types';

import { useCategoriesStore, useAccountsStore, useCurrenciesStore } from '@/stores';
import { loadTransactionsByTransferId } from '@/api/transactions';

import { formatAmount } from '@/js/helpers';

import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';

const setOppositeTransaction = async (transaction: TransactionModel) => {
  const transactions = await loadTransactionsByTransferId(
    transaction.transferId,
  );

  return transactions.find(item => item.id !== transaction.id);
};

export default defineComponent({
  props: {
    tx: { type: Object as PropType<TransactionModel>, required: true },
  },
  setup(props) {
    const { getCategoryTypeById } = useCategoriesStore();
    const accountsStore = useAccountsStore();
    const currenciesStore = useCurrenciesStore();
    const { addModal } = useModalCenter();
    const { accountsRecord } = storeToRefs(accountsStore);
    const { currenciesMap } = storeToRefs(currenciesStore);

    const transaction = reactive(props.tx);
    const oppositeTransferTransaction = ref<TransactionModel | null>(null);

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
        type: MODAL_TYPES.systemTxForm,
        data: modalOptions,
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
      currenciesMap,
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
