<template>
  <div
    class="transaction"
    :class="{
      'transaction--income': transaction.transactionType === TRANSACTION_TYPES.income,
      'transaction--expense': transaction.transactionType === TRANSACTION_TYPES.expense,
      'transaction--transfer': transaction.transactionType === TRANSACTION_TYPES.transfer,
    }"
    @click="editTransaction"
  >
    <div class="transaction__info">
      <template
        v-if="transaction.transactionType === TRANSACTION_TYPES.transfer"
      >
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
  defineComponent, computed, reactive, PropType,
} from 'vue';
import { storeToRefs } from 'pinia';
import { TRANSACTION_TYPES } from 'shared-types';

import { useCategoriesStore, useAccountsStore } from '@/stores';
import { loadTransactionById } from '@/api/transactions';

import { formatAmount } from '@/js/helpers';
import { TransactionRecord } from '@/js/records';

import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

export default defineComponent({
  props: {
    tx: { type: Object as PropType<TransactionRecord>, required: true },
  },
  setup(props) {
    const { getCategoryTypeById } = useCategoriesStore();
    const accountsStore = useAccountsStore();
    const { addModal } = useModalCenter();
    const { accountsRecord } = storeToRefs(accountsStore);
    const { addNotification } = useNotificationCenter();

    const transaction = reactive(props.tx);

    const category = computed(
      () => getCategoryTypeById(transaction.categoryId),
    );
    const accountFrom = computed(
      () => accountsRecord.value[transaction.fromAccountId],
    );
    const accountTo = computed(
      () => accountsRecord.value[transaction.toAccountId],
    );

    const accountMovement = computed(
      () => `${accountFrom.value.name} => ${accountTo.value.name}`,
    );

    const formateDate = date => format(new Date(date), 'd MMMM y');

    const editTransaction = async () => {
      let txToEdit = transaction;

      if (txToEdit.accountId === txToEdit.toAccountId) {
        try {
          txToEdit = await loadTransactionById({ id: txToEdit.oppositeId });
        } catch (e) {
          // TODO: add logger
          addNotification({
            text: 'Cannot load transaction to edit.',
            type: NotificationType.error,
          });
        }
      }

      addModal({
        type: MODAL_TYPES.systemTxForm,
        data: { transaction: txToEdit },
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
      accountFrom,
      accountTo,
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
  .transaction--transfer & {
    color: var(--app-on-surface-color);
  }
}
</style>
