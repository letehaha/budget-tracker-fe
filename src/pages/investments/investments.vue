<template>
  <div class="p-6">
    <div class="flex flex-wrap items-center justify-between gap-6">
      <h1 class="text-2xl tracking-wider">Investments</h1>

      <Button :disabled="isSyncing || isSyncAbilityDisabled" @click="syncData">
        {{ isSyncing ? "Syncing..." : "Sync securities" }}
      </Button>
    </div>

    <div class="flex flex-col gap-2 mt-4">
      <template v-for="account of investmentAccounts" :key="account.id">
        <router-link
          :to="{
            name: ROUTES_NAMES.investmentAccount,
            params: { id: account.id },
          }"
        >
          <Card class="flex items-center gap-10 p-4">
            <span>
              {{ account.name }}
            </span>
            <span>
              {{ formatBalance(account) }}
            </span>
          </Card>
        </router-link>
      </template>
    </div>
    <!-- <button type="button" @click="createHoldingHandler">Add holding</button> -->
  </div>
</template>

<script setup lang="ts">
// import { ACCOUNT_CATEGORIES } from "shared-types";
// import { useFetchSecuritiesList, useFetchHoldingsList } from "@/composable";
// import { createHolding } from "@/api";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { isSameDay } from "date-fns";
import { AccountModel } from "shared-types";
import { useAccountsStore } from "@/stores";
import { ROUTES_NAMES } from "@/routes";
import { syncSecurities } from "@/api";
import { useFormatCurrency } from "@/composable";
import { Card } from "@/components/lib/ui/card";
import { Button } from "@/components/lib/ui/button";

const LSKey = "securities-sync-date";

const accountsStore = useAccountsStore();
const { formatAmountByCurrencyId } = useFormatCurrency();
const { investmentAccounts } = storeToRefs(accountsStore);

const isSyncing = ref(false);

const lastSyncDate = ref(localStorage.getItem(LSKey));
const isSyncAbilityDisabled = computed(() =>
  lastSyncDate.value
    ? isSameDay(new Date(), new Date(lastSyncDate.value))
    : false,
);

const formatBalance = (account: AccountModel) =>
  formatAmountByCurrencyId(
    account.currentBalance - account.creditLimit,
    account.currencyId,
  );

const syncData = async () => {
  try {
    if (isSyncAbilityDisabled.value) return;

    isSyncing.value = true;
    localStorage.setItem(LSKey, new Date().toISOString());

    await syncSecurities();

    lastSyncDate.value = localStorage.getItem(LSKey);
  } catch (err) {
    localStorage.removeItem(LSKey);
  } finally {
    isSyncing.value = false;
  }
};
console.log("investmentAccounts", investmentAccounts);

// const { data: securities } = useFetchSecuritiesList();
// const { data: prices } = useFetchSecuritiesPrices();
// const { data: holdings } = useFetchHoldingsList();

// const createHoldingHandler = async () => {
//   const account = accounts.value.find(
//     (item) => item.accountCategory === ACCOUNT_CATEGORIES.investment,
//   );
//   const security = securities.value.find((item) => item.symbol === "NVDA");

//   console.log({ account, security });
//   const holding = await createHolding({
//     accountId: account.id,
//     securityId: security.id,
//   });

//   console.log("holding", holding);
// };

// console.log("holdings", holdings);
</script>
