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
          :class="{
            'currencies-list__row--default': currency.isDefaultCurrency,
          }"
          @click="!currency.isDefaultCurrency && toggleActiveItem(index)"
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
          <edit-currency
            :currency="currency"
            @delete="onDeleteHandler(index)"
          />
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
import { deleteUserCurrency } from '@/api/currencies';
import { useNotificationCenter } from '@/components/notification-center';
import EditCurrency from './edit-currency.vue';

type ActiveItemIndex = number;

export default defineComponent({
  components: { EditCurrency },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const {
      addSuccessNotification,
      addErrorNotification,
    } = useNotificationCenter();
    const { currencies } = storeToRefs(currenciesStore);

    const activeItemIndex = ref<ActiveItemIndex>(null);

    const toggleActiveItem = (index: ActiveItemIndex) => {
      if (activeItemIndex.value === index) {
        activeItemIndex.value = null;
      } else {
        activeItemIndex.value = index;
      }
    };

    const onDeleteHandler = async (index: ActiveItemIndex) => {
      try {
        await deleteUserCurrency(
          currencies.value[index].currencyId,
        );

        activeItemIndex.value = null;

        await currenciesStore.loadCurrencies();

        addSuccessNotification('Successfully deleted.');
      } catch (e) {
        addErrorNotification('Unexpected error. Currency is not deleted.');
      }
    };

    return {
      currencies,
      toggleActiveItem,
      activeItemIndex,
      onDeleteHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.currencies-list {
  --settings-currency-list-item-padding: 16px 32px;

  @include surface-container();

  padding: 16px 0;
}
.currencies-list__item {
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
}
.currencies-list__row {
  padding: var(--settings-currency-list-item-padding);

  display: grid;
  grid-template-columns: 50px 300px 1fr;
  grid-gap: 16px;

  transition: background-color .2s ease-out;

  &:not(.currencies-list__row--header):not(.currencies-list__row--default) {
    cursor: pointer;

    &:hover {
      background-color: var(--app-surface-color-hover);
    }
  }
}
.currencies-list__note {
  opacity: 0.5;
}
</style>
