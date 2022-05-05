<template>
  <div
    class="system-tx-form"
    :class="{
      'system-tx-form--income': currentTxType.type === TRANSACTIONS_TYPES.income,
      'system-tx-form--expense': currentTxType.type === TRANSACTIONS_TYPES.expense,
      'system-tx-form--transfer': currentTxType.type === TRANSACTIONS_TYPES.transfer,
    }"
  >
    <div class="system-tx-form__header">
      <div class="system-tx-form__header-info">
        <div />
        <div class="system-tx-form__header-title">
          Add Record
        </div>
        <button
          class="system-tx-form__header-action"
          type="button"
          @click="closeModal"
        >
          Cancel
        </button>
      </div>
      <div class="system-tx-form__type-selector">
        <div
          class="system-tx-form__type-selector-item"
          :class="{
            'system-tx-form__type-selector-item--active': currentTxType.type === TRANSACTIONS_TYPES.expense,
          }"
          @click="selectTransactionType(TRANSACTIONS_TYPES.expense)"
        >
          Expense
        </div>
        <div
          class="system-tx-form__type-selector-item"
          :class="{
            'system-tx-form__type-selector-item--active': currentTxType.type === TRANSACTIONS_TYPES.income,
          }"
          @click="selectTransactionType(TRANSACTIONS_TYPES.income)"
        >
          Income
        </div>
        <div
          class="system-tx-form__type-selector-item"
          :class="{
            'system-tx-form__type-selector-item--active': currentTxType.type === TRANSACTIONS_TYPES.transfer,
          }"
          disabled
        >
          Transfer
        </div>
      </div>
    </div>
    <div class="system-tx-form__form">
      <div class="system-tx-form__row">
        <InputField
          v-model="form.amount"
          label="Amount"
          type="number"
          only-positive
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
        <DateField
          v-model="form.time"
          label="Datetime"
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
        {{ isLoading ? 'Loading...' : transaction ? 'Edit' : 'Submit' }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { TRANSACTIONS_TYPES } from 'shared-types';
import {
  defineComponent,
  ref,
  watch,
  computed,
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

import {
  AccountRecord,
  TransactionTypeRecord,
  TransactionRecord,
  CategoryRecord,
  PaymentTypeRecord,
} from '@/js/records';
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

    const form = ref<{
      amount: number;
      account: AccountRecord;
      category: CategoryRecord;
      time: string;
      paymentType: PaymentTypeRecord;
      note?: string;
      type: TransactionTypeRecord;
    }>({
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

    const currentTxType = computed(
      () => transactionTypes.value.find(
        item => item.type === form.value.type.type,
      ),
    );

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
            time: new Date(value.time).toISOString().substring(0, 19),
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
          time: new Date(time).toISOString(),
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

        emit(EVENTS.closeModal);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
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

    const closeModal = () => {
      emit(EVENTS.closeModal);
    };

    const selectTransactionType = (type: TRANSACTIONS_TYPES) => {
      form.value.type = transactionTypes.value.find(item => item.type === type);
    };

    return {
      TRANSACTIONS_TYPES,
      EVENTS,
      form,
      isLoading,
      accounts,
      closeModal,
      categories,
      paymentTypes,
      currentTxType,
      selectTransactionType,
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
$border-top-radius: 10px;
.system-tx-form {
  background-color: var(--app-bg-color);
  width: 100%;
  max-width: 600px;
  border-top-right-radius: $border-top-radius;
  border-top-left-radius: $border-top-radius;
}
.system-tx-form__header {
  padding: 24px;
  margin-bottom: 24px;

  border-top-right-radius: $border-top-radius;
  border-top-left-radius: $border-top-radius;

  transition: .2s ease-out;

  .system-tx-form--income & {
    background-color: var(--app-income-color);
  }
  .system-tx-form--expense & {
    background-color: var(--app-expense-color);
  }
  .system-tx-form--transfer & {
    background-color: var(--app-transfer-color);
  }
}
.system-tx-form__header-info {
  display: grid;
  align-items: center;
  grid-template-columns: 60px 1fr min-content;
  grid-gap: 8px;
}
.system-tx-form__type-selector {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  background-color: rgba(#000, .4);
  border-radius: 10px;
  margin-top: 24px;
}
.system-tx-form__type-selector-item {
  padding: 6px;

  font-size: 16px;
  text-align: center;
  cursor: pointer;

  transition: .1s ease-out;
  color: #fff;

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.system-tx-form__type-selector-item--active {
  background-color: #fff;
  border-radius: 10px;
  color: #000;
}
.system-tx-form__header-title {
  font-size: 19px;
  color: #fff;
  text-align: center;
}
.system-tx-form__header-action {
  @include button-style-reset();

  color: #fff;

  font-size: 16px;

  padding: 4px 8px;
  border-radius: 5px;
  transition: background-color .1s ease-out;

  &:hover {
    background-color: rgba(#fff, 0.3);
  }
}
.system-tx-form__form {
  padding: 0 24px;
}
.system-tx-form__row {
  margin-bottom: 20px;
}
.system-tx-form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 24px;
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
