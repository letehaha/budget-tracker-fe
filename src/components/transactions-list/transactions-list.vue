<template>
  <div class="transactions-list">
    <template
      v-for="item in transactions"
      :key="`${item.id}-render-id-${renderId}`"
    >
      <TransactionRecrod :tx="item" @record-click="handlerRecordClick" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  TransactionModel,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
} from "shared-types";
import { MODAL_TYPES, useModalCenter } from "@/components/modal-center/index";
import TransactionRecrod from "./transaction-record.vue";

const props = withDefaults(
  defineProps<{
    transactions: TransactionModel[];
    isTransactionRecord?: boolean;
  }>(),
  {
    isTransactionRecord: false,
  },
);

const { addModal } = useModalCenter();
const oppositeTransferTransaction = ref<TransactionModel | null>(null);

const handlerRecordClick = (item) => {
  const baseTx = item;
  const oppositeTx = oppositeTransferTransaction.value;

  const isExternalTransfer =
    baseTx.accountType !== ACCOUNT_TYPES.system ||
    (oppositeTx && oppositeTx.accountType !== ACCOUNT_TYPES.system);

  const modalOptions = {
    transaction: baseTx,
    oppositeTransaction: undefined,
  };

  if (isExternalTransfer) {
    const isBaseExternal = baseTx.accountType !== ACCOUNT_TYPES.system;

    modalOptions.transaction = isBaseExternal ? baseTx : oppositeTx;
    modalOptions.oppositeTransaction = isBaseExternal ? oppositeTx : baseTx;
  } else if (!isExternalTransfer && baseTx.isTransfer) {
    const isValid = baseTx.transactionType === TRANSACTION_TYPES.expense;

    modalOptions.transaction = isValid ? baseTx : oppositeTx;
    modalOptions.oppositeTransaction = isValid ? oppositeTx : baseTx;
  }

  addModal({
    type: MODAL_TYPES.createRecord,
    data: modalOptions,
  });
};

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
