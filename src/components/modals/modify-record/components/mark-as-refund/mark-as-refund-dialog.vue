<script lang="ts" setup>
import { ref } from "vue";
import { TRANSACTION_TYPES, TransactionModel } from "shared-types";
import { Button } from "@/components/lib/ui/button";
import * as Dialog from "@/components/lib/ui/dialog";
import RecordsList from "./refund-records-list.vue";
import MarkAsRefundInfoPopover from "./mark-as-refund-info-popover.vue";

defineProps<{ transactionType: TRANSACTION_TYPES }>();

const emit = defineEmits<{
  "update:model-value": [value: TransactionModel];
}>();

const isDialogOpen = ref(false);

const saveResult = (v: TransactionModel) => {
  emit("update:model-value", v);
  isDialogOpen.value = false;
};
</script>

<template>
  <Dialog.Dialog v-model:open="isDialogOpen">
    <Dialog.DialogTrigger as-child>
      <Button class="w-full" variant="secondary"> Mark as refund </Button>
    </Dialog.DialogTrigger>
    <Dialog.DialogContent class="sm:max-w-md max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto]">
      <Dialog.DialogHeader class="mb-4">
        <Dialog.DialogTitle>Select transaction</Dialog.DialogTitle>
        <Dialog.DialogDescription>
          <span> Select the original transaction that this new entry is refunding. </span>

          <MarkAsRefundInfoPopover />
        </Dialog.DialogDescription>
      </Dialog.DialogHeader>

      <RecordsList :transaction-type="transactionType" :on-select="saveResult" class="my-2" />
    </Dialog.DialogContent>
  </Dialog.Dialog>
</template>
