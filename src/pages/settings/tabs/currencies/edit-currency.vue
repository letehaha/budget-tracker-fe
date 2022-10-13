<template>
  <div class="edit-currency">
    <!-- <label class="edit-currency__default-currency">
      Make it your base currency

      <input
        v-model="form.isDefault"
        type="checkbox"
      >
    </label> -->

    <div class="edit-currency__actions">
      <!-- <ui-tooltip :content="!isFormDirty ? 'Nothing to save' : ''">
        <ui-button :disabled="!isFormDirty">
          Save
        </ui-button>
      </ui-tooltip> -->

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
  PropType,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrenciesStore } from '@/stores';
import UiButton, { BUTTON_THEMES } from '@/components/common/ui-button.vue';
import UiTooltip from '@/components/common/tooltip.vue';
import { CurrencyWithExchangeRate } from './types';

const DISABLED_DELETE_TEXT = 'You cannot delete this currency because it is still connected to account(s).';

export default defineComponent({
  components: { UiButton, UiTooltip },
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
    const store = useCurrenciesStore();
    const { currencies } = storeToRefs(store);
    const form = reactive({
      isDefault: props.currency.isDefaultCurrency,
    });

    const isFormDirty = computed(
      () => props.currency.isDefaultCurrency !== form.isDefault,
    );

    const onDeleteHandler = () => {
      emit('delete');
    };

    return {
      DISABLED_DELETE_TEXT,
      BUTTON_THEMES,
      onDeleteHandler,
      form,
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
  // margin-top: 32px;
}
</style>
