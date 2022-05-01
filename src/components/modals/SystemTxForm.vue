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
      <template v-if="accounts.length">
        <SelectField
          v-model="form.account"
          label="Account"
          :values="accounts"
          label-key="name"
          is-value-preselected
        />
      </template>
      <template v-else>
        <InputField
          model-value="No account exists"
          label="Account"
          readonly
        >
          <template #label-right>
            <div
              class="system-tx-form__create-account"
              @click="redirectToCreateAccountPage"
            >
              Create account
            </div>
          </template>
        </InputField>
      </template>
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
import { useRouter } from 'vue-router';
import {
  usePaymentTypesStore,
  useTransactionTypesStore,
  useAccountsStore,
  useCategoriesStore,
} from '@/stores';

import {
  createTransaction,
  editTransaction,
  deleteTransaction,
} from '@/api/transactions';

import { TransactionRecord } from '@/js/records';
import { toSystemAmount, fromSystemAmount } from '@/js/helpers';
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
    const router = useRouter();
    const store = usePaymentTypesStore();
    const transactionTypesStore = useTransactionTypesStore();
    const accountsStore = useAccountsStore();
    const categoriesStore = useCategoriesStore();

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
            amount: fromSystemAmount(value.amount),
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

      try {
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
          amount: toSystemAmount(Number(amount)),
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
      } catch (e) {
        isLoading.value = false;
      }
    };
    const deleteTransactionHandler = async () => {
      isLoading.value = true;

      await deleteTransaction(props.transaction.id);

      emit(EVENTS.closeModal);

      isLoading.value = false;
    };

    const redirectToCreateAccountPage = async () => {
      await router.push({ name: 'create-account' });

      emit(EVENTS.closeModal);
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
      redirectToCreateAccountPage,
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
.system-tx-form__create-account {
  color: var(--primary-500);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
