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
      v-for="(currency, index) in currenciesList"
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
              <div class="currencies-list__ratios">
                <span>
                  {{ currency.quoteCode }} 1 =
                  {{ currency.code }} {{ currency.quoteRate }}
                </span>
                <span>
                  {{ currency.code }} 1 =
                  {{ currency.quoteCode }} {{ currency.rate }}
                </span>
              </div>
            </template>
          </div>
        </div>

        <template v-if="activeItemIndex === index">
          <edit-currency
            :currency="currency"
            :deletion-disabled="isDeletionDisabled(currency)"
            @delete="onDeleteHandler(index)"
            @submit="onSubmitHandler"
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
  onMounted,
  computed,
} from 'vue';
import { API_ERROR_CODES } from 'shared-types';
import { storeToRefs } from 'pinia';
import { useCurrenciesStore, useAccountsStore } from '@/stores';
import { UserCurrencyRecord, ExchangeRateRecord } from '@/js/records';
import { deleteUserCurrency, loadUserCurrenciesExchangeRates } from '@/api/currencies';
import { useNotificationCenter } from '@/components/notification-center';
import EditCurrency from './edit-currency.vue';
import { CurrencyWithExchangeRate } from './types';

type ActiveItemIndex = number;

export default defineComponent({
  components: { EditCurrency },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const accountsStore = useAccountsStore();
    const {
      addSuccessNotification,
      addErrorNotification,
    } = useNotificationCenter();
    const { currencies } = storeToRefs(currenciesStore);
    const { accountsCurrencyIds } = storeToRefs(accountsStore);
    const rates = ref<ExchangeRateRecord[]>([]);

    const currenciesList = computed<CurrencyWithExchangeRate[]>(
      () => currencies.value.map(item => {
        const rate = rates.value.find(i => i.baseCode === item.code);

        return {
          ...item,
          rate: Number(rate?.rate?.toFixed(4)),
          quoteCode: rate?.quoteCode,
          quoteRate: Number(rate?.quoteRate?.toFixed(4)),
        };
      }),
    );

    const activeItemIndex = ref<ActiveItemIndex | null>(null);

    const toggleActiveItem = (index: ActiveItemIndex) => {
      activeItemIndex.value = activeItemIndex.value === index ? null : index;
    };

    const loadRates = async () => {
      try {
        rates.value = await loadUserCurrenciesExchangeRates();
      } catch (err) {
        if (err.data.code === API_ERROR_CODES.unauthorized) return;
        addErrorNotification('Unexpected error. Cannot load exchange rates.');
      }
    };

    onMounted(() => {
      loadRates();
    });

    const onDeleteHandler = async (index: ActiveItemIndex) => {
      try {
        await deleteUserCurrency(
          currencies.value[index].currencyId,
        );

        activeItemIndex.value = null;

        await currenciesStore.loadCurrencies();

        addSuccessNotification('Successfully deleted.');
      } catch (e) {
        if (e.data.code === API_ERROR_CODES.unauthorized) return;
        if (e.data.code === API_ERROR_CODES.validationError) {
          addErrorNotification(e.data.message);
          return;
        }
        addErrorNotification('Unexpected error. Currency is not deleted.');
      }
    };

    const onSubmitHandler = () => {
      loadRates();
    };

    const isDeletionDisabled = (currency: UserCurrencyRecord) => (
      accountsCurrencyIds.value.includes(currency.currencyId)
    );

    return {
      rates,
      loadRates,
      currenciesList,
      toggleActiveItem,
      activeItemIndex,
      onSubmitHandler,
      onDeleteHandler,
      isDeletionDisabled,
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
.currencies-list__ratios {
  display: flex;
  gap: 24px;
}
</style>
