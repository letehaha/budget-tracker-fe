<template>
  <div class="account">
    <div class="account__name">
      {{ account.name || 'No name set...' }}
    </div>
    <div class="account__balance">
      {{ formatAmount(account.balance) }}
    </div>
  </div>
</template>

<script>
import { AccountRecord, MONOAccountRecord } from '@/js/records';
import { formatAmount } from '@/js/helpers';

export default {
  props: {
    account: { type: [AccountRecord, MONOAccountRecord], required: true },
  },
  methods: {
    formatAmount,
  },
};
</script>

<style lang="scss" scoped>
.account {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
}
</style>
