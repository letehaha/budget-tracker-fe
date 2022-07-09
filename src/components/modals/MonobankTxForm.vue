<template>
  <div class="monobank-tx-form">
    <div>
      <button @click="$emit(MODAL_EVENTS.closeModal)">
        Close
      </button>
    </div>
    <div class="monobank-tx-form__row">
      <p>Amount: {{ transaction.formattedAmount }}</p>
      <p>Type: {{ transaction.transactionType }}</p>
      <p>Time: {{ transaction.time }}</p>
      <p>Payment Type: {{ transaction.paymentType }}</p>
      <p>Cashback: {{ +transaction.formattedCashback ? transaction.formattedCashback : '-' }}</p>
      <p>Description: {{ transaction.description }}</p>
      <p>
        Currency: {{ currentCurrency.currency }} ({{ currentCurrency.code }})
      </p>
    </div>
    <div class="monobank-tx-form__row">
      <CategorySelectField
        v-model="form.category"
        label="Category"
        :values="categories"
        label-key="name"
      />
    </div>
    <div class="monobank-tx-form__row">
      <TextareaField
        v-model="form.note"
        label="Note"
      />
    </div>
    <div class="monobank-tx-form__actions">
      <Button
        class="
          monobank-tx-form__action
          monobank-tx-form__action--submit
        "
        :disabled="isLoading"
        @click="submit"
      >
        Save changes
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, reactive, computed,
} from 'vue';
import { storeToRefs } from 'pinia';

import {
  useAccountsStore,
  useCurrenciesStore,
  useCategoriesStore,
  useBanksMonobankStore,
} from '@/stores';

import { MONOTransactionRecord } from '@/js/records';
import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

import CategorySelectField from '@/components/fields/CategorySelectField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import Button from '@/components/common/Button.vue';
import { EVENTS as MODAL_EVENTS } from '@/components/modal-center/Modal.vue';

export default defineComponent({
  name: 'MonobankTxForm',
  components: {
    CategorySelectField,
    TextareaField,
    Button,
  },
  props: {
    transaction: {
      type: MONOTransactionRecord,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const accountsStore = useAccountsStore();
    const categoriesStore = useCategoriesStore();
    const monobankStore = useBanksMonobankStore();
    const { getCurrency } = useCurrenciesStore();
    const { addNotification } = useNotificationCenter();

    const { accounts } = storeToRefs(accountsStore);
    const { rawCategories, categories } = storeToRefs(categoriesStore);

    const currentCurrency = computed(
      () => getCurrency(props.transaction.currencyId),
    );

    const form = reactive({
      category: rawCategories.value
        .find(item => item.id === props.transaction.categoryId),
      note: props.transaction.note,
    });
    const isLoading = ref(false);

    const submit = async () => {
      isLoading.value = true;
      try {
        const { note, category } = form;

        const params = {
          note,
          categoryId: category.id,
        };

        await monobankStore.updateTransactionById({
          id: props.transaction.id,
          ...params,
        });

        addNotification({
          text: 'Updated successfully',
          type: NotificationType.success,
        });
        emit(MODAL_EVENTS.closeModal);
      } catch (e) {
        addNotification({
          text: 'Unexpected error occured',
          type: NotificationType.error,
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      MODAL_EVENTS,
      form,
      isLoading,
      categories,
      accounts,
      submit,
      currentCurrency,
    };
  },
});
</script>

<style lang="scss" scoped>
.monobank-tx-form {
  background-color: var(--app-bg-color);
  padding: 60px;
  width: 100%;
  max-width: 600px;
}
.monobank-tx-form__row {
  margin-bottom: 20px;
  color: var(--app-on-bg-color);
}
.monobank-tx-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.monobank-tx-form__action--submit {
  margin-left: auto;
}
</style>
