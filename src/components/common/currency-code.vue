<template>
  <span>{{ currencyCode }}</span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useCurrenciesStore } from '@/stores';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'currency-code',
  props: {
    currencyId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const currenciesStore = useCurrenciesStore();
    const { currencies } = storeToRefs(currenciesStore);

    const currencyCode = computed(() => {
      const currency = currencies.value.find(item => item.currencyId === props.currencyId);
      return currency.code;
    });

    return {
      currencyCode,
    };
  },
});
</script>
