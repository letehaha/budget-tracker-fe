<template>
  <div class="accounts-list">
    <template v-for="account in allAccounts" :key="account.id">
      <account-card
        :account="account"
        class="cursor-pointer"
        @click="redirectToAccount(account)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { AccountModel } from "shared-types";

import { ROUTES_NAMES } from "@/routes/constants";
import { useAccountsStore } from "@/stores";
import AccountCard from "./account-card.vue";

const router = useRouter();
const { enabledAccounts } = storeToRefs(useAccountsStore());

const allAccounts = computed(() =>
  [...enabledAccounts.value].sort(
    (a, b) => b.currentBalance - a.currentBalance,
  ),
);

const redirectToAccount = (account: AccountModel) => {
  router.push({ name: ROUTES_NAMES.account, params: { id: account.id } });
};
</script>

<style lang="scss" scoped>
.accounts-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, 180px);
  grid-gap: 8px;
}
</style>
