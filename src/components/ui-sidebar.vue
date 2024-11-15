<template>
  <Card class="flex flex-col rounded-none">
    <CardHeader class="sm:py-3 h-[52px]">
      <div class="text-lg font-medium">
        <span class="hidden md:block"> BudgetTracker </span>
        <span class="md:hidden"> BT </span>
      </div>
    </CardHeader>
    <CardContent class="px-3 md:px-6 flex flex-col flex-grow max-h-[calc(100%-52px)]">
      <nav class="grid gap-2 -ml-3">
        <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.home }">
          <ui-button
            :variant="isActive ? 'default' : 'ghost'"
            as="span"
            class="sidebar__item"
            size="default"
          >
            <LayoutDashboardIcon />
            <span> Dashboard </span>
          </ui-button>
        </router-link>

        <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.accounts }">
          <ui-button
            :variant="isActive ? 'default' : 'ghost'"
            as="span"
            class="sidebar__item"
            size="default"
          >
            <LayersIcon />
            <span> Accounts </span>
          </ui-button>
        </router-link>

        <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.transactions }">
          <ui-button
            :variant="isActive ? 'default' : 'ghost'"
            as="span"
            class="sidebar__item"
            size="default"
          >
            <CreditCardIcon />
            <span> Transactions </span>
          </ui-button>
        </router-link>

        <!-- <template v-if="isDevEnv">
          <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.analytics }">
            <ui-button
              :variant="isActive ? 'default' : 'ghost'"
              as="span"
              class="sidebar__item"
              size="default"
            >
              <ChartAreaIcon />
              <span> Analytics (dev only) </span>
            </ui-button>
          </router-link>
        </template>

        <template v-if="isDevEnv">
          <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.crypto }">
            <ui-button
              :variant="isActive ? 'default' : 'ghost'"
              as="span"
              class="sidebar__item"
              size="default"
            >
              <BitcoinIcon />
              <span> Crypto (dev only) </span>
            </ui-button>
          </router-link>
        </template> -->
      </nav>

      <div class="my-6 min-w-[260px] overflow-y-hidden -ml-3 grid gap-4">
        <p class="text-xs uppercase ml-3">Accounts</p>

        <div class="grid overflow-auto max-h-full">
          <template v-for="account in enabledAccounts" :key="account.id">
            <router-link
              :to="{ name: ROUTES_NAMES.account, params: { id: account.id } }"
              class="flex w-full"
            >
              <ui-button variant="ghost" as="div" size="default" class="w-full h-auto">
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

      <ui-button variant="secondary" class="sidebar__item mt-auto" @click="logOutHandler">
        <LogOutIcon />
        <span> Logout </span>
      </ui-button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useAccountsStore, useAuthStore } from "@/stores";
import { ROUTES_NAMES } from "@/routes";
import { LayoutDashboardIcon, CreditCardIcon, LayersIcon, LogOutIcon } from "lucide-vue-next";
import UiButton from "@/components/lib/ui/button/Button.vue";
import { Card, CardContent, CardHeader } from "@/components/lib/ui/card";
import { storeToRefs } from "pinia";
import { useFormatCurrency } from "@/composable";

const { enabledAccounts } = storeToRefs(useAccountsStore());
const { formatAmountByCurrencyId } = useFormatCurrency();

const router = useRouter();
const { logout } = useAuthStore();

const logOutHandler = () => {
  logout();
  router.push({ name: ROUTES_NAMES.signIn });
};
</script>

<style lang="scss" scoped>
.sidebar__item {
  @apply justify-start w-full px-3 gap-2;
}
.sidebar__navigation-link {
  color: var(--sidebar-btn-text);
  border-radius: 4px;
  padding: 12px 16px;
  transition: opacity 0.15s ease-out;

  span {
    opacity: 0.7;
  }

  &:hover {
    background-color: var(--sidebar-btn-bg-hover);
  }

  &.router-link-active {
    font-weight: 500;
    background-color: var(--sidebar-btn-bg-active);
    color: var(--sidebar-btn-text-active);

    span {
      opacity: 1;
    }
  }
}
</style>
