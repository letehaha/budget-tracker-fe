<template>
  <div class="system-tx-form">
    <div>
      <button @click="$emit(EVENTS.closeModal)">
        Close
      </button>
    </div>
    <div class="system-tx-form__row">
      <InputField
        v-model="form.amount"
        type="number"
        placeholder="Amount"
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.account"
        label="Account"
        :values="accounts"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.category"
        label="Category"
        :values="categories"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.type"
        label="Transaction Type"
        :values="transactionTypes"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <DateField
        v-model="form.time"
      />
    </div>
    <div class="system-tx-form__row">
      <SelectField
        v-model="form.paymentType"
        label="Payment Type"
        :values="paymentTypes"
        label-key="name"
        is-value-preselected
      />
    </div>
    <div class="system-tx-form__row">
      <TextareaField
        v-model="form.note"
        placeholder="Note"
        label="Note (optional)"
      />
    </div>
    <div class="system-tx-form__actions">
      <Button
        v-if="transaction"
        class="system-tx-form__action"
        @click="deleteTransactionHandler"
      >
        Delete
      </Button>
      <Button
        class="
          system-tx-form__action
          system-tx-form__action--submit
        "
        :disabled="isLoading"
        @click="submit"
      >
        {{ transaction ? 'Edit' : 'Submit' }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  usePaymentTypesStore,
  useTransactionTypesStore,
  useAccountsStore,
  useTransactionsStore,
  useCategoriesStore,
} from '@/newStore';
import { TransactionRecord } from '@/js/records';
import InputField from '@/components/fields/InputField.vue';
import SelectField from '@/components/fields/SelectField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import DateField from '@/components/fields/DateField.vue';
import Button from '@/components/common/Button.vue';

const EVENTS = {
  closeModal: 'close-modal',
};

export default defineComponent({
  components: {
    DateField,
    InputField,
    SelectField,
    TextareaField,
    Button,
  },
  props: {
    transaction: {
      type: TransactionRecord,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const store = usePaymentTypesStore();
    const transactionTypesStore = useTransactionTypesStore();
    const accountsStore = useAccountsStore();
    const categoriesStore = useCategoriesStore();
    const {
      createTransaction,
      editTransaction,
      deleteTransaction,
    } = useTransactionsStore();

    const form = ref({
      amount: null,
      account: null,
      category: null,
      time: null,
      paymentType: null,
      note: null,
      type: null,
    });
    const isLoading = ref(false);

    const { paymentTypes } = storeToRefs(store);
    const { accounts } = storeToRefs(accountsStore);
    const { transactionTypes } = storeToRefs(transactionTypesStore);
    const { categories } = storeToRefs(categoriesStore);

    watch(
      () => props.transaction,
      (value) => {
        if (value) {
          form.value = {
            amount: value.amount,
            account: accounts.value.find(i => i.id === value.accountId),
            type: transactionTypes.value
              .find(i => i.id === value.transactionTypeId),
            category: categories.value.find(i => i.id === value.categoryId),
            time: value.time,
            paymentType: paymentTypes.value
              .find(i => i.id === value.paymentTypeId),
            note: value.note,
          };
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );

    const submit = async () => {
      isLoading.value = true;

      const {
        amount,
        note,
        time,
        type: { id: transactionTypeId },
        paymentType: { id: paymentTypeId },
        account: { id: accountId },
        category: { id: categoryId },
      } = form.value;

      const params = {
        amount,
        note,
        time,
        transactionTypeId,
        paymentTypeId,
        accountId,
        categoryId,
      };

      if (props.transaction) {
        await editTransaction({
          txId: props.transaction.id,
          ...params,
        });
      } else {
        await createTransaction(params);
      }
      isLoading.value = false;
    };
    const deleteTransactionHandler = async () => {
      isLoading.value = true;

      await deleteTransaction({ txId: props.transaction.id });

      emit(EVENTS.closeModal);

      isLoading.value = false;
    };

    return {
      EVENTS,
      form,
      isLoading,
      accounts,
      categories,
      paymentTypes,
      transactionTypes,
      createTransaction,
      editTransaction,
      deleteTransaction,
      deleteTransactionHandler,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.system-tx-form {
  background-color: var(--app-bg-color);
  padding: 60px;
  width: 100%;
  max-width: 600px;
}
.system-tx-form__row {
  margin-bottom: 20px;
}
.system-tx-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.system-tx-form__action--submit {
  margin-left: auto;
}
</style>
