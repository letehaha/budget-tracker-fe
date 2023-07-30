<template>
  <section class="dashboard">
    <accounts-list class="dashboard__accounts" />

    <div class="dashboard__info">
      <div class="dashboard__charts">
        <CurrentBalanceWidget />
      </div>
      <div class="dashboard__records">
        <transactions-list />
        <router-link
          class="dashboard__show-all"
          :to="{ name: ROUTES_NAMES.records }"
        >
          Show all records
        </router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CurrentBalanceWidget from '@/components/widgets/current-balance.vue';
import { ROUTES_NAMES } from '@/routes/constants';
import TransactionsList from './transactions-list.vue';
import AccountsList from './accounts-list/accounts-list.vue';

export default defineComponent({
  name: 'dashboard',
  components: {
    TransactionsList,
    AccountsList,
    CurrentBalanceWidget,
  },
  setup() {
    return { ROUTES_NAMES };
  },
});
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 24px;
}
.dashboard__info {
  display: grid;
  grid-template-columns: 1fr 420px;
  margin-top: 24px;
  grid-gap: 24px;
}
.dashboard__records {
  padding: 24px;
  background-color: var(--app-surface-color);
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
.dashboard__charts {
  color: var(--app-on-surface-color);
}
.dashboard__show-all {
  display: block;
  color: var(--primary-500);
  text-align: center;
}
</style>
