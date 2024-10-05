<template>
  <Dialog.Dialog v-model:open="isDialogVisible">
    <div v-bind="$attrs" class="transactions-list">
      <template v-for="item in transactions" :key="`${item.id}-render-id-${renderId}`">
        <TransactionRecord :tx="item" @record-click="handlerRecordClick" />
      </template>
    </div>

    <Dialog.DialogContent custom-close class="max-h-[90dvh] w-full max-w-[900px] bg-card p-0">
      <ManageTransactionDoalogContent v-bind="dialogProps" @close-modal="isDialogVisible = false" />
    </Dialog.DialogContent>
  </Dialog.Dialog>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref, watch } from "vue";
import {
  TransactionModel,
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  TRANSACTION_TRANSFER_NATURE,
} from "shared-types";
import * as Dialog from "@/components/lib/ui/dialog";
import TransactionRecord from "./transaction-record.vue";

const ManageTransactionDoalogContent = defineAsyncComponent(
  () => import("@/components/dialogs/manage-transaction/dialog-content.vue"),
);

const props = withDefaults(
  defineProps<{
    transactions: TransactionModel[];
    isTransactionRecord?: boolean;
  }>(),
  {
    isTransactionRecord: false,
  },
);

const isDialogVisible = ref(false);
const defaultDialogProps = {
  transaction: undefined,
  oppositeTransaction: undefined,
};
const dialogProps = ref<{
  transaction: TransactionModel;
  oppositeTransaction: TransactionModel;
}>(defaultDialogProps);

watch(isDialogVisible, (value) => {
  if (value === false) dialogProps.value = defaultDialogProps;
});

const handlerRecordClick = ([baseTx, oppositeTx]: [
  baseTx: TransactionModel,
  oppositeTx: TransactionModel,
]) => {
  const isExternalTransfer =
    baseTx.accountType !== ACCOUNT_TYPES.system ||
    (oppositeTx && oppositeTx.accountType !== ACCOUNT_TYPES.system);

  const modalOptions: typeof dialogProps.value = {
    transaction: baseTx,
    oppositeTransaction: undefined,
  };

  if (isExternalTransfer) {
    const isBaseExternal = baseTx.accountType !== ACCOUNT_TYPES.system;

    modalOptions.transaction = isBaseExternal ? baseTx : oppositeTx;
    modalOptions.oppositeTransaction = isBaseExternal ? oppositeTx : baseTx;
  } else if (
    !isExternalTransfer &&
    baseTx.transferNature === TRANSACTION_TRANSFER_NATURE.common_transfer
  ) {
    const isValid = baseTx.transactionType === TRANSACTION_TYPES.expense;

    modalOptions.transaction = isValid ? baseTx : oppositeTx;
    modalOptions.oppositeTransaction = isValid ? oppositeTx : baseTx;
  }

  isDialogVisible.value = true;
  dialogProps.value = modalOptions;
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
