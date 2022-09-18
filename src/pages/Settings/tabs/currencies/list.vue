<template>
  <div class="currencies-list">
    <div class="currencies-list__row currencies-list__row--header">
      <div class="currencies-list__column" />
      <div class="currencies-list__column">
        Name
      </div>
      <div class="currencies-list__column">
        Ratio
      </div>
    </div>
    <template
      v-for="(currency, index) in currencies"
      :key="currency.id"
    >
      <div class="currencies-list__item">
        <div
          class="currencies-list__row"
          @click="toggleActiveItem(index)"
        >
          <div class="currencies-list__column">
            {{ currency.code }}
          </div>
          <div class="currencies-list__column">
            {{ currency.currency }}
          </div>
          <div class="currencies-list__column">
            <template v-if="currency.isDefaultCurrency">
              <span class="currencies-list__note">
                This is your base currency
              </span>
            </template>
            <template v-else>
              1 = $0.1
            </template>
          </div>
        </div>

        <template v-if="activeItemIndex === index">
          <div class="currencies-list__editing-form">
            <label>
              Make your base currency
              <input type="checkbox">
            </label>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrenciesStore } from '@/stores';

export default defineComponent({
  setup() {
    const store = useCurrenciesStore();
    const { currencies } = storeToRefs(store);

    const activeItemIndex = ref<number>(null);

    const toggleActiveItem = (index: number) => {
      if (activeItemIndex.value === index) {
        activeItemIndex.value = null;
      } else {
        activeItemIndex.value = index;
      }
    };

    return {
      currencies,
      toggleActiveItem,
      activeItemIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.currencies-list {
  @include surface-container();

  --item-padding: 16px 32px;

  padding: 16px 0;
}
.currencies-list__item {
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
}
.currencies-list__row {
  color: var(--app-on-surface-color);
  padding: var(--item-padding);

  display: grid;
  grid-template-columns: 50px 300px 1fr;
  grid-gap: 16px;

  transition: background-color .2s ease-out;

  &:not(.currencies-list__row--header) {
    cursor: pointer;

    &:hover {
      background-color: var(--app-surface-color-hover);
    }
  }
}
.currencies-list__note {
  opacity: 0.5;
}
.currencies-list__editing-form {
  padding: var(--item-padding);
  border-top: 1px solid #ccc;
}
</style>
