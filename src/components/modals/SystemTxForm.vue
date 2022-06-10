<template>
  <div
    class="system-tx-form"
    :class="{
      'system-tx-form--income': currentTxType === TRANSACTION_TYPES.income,
      'system-tx-form--expense': currentTxType === TRANSACTION_TYPES.expense,
      'system-tx-form--transfer': currentTxType === TRANSACTION_TYPES.transfer,
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
            'system-tx-form__type-selector-item--active': currentTxType === TRANSACTION_TYPES.expense,
          }"
          :disabled="isExpenseSwitchDisabled"
          @click="selectTransactionType(
            TRANSACTION_TYPES.expense,
            isExpenseSwitchDisabled,
          )"
        >
          Expense
        </div>
        <div
          class="system-tx-form__type-selector-item"
          :class="{
            'system-tx-form__type-selector-item--active': currentTxType === TRANSACTION_TYPES.income,
          }"
          :disabled="isIncomeSwitchDisabled"
          @click="selectTransactionType(
            TRANSACTION_TYPES.income,
            isIncomeSwitchDisabled,
          )"
        >
          Income
        </div>
        <div
          class="system-tx-form__type-selector-item"
          :class="{
            'system-tx-form__type-selector-item--active': currentTxType === TRANSACTION_TYPES.transfer,
          }"
          :disabled="isTransferSwitchDisabled"
          @click="selectTransactionType(
            TRANSACTION_TYPES.transfer,
            isTransferSwitchDisabled,
          )"
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
      <template v-if="accountsArray.length">
        <template v-if="isTransferTx">
          <div class="system-tx-form__row">
            <SelectField
              v-model="form.account"
              label="From account"
              placeholder="Select account"
              :values="accountsArray"
              label-key="name"
              is-value-preselected
              :disabled="!isFormCreation"
            />
          </div>

          <div class="system-tx-form__row">
            <SelectField
              v-model="form.toAccount"
              label="To account"
              placeholder="Select account"
              :values="filteredAccounts"
              label-key="name"
              :disabled="!isFormCreation"
            />
          </div>
        </template>
        <template v-else>
          <div class="system-tx-form__row">
            <SelectField
              v-model="form.account"
              label="Account"
              placeholder="Select account"
              :values="filteredAccounts"
              label-key="name"
              is-value-preselected
            />
          </div>
        </template>
      </template>
      <template v-else>
        <div class="system-tx-form__row">
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
        </div>
      </template>
      <template v-if="currentTxType !== TRANSACTION_TYPES.transfer">
        <div class="system-tx-form__row">
          <CategorySelectField
            v-model="form.category"
            label="Category"
            :values="categories"
            label-key="name"
          />
        </div>
      </template>
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
          :values="PAYMENT_TYPES"
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
        :disabled="currentTxType === TRANSACTION_TYPES.transfer"
        @click="deleteTransactionHandler"
      >
        Delete
      </Button>
      <Button
        class="
          system-tx-form__action
          system-tx-form__action--submit
        "
        :disabled="
          (transaction && currentTxType === TRANSACTION_TYPES.transfer)
            || isLoading
        "
        @click="submit"
      >
        {{ isLoading ? 'Loading...' : transaction ? 'Edit' : 'Submit' }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { TRANSACTION_TYPES, PAYMENT_TYPES, ACCOUNT_TYPES } from 'shared-types';
import {
  defineComponent,
  ref,
  watch,
  computed,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import {
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
  TransactionRecord,
  CategoryRecord,
} from '@/js/records';
import { toSystemAmount, fromSystemAmount } from '@/js/helpers';
import InputField from '@/components/fields/InputField.vue';
import SelectField from '@/components/fields/SelectField.vue';
import CategorySelectField from '@/components/fields/CategorySelectField.vue';
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
    CategorySelectField,
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
    const accountsStore = useAccountsStore();
    const categoriesStore = useCategoriesStore();

    const { accountsRecord } = storeToRefs(accountsStore);
    const { categories, rawCategories } = storeToRefs(categoriesStore);

    const isFormCreation = computed(() => !props.transaction);

    const form = ref<{
      amount: number;
      account: AccountRecord;
      toAccount: AccountRecord;
      category: CategoryRecord;
      time: string;
      paymentType: PAYMENT_TYPES;
      note?: string;
      type: TRANSACTION_TYPES;
    }>({
      amount: null,
      account: null,
      toAccount: null,
      category: categories.value[0],
      time: null,
      paymentType: PAYMENT_TYPES.creditCard,
      note: null,
      type: TRANSACTION_TYPES.expense,
    });
    const isLoading = ref(false);

    const currentTxType = computed(() => form.value.type);
    const isTransferTx = computed(
      () => currentTxType.value === TRANSACTION_TYPES.transfer,
    );
    const isExpenseTx = computed(
      () => currentTxType.value === TRANSACTION_TYPES.expense,
    );

    const accountsArray = computed(() => Object.values(accountsRecord.value));
    const filteredAccounts = computed(
      () => accountsArray.value.filter(
        (item) => item.id !== form.value.account?.id,
      ),
    );

    watch(
      () => props.transaction,
      (value) => {
        if (value) {
          form.value = {
            amount: fromSystemAmount(value.amount),
            account: accountsRecord.value[value.accountId],
            toAccount: accountsRecord.value[value.toAccountId],
            type: value.transactionType,
            category: rawCategories.value.find(i => i.id === value.categoryId),
            time: new Date(value.time).toISOString().substring(0, 19),
            paymentType: value.paymentType,
            note: value.note,
          };
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );

    watch(
      () => form.value.account,
      (value) => {
        // If fromAccount is the same as toAccount, make toAccount empty
        if (form.value.toAccount?.id === value?.id) {
          form.value.toAccount = null;
        }
      },
    );

    watch(isTransferTx, (value) => {
      form.value.category = value ? null : categories.value[0];
    });

    const submit = async () => {
      isLoading.value = true;

      try {
        const {
          amount,
          note,
          time,
          type: transactionType,
          paymentType,
          account: { id: accountId },
          toAccount,
          category,
        } = form.value;

        const params: {
          amount: number;
          note?: string;
          time: string;
          transactionType: TRANSACTION_TYPES;
          paymentType: PAYMENT_TYPES;
          accountId: number;
          categoryId?: number;
          currencyId: number;

          fromAccountId?: number;
          fromAccountType?: ACCOUNT_TYPES;
          toAccountId?: number;
          toAccountType?: ACCOUNT_TYPES;
        } = {
          amount: toSystemAmount(Number(amount)),
          note,
          time: new Date(time).toISOString(),
          transactionType,
          paymentType,
          accountId,
          currencyId: 1,
        };

        if (isFormCreation.value) {
          if (isTransferTx.value) {
            params.fromAccountId = accountId;
            params.fromAccountType = ACCOUNT_TYPES.system;
            params.toAccountId = toAccount.id;
            params.toAccountType = ACCOUNT_TYPES.system;
          } else {
            params.categoryId = category.id;
          }

          if (isExpenseTx.value) {
            params.amount *= -1;
          }

          await createTransaction(params);
        } else {
          await editTransaction({
            txId: props.transaction.id,
            ...params,
          });
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

    const selectTransactionType = (
      type: TRANSACTION_TYPES,
      disabled = false,
    ) => {
      if (!disabled) {
        form.value.type = type;
      }
    };

    const isExpenseSwitchDisabled = computed(() => (
      !isFormCreation.value
      && props.transaction.transactionType === TRANSACTION_TYPES.transfer
    ));
    const isIncomeSwitchDisabled = computed(() => (
      !isFormCreation.value
      && props.transaction.transactionType === TRANSACTION_TYPES.transfer
    ));
    const isTransferSwitchDisabled = computed(() => (
      !isFormCreation.value
      && [TRANSACTION_TYPES.income, TRANSACTION_TYPES.expense]
        .includes(props.transaction.transactionType)
    ));

    return {
      TRANSACTION_TYPES,
      PAYMENT_TYPES,
      EVENTS,
      form,
      isFormCreation,
      filteredAccounts,
      isExpenseSwitchDisabled,
      isIncomeSwitchDisabled,
      isTransferSwitchDisabled,
      isTransferTx,
      isLoading,
      accountsArray,
      closeModal,
      categories,
      currentTxType,
      selectTransactionType,
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

  &[disabled="true"] {
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
