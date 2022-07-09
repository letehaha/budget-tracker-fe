<template>
  <div
    class="system-tx-form"
    :class="{
      'system-tx-form--income': currentTxType === FORM_TYPES.income,
      'system-tx-form--expense': currentTxType === FORM_TYPES.expense,
      'system-tx-form--transfer': currentTxType === FORM_TYPES.transfer,
    }"
  >
    <div class="system-tx-form__header">
      <form-header @close="closeModal" />

      <type-selector
        :selected-transaction-type="currentTxType"
        @change-tx-type="selectTransactionType"
      />
    </div>
    <div class="system-tx-form__form">
      <form-row>
        <InputField
          v-model="form.amount"
          label="Amount"
          type="number"
          only-positive
          placeholder="Amount"
        />
      </form-row>

      <account-field
        v-model:form-account="form.account"
        v-model:form-to-account="form.toAccount"
        :is-transfer-transaction="isTransferTx"
        :accounts="accountsArray"
        :filtered-accounts="filteredAccounts"
      />

      <template v-if="currentTxType !== FORM_TYPES.transfer">
        <form-row>
          <CategorySelectField
            v-model="form.category"
            label="Category"
            :values="categories"
            label-key="name"
          />
        </form-row>
      </template>
      <form-row>
        <DateField
          v-model="form.time"
          label="Datetime"
        />
      </form-row>
      <form-row>
        <SelectField
          v-model="form.paymentType"
          label="Payment Type"
          :values="PAYMENT_TYPES"
          label-key="name"
          is-value-preselected
        />
      </form-row>
      <form-row>
        <TextareaField
          v-model="form.note"
          placeholder="Note"
          label="Note (optional)"
        />
      </form-row>
    </div>
    <div class="system-tx-form__actions">
      <Button
        v-if="transaction"
        class="system-tx-form__action"
        :disabled="isLoading"
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
import { TRANSACTION_TYPES, PAYMENT_TYPES } from 'shared-types';
import {
  defineComponent,
  ref,
  watch,
  computed,
} from 'vue';
import { storeToRefs } from 'pinia';
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
import { eventBus, BUS_EVENTS } from '@/js/utils';
import { toSystemAmount, fromSystemAmount } from '@/js/helpers';
import InputField from '@/components/fields/InputField.vue';
import SelectField from '@/components/fields/SelectField.vue';
import CategorySelectField from '@/components/fields/CategorySelectField.vue';
import TextareaField from '@/components/fields/TextareaField.vue';
import DateField from '@/components/fields/DateField.vue';
import Button from '@/components/common/Button.vue';
import { EVENTS as MODAL_EVENTS } from '@/components/modal-center/Modal.vue';

import FormHeader from './form-header.vue';
import TypeSelector from './type-selector.vue';
import FormRow from './form-row.vue';
import AccountField from './account-field.vue';

import { FORM_TYPES } from './types';

const getFormTypeFromTransaction = (tx: TransactionRecord): FORM_TYPES => {
  if (tx.isTransfer) return FORM_TYPES.transfer;

  return tx.transactionType === TRANSACTION_TYPES.expense
    ? FORM_TYPES.expense
    : FORM_TYPES.income;
};

const getTxTypeFromFormType = (formType: FORM_TYPES): TRANSACTION_TYPES => {
  if (formType === FORM_TYPES.transfer) return TRANSACTION_TYPES.expense;

  return formType === FORM_TYPES.expense
    ? TRANSACTION_TYPES.expense
    : TRANSACTION_TYPES.income;
};

export default defineComponent({
  name: 'SystemTxForm',
  components: {
    FormHeader,
    FormRow,
    AccountField,
    TypeSelector,
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
    oppositeTransaction: {
      type: TransactionRecord,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const accountsStore = useAccountsStore();
    const categoriesStore = useCategoriesStore();

    const { accountsRecord } = storeToRefs(accountsStore);
    const { categories, rawCategories } = storeToRefs(categoriesStore);

    const isFormCreation = computed(() => !props.transaction);

    const form = ref<{
      amount: number;
      account: AccountRecord;
      toAccount?: AccountRecord;
      category: CategoryRecord;
      time: string;
      paymentType: PAYMENT_TYPES;
      note?: string;
      type: FORM_TYPES;
    }>({
      amount: null,
      account: null,
      toAccount: null,
      category: categories.value[0],
      time: new Date().toISOString().substring(0, 19),
      paymentType: PAYMENT_TYPES.creditCard,
      note: null,
      type: FORM_TYPES.expense,
    });
    const isLoading = ref(false);

    const currentTxType = computed(() => form.value.type);
    const isTransferTx = computed(
      () => currentTxType.value === FORM_TYPES.transfer,
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
            amount: Math.abs(fromSystemAmount(value.amount)),
            account: accountsRecord.value[value.accountId],
            type: getFormTypeFromTransaction(value),
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
      () => props.oppositeTransaction,
      (value) => {
        if (value) {
          form.value.toAccount = accountsRecord.value[value.accountId];
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
          type: formTxType,
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
          currencyCode: string;

          isTransfer?: boolean;
          destinationAmount?: number;
          destinationAccountId?: number;
          destinationCurrencyId?: number;
          destinationCurrencyCode?: string;
        } = {
          amount: toSystemAmount(Number(amount)),
          note,
          time: new Date(time).toISOString(),
          transactionType: getTxTypeFromFormType(formTxType),
          paymentType,
          accountId,
          // TODO: one day allow changing currency
          currencyId: 867,
          currencyCode: 'UAH',
        };

        if (isTransferTx.value) {
          params.destinationAccountId = toAccount.id;
          params.destinationAmount = toSystemAmount(Number(amount));
          params.isTransfer = true;
          params.destinationCurrencyId = 867;
          params.destinationCurrencyCode = 'UAH';
        } else {
          params.categoryId = category.id;
        }

        if (isFormCreation.value) {
          await createTransaction(params);
        } else {
          await editTransaction({
            txId: props.transaction.id,
            ...params,
          });
        }

        emit(MODAL_EVENTS.closeModal);
        eventBus.emit(BUS_EVENTS.transactionChange);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };
    const deleteTransactionHandler = async () => {
      try {
        isLoading.value = true;

        await deleteTransaction(props.transaction.id);

        emit(MODAL_EVENTS.closeModal);
        eventBus.emit(BUS_EVENTS.transactionChange);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };

    const closeModal = () => {
      emit(MODAL_EVENTS.closeModal);
    };

    const selectTransactionType = (type: FORM_TYPES, disabled = false) => {
      if (!disabled) form.value.type = type;
    };

    return {
      FORM_TYPES,
      TRANSACTION_TYPES,
      PAYMENT_TYPES,
      form,
      filteredAccounts,
      isTransferTx,
      isLoading,
      accountsArray,
      closeModal,
      categories,
      currentTxType,
      selectTransactionType,
      deleteTransactionHandler,
      submit,
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
.system-tx-form__form {
  padding: 0 24px;
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
</style>
