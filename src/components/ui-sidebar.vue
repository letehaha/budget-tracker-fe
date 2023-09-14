<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      BudgetTracker
    </div>
    <nav class="sidebar__navigation">
      <router-link
        :to="{ name: ROUTES_NAMES.home }"
        class="sidebar__navigation-link"
      >
        <span>
          Dashboard
        </span>
      </router-link>
      <router-link
        :to="{ name: ROUTES_NAMES.accounts }"
        class="sidebar__navigation-link"
      >
        <span>
          Accounts
        </span>
      </router-link>
      <router-link
        :to="{ name: ROUTES_NAMES.records }"
        class="sidebar__navigation-link"
      >
        <span>
          Records
        </span>
      </router-link>
      <template v-if="isDevEnv">
        <router-link
          :to="{ name: ROUTES_NAMES.analytics }"
          class="sidebar__navigation-link"
        >
          <span>
            Analytics
          </span>
        </router-link>
      </template>
      <router-link
        :to="{ name: ROUTES_NAMES.crypto }"
        class="sidebar__navigation-link"
      >
        <span>
          Crypto
        </span>
      </router-link>
      <router-link
        :to="{ name: ROUTES_NAMES.settings }"
        class="sidebar__navigation-link"
      >
        <span>
          Settings
        </span>
      </router-link>
    </nav>

    <ui-button
      theme="light-dark"
      class="sidebar__logout"
      @click="logOutHandler"
    >
      Logout
    </ui-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores';
import { isDevEnv } from '@/common/const';
import { ROUTES_NAMES } from '@/routes';
import UiButton from '@/components/common/ui-button.vue';

const router = useRouter();
const { logout } = useAuthStore();

const logOutHandler = () => {
  logout();
  router.push({ name: ROUTES_NAMES.signIn });
};
</script>

<style lang="scss" scoped>
.sidebar {
  --sidebar-bg: var(--abc-background-dark-200);
  --sidebar-btn-bg-active: var(--abc-brand-light-500);
  --sidebar-btn-bg-hover: var(--abc-background-dark-400);
  --sidebar-btn-text: var(--abc-text-white-base);

  width: 180px;
  flex-grow: 0;
  padding: 48px 16px;
  background-color: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
}

.sidebar__logo {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  margin-bottom: 40px;
  color: var(--abc-text-white-base);
}
.sidebar__navigation {
  display: grid;
  gap: 16px;
}
.sidebar__navigation-link {
  color: var(--sidebar-btn-text);
  border-radius: 4px;
  padding: 12px 16px;
  transition: opacity .15s ease-out;

  span {
    opacity: .7;
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
.sidebar__logout {
  margin-top: auto;
  width: 100%;
  justify-content: flex-start;
}
</style>
