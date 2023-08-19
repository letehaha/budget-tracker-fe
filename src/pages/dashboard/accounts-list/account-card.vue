<template>
  <div class="account">
    <div class="account__name">
      {{ account.name || 'No name set...' }}
    </div>
    <div class="account__balance-info">
      <div class="account__balance">
        {{
          formatUIAmount(account.currentBalance - account.creditLimit, {
            currency: currenciesMap[account.currencyId].currency.code,
          })
        }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { AccountModel } from 'shared-types';
import { useCurrenciesStore } from '@/stores';
import { formatUIAmount, toLocalFiatCurrency } from '@/js/helpers';

export default defineComponent({
  props: {
    account: {
      type: Object as PropType<AccountModel>,
      required: true,
    },
  },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const { currenciesMap } = storeToRefs(currenciesStore);

    return {
      currenciesMap,
    };
  },
  methods: {
    formatUIAmount,
    toLocalFiatCurrency,
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
  font-size: 16px;
  font-weight: 500;
}
</style>
