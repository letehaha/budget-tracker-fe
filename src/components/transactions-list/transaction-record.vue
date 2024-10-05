<template>
  <button
    class="py-1 px-2 rounded-md flex justify-between items-center cursor-pointer w-full gap-2"
    type="button"
    aria-haspopup="true"
    @click="transactionEmit"
  >
    <div class="flex items-center gap-2">
      <template v-if="!isTransferTransaction && category">
        <CategoryCircle :category="category" />
      </template>

      <div class="text-left">
        <template v-if="isTransferTransaction">
          <span class="text-sm tracking-wider whitespace-nowrap">
            {{ accountMovement }}
          </span>
        </template>
        <template v-else>
          <template v-if="category">
            <span class="text-sm tracking-wider whitespace-nowrap">
              {{ category.name }}
            </span>
          </template>
        </template>
        <span class="text-sm tracking-wider line-clamp-2 opacity-40">
          {{ transaction.note }}
        </span>
      </div>
    </div>
    <div class="flex-none">
      <div
        :class="[
          'text-right',
          transaction.transactionType === TRANSACTION_TYPES.income && 'text-app-income-color',
          transaction.transactionType === TRANSACTION_TYPES.expense && 'text-app-expense-color',
        ]"
      >
        {{ formattedAmount }}
      </div>
      <div class="text-sm">
        {{ formateDate(transaction.time) }}
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import { computed, reactive } from "vue";
import { storeToRefs } from "pinia";
import { TRANSACTION_TRANSFER_NATURE, TRANSACTION_TYPES, TransactionModel } from "shared-types";

import { useCategoriesStore, useAccountsStore } from "@/stores";
import { useOppositeTxRecord } from "@/composable/data-queries/opposite-tx-record";

import { formatUIAmount } from "@/js/helpers";
import CategoryCircle from "@/components/common/category-circle.vue";

const props = defineProps<{
  tx: TransactionModel;
}>();

const { categoriesMap } = storeToRefs(useCategoriesStore());
const accountsStore = useAccountsStore();
const { accountsRecord } = storeToRefs(accountsStore);

const emit = defineEmits<{
  "record-click": [[value: TransactionModel, oppositeTx: TransactionModel]];
}>();

const transaction = reactive(props.tx);
const isTransferTransaction = computed(() =>
  [
    TRANSACTION_TRANSFER_NATURE.common_transfer,
    TRANSACTION_TRANSFER_NATURE.transfer_out_wallet,
  ].includes(transaction.transferNature),
);

const { oppositeTransferTransaction } = useOppositeTxRecord(transaction);

const category = computed(() => categoriesMap.value[transaction.categoryId]);
const accountFrom = computed(() => accountsRecord.value[transaction.accountId]);
const accountTo = computed(
  () => accountsRecord.value[oppositeTransferTransaction.value?.accountId],
);

const accountMovement = computed(() => {
  const separator = transaction.transactionType === TRANSACTION_TYPES.expense ? "=>" : "<=";

  if (transaction.transferNature === TRANSACTION_TRANSFER_NATURE.transfer_out_wallet) {
    return `${accountFrom.value?.name} ${separator} Out of wallet`;
  }
  return `${accountFrom.value?.name} ${separator} ${accountTo.value?.name}`;
});

const formateDate = (date) => format(new Date(date), "d MMMM y");

const transactionEmit = () => {
  emit("record-click", [transaction, oppositeTransferTransaction.value]);
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

<script lang="ts">
export function invalidateTxsByTransferIdQuery(id: string) {
  return ["transactions-by-transfer-id", id];
}
</script>
