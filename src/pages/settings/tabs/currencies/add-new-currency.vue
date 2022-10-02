<template>
  <div class="add-new-currency">
    <div class="add-new-currency__selector">
      <select-field
        v-model="selectedCurrency"
        :values="filteredCurrencies"
        placeholder="Loading..."
        with-search-field
        :disabled="!filteredCurrencies.length"
        :label-key="(item: CurrencyRecord) => `${item.code} - ${item.currency}`"
      />
    </div>
    <ui-button
      :disabled="isCurrenciesLoading"
      @click="addCurrency"
    >
      Add
    </ui-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrenciesStore } from '@/stores';
import { addUserCurrencies } from '@/api/currencies';
import { CurrencyRecord } from '@/js/records';
import { useNotificationCenter } from '@/components/notification-center';
import SelectField from '@/components/fields/select-field.vue';
import UiButton from '@/components/common/ui-button.vue';

export default defineComponent({
  components: { SelectField, UiButton },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const { addErrorNotification } = useNotificationCenter();
    const {
      currencies: userCurrencies,
      systemCurrencies,
    } = storeToRefs(currenciesStore);

    const isCurrenciesLoading = ref(false);
    const selectedCurrency = ref<CurrencyRecord>(null);
    const filteredCurrencies = computed(
      () => systemCurrencies.value.filter(
        item => !userCurrencies.value.some(el => el.code === item.code),
      ),
    );

    const addCurrency = async () => {
      try {
        isCurrenciesLoading.value = true;

        await addUserCurrencies([{
          // TODO: add more options
          currencyId: selectedCurrency.value.id,
        }]);

        await currenciesStore.loadCurrencies();
      } catch (e) {
        addErrorNotification('Unexpected error. Currency is not added.');
      } finally {
        isCurrenciesLoading.value = false;
      }
    };

    return {
      CurrencyRecord,
      filteredCurrencies,
      addCurrency,
      selectedCurrency,
      isCurrenciesLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.add-new-currency {
  @include surface-container();

  margin-bottom: 32px;
  padding: 16px;

  display: flex;
  gap: 16px;
}
.add-new-currency__selector {
  max-width: 300px;
  width: 100%;
  flex: none;
}
</style>
