<template>
  <div class="account">
    <div class="account__name">
      {{ account.name || 'No name set...' }}
    </div>
    <div class="account__balance-info">
      <div class="account__balance">
        {{ formatAmount(account.balance - account.creditLimit) }}
      </div>
      <template v-if="account.creditLimit">
        <div class="account__credit-limit">
          <span class="account__credit-limit-label">
            Credit limit:
          </span>
          <span class="account__credit-limit-value">
            {{ formatAmount(account.creditLimit) }}
          </span>
        </div>
      </template>
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
  background-color: var(--app-surface-color);
  border-radius: 6px;
  box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.05);
  transition: box-shadow .2s ease-out;
  cursor: pointer;
  color: var(--app-on-surface-color);

  &:hover {
    box-shadow: 0 0 24px 0px rgba(0, 0, 0, 0.15);
  }
}
.account__balance-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.account__balance {
  font-size: 18px;
}
.account__credit-limit {
  font-size: 12px;
  opacity: 0.8;

  display: flex;
  flex-direction: column;
}
.account__credit-limit-label,
.account__credit-limit-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
