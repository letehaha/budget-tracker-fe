<template>
  <Card class="sidebar">
    <CardHeader>
      <div class="sidebar__logo">
        <span class="hidden md:block"> BudgetTracker </span>
        <span class="md:hidden"> BT </span>
      </div>
    </CardHeader>
    <CardContent class="px-3 md:px-6 flex flex-col flex-grow">
      <nav class="sidebar__navigation">
        <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.home }">
          <ui-button
            :variant="isActive ? 'default' : 'ghost'"
            as="span"
            class="sidebar__item"
            size="lg"
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
            size="lg"
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
            size="lg"
          >
            <CreditCardIcon />
            <span> Transactions </span>
          </ui-button>
        </router-link>

        <template v-if="isDevEnv">
          <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.analytics }">
            <ui-button
              :variant="isActive ? 'default' : 'ghost'"
              as="span"
              class="sidebar__item"
              size="lg"
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
              size="lg"
            >
              <BitcoinIcon />
              <span> Crypto (dev only) </span>
            </ui-button>
          </router-link>
        </template>
        <router-link v-slot="{ isActive }" :to="{ name: ROUTES_NAMES.settings }">
          <ui-button
            :variant="isActive ? 'default' : 'ghost'"
            as="span"
            class="sidebar__item"
            size="lg"
          >
            <SettingsIcon />
            <span> Settings </span>
          </ui-button>
        </router-link>
      </nav>

      <ui-button variant="secondary" class="sidebar__item mt-auto" @click="logOutHandler">
        <LogOutIcon />
        <span> Logout </span>
      </ui-button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores";
import { isDevEnv } from "@/common/const";
import { ROUTES_NAMES } from "@/routes";
import {
  LayoutDashboardIcon,
  CreditCardIcon,
  LayersIcon,
  ChartAreaIcon,
  BitcoinIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-vue-next";
import UiButton from "@/components/lib/ui/button/Button.vue";
import { Card, CardContent, CardHeader } from "@/components/lib/ui/card";

const router = useRouter();
const { logout } = useAuthStore();

const logOutHandler = () => {
  logout();
  router.push({ name: ROUTES_NAMES.signIn });
};
</script>

<style lang="scss" scoped>
.sidebar {
  @apply flex flex-col rounded-none;
}
.sidebar__logo {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  color: var(--abc-text-white-base);
}
.sidebar__item {
  @apply justify-start w-full px-3 gap-2;

  span {
    @apply hidden md:block;
  }
}
.sidebar__navigation {
  display: grid;
  gap: 16px;
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
