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
        <input-field
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
          <category-select-field
            v-model="form.category"
            label="Category"
            :values="categories"
            label-key="name"
          />
        </form-row>
      </template>

      <template v-if="isCurrenciesDifferent">
        <form-row>
          <input-field
            v-model="form.targetAmount"
            :label="`Target amount (${targetCurrency.code})`"
            type="number"
          />
        </form-row>
      </template>

      <!-- <currency-field
        v-model:form-currency="form.currency"
        v-model:form-target-amount="form.targetAmount"
        :currencies="currencies"
        :is-form-creation="isFormCreation"
        :is-transfer-transaction="isTransferTx"
        :form-account="form.account"
        :form-to-account="form.toAccount"
      /> -->

      <form-row>
        <date-field
          v-model="form.time"
          label="Datetime"
        />
      </form-row>
      <form-row>
        <select-field
          v-model="form.paymentType"
          label="Payment Type"
          :values="PAYMENT_TYPES"
          label-key="name"
          is-value-preselected
        />
      </form-row>
      <form-row>
        <textarea-field
          v-model="form.note"
          placeholder="Note"
          label="Note (optional)"
        />
      </form-row>
    </div>
    <div class="system-tx-form__actions">
      <ui-button
        v-if="transaction"
        class="system-tx-form__action"
        :disabled="isLoading"
        @click="deleteTransactionHandler"
      >
        Delete
      </ui-button>
      <ui-button
        class="
          system-tx-form__action
          system-tx-form__action--submit
        "
        :disabled="isLoading"
        @click="submit"
      >
        {{ isLoading ? 'Loading...' : transaction ? 'Edit' : 'Submit' }}
      </ui-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  CategoryModel,
  AccountModel,
  TRANSACTION_TYPES,
  PAYMENT_TYPES,
} from 'shared-types';
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
  useCurrenciesStore,
} from '@/stores';

import {
  createTransaction,
  editTransaction,
  deleteTransaction,
} from '@/api/transactions';

import {
  TransactionRecord,
  // UserCurrencyRecord,
} from '@/js/records';
import { eventBus, BUS_EVENTS } from '@/js/utils';
import { toSystemAmount, fromSystemAmount } from '@/js/helpers';
import InputField from '@/components/fields/input-field.vue';
import SelectField from '@/components/fields/select-field.vue';
import CategorySelectField from '@/components/fields/category-select-field.vue';
import TextareaField from '@/components/fields/textarea-field.vue';
import DateField from '@/components/fields/date-field.vue';
import UiButton from '@/components/common/ui-button.vue';
import { EVENTS as MODAL_EVENTS } from '@/components/modal-center/ui-modal.vue';

import FormHeader from './form-header.vue';
import TypeSelector from './type-selector.vue';
import FormRow from './form-row.vue';
import AccountField from './account-field.vue';
// import CurrencyField from './currency-field.vue';

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
  name: 'system-tx-form',
  components: {
    FormHeader,
    FormRow,
    AccountField,
    // CurrencyField,
    TypeSelector,
    DateField,
    InputField,
    SelectField,
    CategorySelectField,
    TextareaField,
    UiButton,
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
    const currenciesStore = useCurrenciesStore();
    const { getCurrency } = useCurrenciesStore();

    const { accountsRecord } = storeToRefs(accountsStore);
    const { currencies } = storeToRefs(currenciesStore);
    const { categories, rawCategories } = storeToRefs(categoriesStore);

    const isFormCreation = computed(() => !props.transaction);

    const form = ref<{
      amount: number;
      account: AccountModel;
      toAccount?: AccountModel;
      category: CategoryModel;
      time: string;
      paymentType: PAYMENT_TYPES;
      note?: string;
      type: FORM_TYPES;
      targetAmount?: number;
    }>({
      amount: null,
      account: null,
      toAccount: null,
      targetAmount: null,
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
    const isCurrenciesDifferent = computed(() => {
      if (!form.value.account || !form.value.toAccount) {
        return false;
      }

      return form.value.account.currencyId !== form.value.toAccount.currencyId;
    });
    const targetCurrency = computed(() => {
      if (form.value.toAccount?.currencyId) {
        return getCurrency(form.value.toAccount.currencyId);
      }
      return undefined;
    });

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
          form.value.targetAmount = fromSystemAmount(value.amount);
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
        };

        if (isTransferTx.value) {
          params.destinationAccountId = toAccount.id;
          params.destinationAmount = isCurrenciesDifferent.value
            ? toSystemAmount(Number(form.value.targetAmount))
            : toSystemAmount(Number(amount));
          params.isTransfer = true;
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
      currencies,
      isCurrenciesDifferent,
      targetCurrency,
      isFormCreation,
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
