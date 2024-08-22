<template>
  <div class="grid gap-2 grid-cols-[repeat(auto-fit,180px)]">
    <template v-if="noAccountsExist">
      <Card>
        <RouterLink to="/create-account">
          <CardContent class="p-4 flex items-center gap-4">
            Create your first account!
            <PlusIcon class="size-12 text-primary" />
          </CardContent>
        </RouterLink>
      </Card>
    </template>
    <template v-else-if="noEnabledAccoutnsExist">
      <Card>
        <RouterLink to="/accounts">
          <CardContent class="p-4 flex items-center gap-4">
            Enable accounts to see them here
          </CardContent>
        </RouterLink>
      </Card>
    </template>
    <template v-else-if="sortedAccounts.length">
      <template v-for="account in sortedAccounts" :key="account.id">
        <account-card
          :account="account"
          class="cursor-pointer"
          @click="redirectToAccount(account)"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { AccountModel } from "shared-types";
import { PlusIcon } from "lucide-vue-next";

import { ROUTES_NAMES } from "@/routes/constants";
import { Card, CardContent } from "@/components/lib/ui/card";
import { useAccountsStore } from "@/stores";
import AccountCard from "./account-card.vue";

const router = useRouter();
const { enabledAccounts, accounts } = storeToRefs(useAccountsStore());

const sortedAccounts = computed(() =>
  [...enabledAccounts.value].sort((a, b) => b.currentBalance - a.currentBalance),
);

const noAccountsExist = computed(() => accounts.value.length === 0);
const noEnabledAccoutnsExist = computed(() => enabledAccounts.value.length === 0);

const redirectToAccount = (account: AccountModel) => {
  router.push({ name: ROUTES_NAMES.account, params: { id: account.id } });
};
</script>
