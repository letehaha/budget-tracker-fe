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

<script lang="ts">
import { defineComponent } from 'vue';
import { AccountRecord, MONOAccountRecord } from '@/js/records';
import { formatAmount } from '@/js/helpers';

export default defineComponent({
  props: {
    account: { type: [AccountRecord, MONOAccountRecord], required: true },
  },
  methods: {
    formatAmount,
  },
});
</script>

<style lang="scss" scoped>
.account {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
  transition: box-shadow .2s ease-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.15);
  }
}
</style>
