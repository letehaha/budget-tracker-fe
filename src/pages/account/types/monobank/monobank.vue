<script setup lang="ts">
import { debounce } from "lodash-es";
import { reactive, watchEffect, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { ACCOUNT_TYPES, AccountModel } from "shared-types";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";
import * as Tabs from "@/components/lib/ui/tabs";
import * as Collapsible from "@/components/lib/ui/collapsible";
import { Switch } from "@/components/lib/ui/switch";
import { Separator } from "@/components/lib/ui/separator";
import { useAccountsStore, useCurrenciesStore } from "@/stores";
import { toLocalNumber } from "@/js/helpers";

import {
  useNotificationCenter,
  NotificationType,
} from "@/components/notification-center";

import LoadLatestTransactions from "./load-latest-transactions.vue";
import LoadTransactions from "./load-transactions.vue";

const props = defineProps<{
  account: AccountModel;
}>();

const { addNotification } = useNotificationCenter();
const accountsStore = useAccountsStore();
const { currenciesMap, baseCurrency } = storeToRefs(useCurrenciesStore());

const form = reactive({
  isEnabled: false,
  period: null,
});

const updateVisibility = async ({
  id,
  isEnabled,
}: {
  id: number;
  isEnabled: boolean;
}) => {
  try {
    await accountsStore.editAccount({ id, isEnabled });

    addNotification({
      text: "Updated successfully",
      type: NotificationType.success,
    });
  } catch (err) {
    addNotification({
      text: "Unexpected error",
      type: NotificationType.error,
    });
    form.isEnabled = !form.isEnabled;
  }
};

const isOpen = ref(false);

const debouncedUpdateMonoAccHandler = debounce(updateVisibility, 1000);

watchEffect(() => {
  if (props.account) {
    form.isEnabled = props.account.isEnabled;
  }
});

watch(
  () => form.isEnabled,
  (value) => {
    if (value !== props.account.isEnabled) {
      debouncedUpdateMonoAccHandler({
        id: props.account.id,
        isEnabled: value,
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <Tabs.Tabs default-value="details">
    <Tabs.TabsList class="justify-start w-full mt-4">
      <Tabs.TabsTrigger value="details"> Details </Tabs.TabsTrigger>
      <Tabs.TabsTrigger value="settings"> Settings </Tabs.TabsTrigger>
    </Tabs.TabsList>

    <Tabs.TabsContent value="details" class="grid gap-4 pt-6">
      <div class="flex items-center justify-between gap-2">
        <span> Credit Limit: </span>

        {{ toLocalNumber(account.creditLimit) }}
        {{ baseCurrency.currency.code }}
      </div>
      <Separator />
      <div class="flex items-center justify-between gap-2">
        <span> Account Type: </span>

        {{ account.type }}
      </div>
      <Separator />

      <Collapsible.Collapsible v-model:open="isOpen">
        <Collapsible.CollapsibleTrigger class="w-full">
          <div class="flex items-center justify-between gap-2">
            <span> Currency: </span>

            <div class="flex gap-2">
              {{ currenciesMap[account.currencyId].currency.code }}

              <span v-if="currenciesMap[account.currencyId].isDefaultCurrency">
                (main)
              </span>

              <template v-if="isOpen">
                <ChevronUpIcon />
              </template>
              <template v-else>
                <ChevronDownIcon />
              </template>
            </div>
          </div>
        </Collapsible.CollapsibleTrigger>

        <Collapsible.CollapsibleContent>
          <div class="grid gap-2 pt-4 pl-4">
            <Separator />

            <div class="flex items-center justify-between gap-2">
              <span> Exchange Rate: </span>

              {{ currenciesMap[account.currencyId].exchangeRate }}
            </div>

            <Separator />

            <div class="flex items-center justify-between gap-2">
              <span> Exchange Rate Live Update: </span>

              {{
                currenciesMap[account.currencyId].liveRateUpdate
                  ? "Enabled"
                  : "Disabled"
              }}
            </div>
          </div>
        </Collapsible.CollapsibleContent>
      </Collapsible.Collapsible>

      <Separator />

      <div class="flex items-center justify-between gap-2">
        <span> Live update enabled? </span>

        {{ currenciesMap[account.currencyId].liveRateUpdate }}
      </div>
    </Tabs.TabsContent>

    <Tabs.TabsContent value="settings" class="grid gap-4 pt-6">
      <div class="flex items-center justify-between gap-2">
        <span> Make this account visible on the Dashboard: </span>

        <Switch v-model:checked="form.isEnabled" />
      </div>

      <Separator />

      <template v-if="account.type === ACCOUNT_TYPES.monobank">
        <LoadLatestTransactions :account="account" />
      </template>

      <Separator />

      <LoadTransactions :account="account" />
    </Tabs.TabsContent>
  </Tabs.Tabs>
</template>
