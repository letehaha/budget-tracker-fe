<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  AccountModel,
  TRANSACTION_TYPES,
  HoldingModel,
  SecurityModel,
} from "shared-types";
import { useQueryClient } from "@tanstack/vue-query";
import { createInvestmentTransaction } from "@/api";
import { useFetchSecuritiesList, useInvestTxsForAccount } from "@/composable";
import InputField from "@/components/fields/input-field.vue";
import SelectField from "@/components/fields/select-field.vue";
import DateField from "@/components/fields/date-field.vue";
import Button from "@/components/lib/ui/button/Button.vue";
import InvestmentTransactionRecord from "@/components/investment-transactions/investment-transaction-record.vue";
import * as Card from "@/components/lib/ui/card";
import * as Popover from "@/components/lib/ui/popover";
import { useNotificationCenter } from "@/components/notification-center";

const props = defineProps<{
  account: AccountModel;
  holding: HoldingModel;
}>();
const queryClient = useQueryClient();
const { addErrorNotification } = useNotificationCenter();
const { data: securities } = useFetchSecuritiesList();
const { data: transactions } = useInvestTxsForAccount({
  accountId: props.account.id,
  securityId: props.holding.securityId,
});

const txTypeValues = computed(() => [
  { value: TRANSACTION_TYPES.income, label: "Buy" },
  { value: TRANSACTION_TYPES.expense, label: "Sell" },
]);

const popoverOpened = ref(false);

const form = reactive({
  security: null,
  type: txTypeValues.value[0],
  date: new Date(),
  note: "",
  quantity: null,
  price: null,
  fees: null,
});

const securitiesRecord = computed(() =>
  securities.value.reduce(
    (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    },
    {} as Record<number, SecurityModel>,
  ),
);
const securityRecord = computed<SecurityModel>(
  () => securitiesRecord.value[props.holding.securityId],
);

const createTransaction = async () => {
  try {
    let quantity = parseFloat(form.quantity);

    if (form.type.value === TRANSACTION_TYPES.expense) quantity *= -1;

    const params = {
      accountId: props.account.id,
      securityId: securityRecord.value.id,
      transactionType: form.type.value,
      date: form.date.toISOString(),
      name: form.note,
      quantity: String(quantity),
      price: String(form.price || 0),
      fees: String(form.fees || 0),
    };
    await createInvestmentTransaction(params);
    popoverOpened.value = false;
    queryClient.invalidateQueries({ queryKey: ["useFetchHoldingsList"] });
  } catch (err) {
    console.error(err);
    addErrorNotification("Unexpected error");
  }
};
</script>

<template>
  <Card.Card class="max-w-[500px] w-full">
    <Card.CardHeader>
      <div class="flex items-center justify-between">
        <span class="text-2xl font-bold">
          {{ securityRecord.name }}
        </span>

        <Popover.Popover
          :open="popoverOpened"
          @update:open="popoverOpened = $event"
        >
          <Popover.PopoverTrigger>
            <Button> + Add transaction </Button>
          </Popover.PopoverTrigger>
          <Popover.PopoverContent class="w-[450px] grid gap-4">
            <SelectField
              v-model="form.type"
              :values="txTypeValues"
              label="Income/expense"
              type="text"
            />
            <DateField v-model="form.date" label="Date" />
            <InputField v-model="form.quantity" label="Shares" type="text" />
            <InputField v-model="form.price" label="Cost / Share" type="text" />
            <InputField v-model="form.fees" label="Commission" type="text" />
            <InputField v-model="form.note" label="Note" type="text" />

            <Button class="w-full" @click="createTransaction">Submit</Button>
          </Popover.PopoverContent>
        </Popover.Popover>
      </div>
    </Card.CardHeader>
    <Card.CardContent class="grid gap-2 overflow-y-auto max-h-[700px]">
      <template v-if="transactions.length">
        <div
          class="sticky top-0 grid grid-cols-4 px-4 py-2 text-center bg-card"
        >
          <span class="text-left">Quantity</span>
          <span>Price</span>
          <span>Total cost</span>
          <span>Date</span>
        </div>
        <template v-for="tx of transactions" :key="tx.id">
          <Button variant="ghost" class="h-auto">
            <InvestmentTransactionRecord :transaction="tx" />
          </Button>
        </template>
      </template>
      <template v-else> No records yet </template>
    </Card.CardContent>
  </Card.Card>
</template>
