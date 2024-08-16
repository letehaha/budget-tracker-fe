<template>
  <div class="grid gap-2 grid-cols-[repeat(auto-fit,180px)]">
    <template v-if="allAccounts.length">
      <template v-for="account in allAccounts" :key="account.id">
        <account-card
          :account="account"
          class="cursor-pointer"
          @click="redirectToAccount(account)"
        />
      </template>
    </template>
    <template v-else>
      <Card>
        <RouterLink to="/create-account">
          <CardContent class="p-4 flex items-center gap-4">
            Create your first account!
            <PlusIcon class="size-12 text-primary" />
          </CardContent>
        </RouterLink>
      </Card>
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
