<template>
  <div class="edit-currency">
    <label class="edit-currency__default-currency">
      Make it your base currency

      <input
        v-model="form.isDefault"
        type="checkbox"
      >
    </label>

    <div class="edit-currency__actions">
      <ui-button :disabled="!isFormDirty">
        Save
      </ui-button>

      <ui-button
        :theme="BUTTON_THEMES.danger"
        @click="onDeleteHandler"
      >
        Delete
      </ui-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrenciesStore } from '@/stores';
import { UserCurrencyRecord } from '@/js/records';
import UiButton, { BUTTON_THEMES } from '@/components/common/ui-button.vue';

export default defineComponent({
  components: { UiButton },
  props: {
    currency: {
      type: UserCurrencyRecord,
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
  margin-top: 32px;
}
</style>
