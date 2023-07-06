<template>
  <div class="edit-currency">
    <div class="edit-currency__row edit-currency__ratio">
      <input-field
        v-model="form.baseRate"
        :label="`1 ${currency.code} =`"
        @focus="onBaseFocus"
      />
      <input-field
        v-model="form.quoteRate"
        :label="`1 ${currency.quoteCode} =`"
        @focus="onQuoteFocus"
      />
    </div>
    <div class="edit-currency__actions">
      <ui-tooltip :content="!isFormDirty ? 'Nothing to save' : ''">
        <ui-button
          :disabled="!isFormDirty"
          @click="onSaveHandler"
        >
          Save
        </ui-button>
      </ui-tooltip>

      <ui-tooltip :content="deletionDisabled ? DISABLED_DELETE_TEXT : ''">
        <ui-button
          :theme="BUTTON_THEMES.danger"
          :disabled="deletionDisabled"
          @click="onDeleteHandler"
        >
          Delete
        </ui-button>
      </ui-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  ref,
  watch,
  PropType,
} from 'vue';
import { API_ERROR_CODES } from 'shared-types';
import { storeToRefs } from 'pinia';
import { useCurrenciesStore } from '@/stores';
import { editUserCurrenciesExchangeRates } from '@/api/currencies';
import UiButton, { BUTTON_THEMES } from '@/components/common/ui-button.vue';
import InputField from '@/components/fields/input-field.vue';
import UiTooltip from '@/components/common/tooltip.vue';
import { useNotificationCenter } from '@/components/notification-center';
import { CurrencyWithExchangeRate } from './types';

const DISABLED_DELETE_TEXT = 'You cannot delete this currency because it is still connected to account(s).';
const calculateRatio = (value) => {
  const exp = 10 ** 6;
  const num = 1 / value;
  const result = Math.round(num * exp) / exp;

  return Number.isFinite(result) ? result : 0;
};

export default defineComponent({
  components: { UiButton, UiTooltip, InputField },
  props: {
    currency: {
      type: Object as PropType<CurrencyWithExchangeRate>,
      required: true,
    },
    deletionDisabled: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['submit', 'delete'],
  setup(props, { emit }) {
    const currenciesStore = useCurrenciesStore();
    const {
      addSuccessNotification,
      addErrorNotification,
    } = useNotificationCenter();
    const { currencies } = storeToRefs(currenciesStore);
    const form = reactive({
      baseRate: props.currency.rate,
      quoteRate: props.currency.quoteRate,
    });
    const isBaseEditing = ref(false);
    const isQuoteEditing = ref(false);

    const isRateChanged = computed(() => (
      +props.currency.rate !== +form.baseRate
      || +props.currency.quoteRate !== +form.quoteRate
    ));

    const isFormDirty = computed(() => isRateChanged.value);

    const onBaseFocus = () => {
      isBaseEditing.value = true;
      isQuoteEditing.value = false;
    };
    const onQuoteFocus = () => {
      isQuoteEditing.value = true;
      isBaseEditing.value = false;
    };

    watch(
      () => form.baseRate,
      (value) => {
        if (isBaseEditing.value) {
          form.quoteRate = calculateRatio(value);
        }
      },
    );
    watch(
      () => form.quoteRate,
      (value) => {
        if (isQuoteEditing.value) {
          form.baseRate = calculateRatio(value);
        }
      },
    );

    const onDeleteHandler = () => {
      emit('delete');
    };

    const updateExchangeRates = async () => {
      try {
        await editUserCurrenciesExchangeRates([
          {
            baseCode: props.currency.code,
            quoteCode: props.currency.quoteCode,
            rate: Number(form.baseRate),
          },
          {
            baseCode: props.currency.quoteCode,
            quoteCode: props.currency.code,
            rate: Number(form.quoteRate),
          },
        ]);
        await currenciesStore.loadCurrencies();

        emit('submit');

        addSuccessNotification('Successfully updated.');
      } catch (e) {
        if (e.data.code === API_ERROR_CODES.validationError) {
          addErrorNotification(e.data.message);
          return;
        }
        addErrorNotification('Unexpected error. Currency is not updated.');
      }
    };

    const onSaveHandler = async () => {
      if (isRateChanged.value) {
        await updateExchangeRates();
      }
    };

    return {
      DISABLED_DELETE_TEXT,
      BUTTON_THEMES,
      onSaveHandler,
      onDeleteHandler,
      form,
      onBaseFocus,
      onQuoteFocus,
      isFormDirty,
      currencies,
    };
  },
});
</script>

<style lang="scss" scoped>
.edit-currency {
  padding: var(--settings-currency-list-item-padding);
  border-top: 1px solid #ccc;
}
.edit-currency__default-currency {
  cursor: pointer;
}
.edit-currency__actions {
  display: flex;
  grid-template-columns: min-content min-content;
  gap: 32px;
  margin-top: 32px;
}
.edit-currency__ratio {
  max-width: 360px;
  display: flex;
  gap: 16px;
}
</style>
