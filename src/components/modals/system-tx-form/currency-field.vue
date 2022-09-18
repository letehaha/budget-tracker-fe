<template>
  <form-row>
    <select-field
      label="Currency"
      :values="currencies"
      label-key="code"
      is-value-preselected
      :model-value="formCurrency"
      @update:model-value="emit('update:form-currency', $event)"
    />
  </form-row>

  <template v-if="showTargetAmountField">
    <form-row>
      <input-field
        :label="`Target amount (${targetCurrency.code})`"
        type="number"
        :model-value="formTargetAmount"
        @update:model-value="emit('update:form-target-amount', Number($event))"
      />
    </form-row>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

import { useCurrenciesStore } from '@/stores';
import { UserCurrencyRecord, AccountRecord } from '@/js/records';
import SelectField from '@/components/fields/select-field.vue';
import InputField from '@/components/fields/input-field.vue';

import FormRow from './form-row.vue';

export default defineComponent({
  components: {
    'input-field': InputField,
    'select-field': SelectField,
    'form-row': FormRow,
  },
  props: {
    formCurrency: {
      type: Object as PropType<UserCurrencyRecord>,
      default: null,
    },
    formTargetAmount: {
      type: Number,
      default: null,
    },
    isFormCreation: {
      type: Boolean,
      required: true,
    },
    isTransferTransaction: {
      type: Boolean,
      required: true,
    },
    currencies: {
      type: Array as PropType<UserCurrencyRecord[]>,
      required: true,
    },
    formAccount: {
      type: Object as PropType<AccountRecord>,
      default: null,
    },
    formToAccount: {
      type: Object as PropType<AccountRecord>,
      default: null,
    },
  },
  emits: {
    'update:form-currency': function (account: UserCurrencyRecord) {
      return account instanceof UserCurrencyRecord;
    },
    'update:form-target-amount': function (value: number) {
      return typeof value === 'number';
    },
  },
  setup(props, { emit }) {
    const { getCurrency } = useCurrenciesStore();

    const isCurrenciesDifferent = computed(() => {
      if (props.formAccount === null || props.formToAccount === null) {
        return false;
      }

      return props.formAccount.currencyId !== props.formToAccount.currencyId;
    });

    const targetCurrency = computed(() => {
      if (props.formToAccount?.currencyId) {
        return getCurrency(props.formToAccount.currencyId);
      }
      return undefined;
    });

    const showTargetAmountField = computed(() => (
      props.isTransferTransaction
      && isCurrenciesDifferent.value
      && targetCurrency.value
    ));

    return {
      emit,
      targetCurrency,
      showTargetAmountField,
      isCurrenciesDifferent,
    };
  },
});
</script>
