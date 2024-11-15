<script setup lang="ts">
import { useAccountsStore } from "@/stores";
import { ROUTES_NAMES } from "@/routes";
import UiButton from "@/components/lib/ui/button/Button.vue";
import { storeToRefs } from "pinia";
import { useFormatCurrency } from "@/composable";

const { enabledAccounts } = storeToRefs(useAccountsStore());
const { formatAmountByCurrencyId } = useFormatCurrency();
</script>

<template>
  <div class="my-6 min-w-[260px] overflow-y-hidden -ml-3 grid gap-4">
    <p class="text-xs uppercase ml-3">Accounts</p>

    <div class="grid overflow-auto max-h-full">
      <template v-for="account in enabledAccounts" :key="account.id">
        <router-link
          v-slot="{ isActive }"
          :to="{ name: ROUTES_NAMES.account, params: { id: account.id } }"
          class="flex w-full"
        >
          <ui-button
            :variant="isActive ? 'secondary' : 'ghost'"
            as="div"
            size="default"
            class="w-full h-auto"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex flex-col gap-1">
                <span class="text-sm">{{ account.name }}</span>
                <span class="text-xs">
                  {{ account.accountCategory }}
                </span>
              </div>
              <div class="text-sm">
                {{ formatAmountByCurrencyId(account.currentBalance, account.currencyId) }}
              </div>
            </div>
          </ui-button>
        </router-link>
      </template>
    </div>
  </div>
</template>
