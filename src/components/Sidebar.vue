<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      BudgetTracker
    </div>
    <nav class="sidebar__navigation">
      <router-link
        :to="{ name: 'dashboard' }"
        class="sidebar__navigation-link"
      >
        Dashboard
      </router-link>
      <router-link
        :to="{ name: 'accounts' }"
        class="sidebar__navigation-link"
      >
        Accounts
      </router-link>
      <router-link
        :to="{ name: 'records' }"
        class="sidebar__navigation-link"
      >
        Records
      </router-link>
      <router-link
        :to="{ name: 'crypto' }"
        class="sidebar__navigation-link"
      >
        Crypto
      </router-link>
      <router-link
        :to="{ name: 'settings' }"
        class="sidebar__navigation-link"
      >
        Settings
      </router-link>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  padding: 24px 24px;
  background-color: var(--app-surface-color);
  z-index: 1;
}
.sidebar__logo {
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-align: center;
  margin-bottom: 80px;
  color: var(--app-on-surface-color);
}
.sidebar__navigation-link {
  font-size: 16px;
  letter-spacing: 0.5px;
  font-weight: 400;
  display: block;
  margin-bottom: 32px;
  color: var(--app-on-surface-color);
}
</style>
