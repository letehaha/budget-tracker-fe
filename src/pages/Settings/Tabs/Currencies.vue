<template>
  <div class="currencies-list">
    <div class="currencies-list__row">
      <div class="currencies-list__column">
        Name
      </div>
      <div class="currencies-list__column">
        Code
      </div>
    </div>
    <template
      v-for="currency in currencies"
      :key="currency.id"
    >
      <div class="currencies-list__row">
        <div class="currencies-list__column">
          {{ currency.currency }}
        </div>
        <div class="currencies-list__column">
          {{ currency.code }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrenciesStore } from '@/newStore';

export default defineComponent({
  setup() {
    const store = useCurrenciesStore();

    const { currencies } = storeToRefs(store);

    return {
      currencies,
    };
  },
});
</script>

<style lang="scss" scoped>
.currencies-list__row {
  color: var(--app-on-surface-color);
  padding: 12px 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}
</style>
