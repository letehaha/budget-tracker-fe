<template>
  <div
    class="modify-record"
    :class="{
      'modify-record--income': currentTxType === FORM_TYPES.income,
      'modify-record--expense': currentTxType === FORM_TYPES.expense,
      'modify-record--transfer': currentTxType === FORM_TYPES.transfer,
    }"
  >
    <div class="modify-record__header">
      <form-header
        :is-form-creation="isFormCreation"
        @close="closeModal"
      />

      <type-selector
        :is-form-creation="isFormCreation"
        :selected-transaction-type="currentTxType"
        :transaction="transaction"
        @change-tx-type="selectTransactionType"
      />
    </div>
    <div class="modify-record__form">
      <form-row>
        <input-field
          v-model="form.amount"
          label="Amount"
          type="number"
          :disabled="isAmountFieldDisabled"
          only-positive
          placeholder="Amount"
        >
          <template #iconTrailing>
            <span>{{ currencyCode }}</span>
          </template>
        </input-field>
      </form-row>

      <account-field
        v-model:form-account="form.account"
        v-model:form-to-account="form.toAccount"
        :is-transfer-transaction="isTransferTx"
        :accounts="systemAccounts"
        :from-account-disabled="fromAccountFieldDisabled"
        :to-account-disabled="toAccountFieldDisabled"
        :filtered-accounts="filteredAccounts"
        @close-modal="emit(MODAL_EVENTS.closeModal)"
      />

      <template v-if="currentTxType !== FORM_TYPES.transfer">
        <form-row>
          <category-select-field
            v-model="form.category"
            label="Category"
            :values="formattedCategories"
            label-key="name"
          />
        </form-row>
      </template>

      <template v-if="isTransferTx">
        <form-row>
          <input-field
            v-model="form.targetAmount"
            :disabled="isTargetAmountFieldDisabled"
            only-positive
            label="Target amount"
            type="number"
          >
            <template #iconTrailing>
              <span>{{ targetCurrency?.currency?.code }}</span>
            </template>
          </input-field>
        </form-row>
      </template>

      <template v-if="isTransferTx">
        <form-row>
          <ui-button
            class="modify-record__action modify-record__action-link"
            :disabled="isLoading"
            @click="openTransactionModalList"
          >
            Link existing transaction
          </ui-button>
        </form-row>
      </template>

      <form-row>
        <date-field
          v-model="form.time"
          :disabled="isRecordExternal"
          label="Datetime"
        />
      </form-row>
      <form-row>
        <select-field
          v-model="form.paymentType"
          label="Payment Type"
          :disabled="isRecordExternal"
          :values="VERBOSE_PAYMENT_TYPES"
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
    <div class="modify-record__actions">
      <ui-button
        v-if="transaction && transaction.accountType === ACCOUNT_TYPES.system"
        class="modify-record__action"
        :disabled="isLoading"
        @click="deleteTransactionHandler"
      >
        Delete
      </ui-button>
      <ui-button
        class="
          modify-record__action
          modify-record__action--submit
        "
        :disabled="isLoading"
        @click="submit"
      >
        {{ isLoading ? 'Loading...' : transaction ? 'Edit' : 'Submit' }}
      </ui-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  nextTick,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useQueryClient, useInfiniteQuery } from '@tanstack/vue-query';
import {
  type AccountModel,
  TRANSACTION_TYPES,
  PAYMENT_TYPES,
  type TransactionModel,
  ACCOUNT_TYPES,
  type CategoryModel,
} from 'shared-types';
import {
  useAccountsStore,
  useCategoriesStore,
  useCurrenciesStore,
} from '@/stores';

import {
  createTransaction,
  editTransaction,
  deleteTransaction,
  loadTransactions,
} from '@/api/transactions';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';
import InputField from '@/components/fields/input-field.vue';
import SelectField from '@/components/fields/select-field.vue';
import CategorySelectField from '@/components/fields/category-select-field.vue';
import TextareaField from '@/components/fields/textarea-field.vue';
import DateField from '@/components/fields/date-field.vue';
import UiButton from '@/components/common/ui-button.vue';
import { EVENTS as MODAL_EVENTS } from '@/components/modal-center/ui-modal.vue';
import { VUE_QUERY_TX_CHANGE_QUERY, VUE_QUERY_CACHE_KEYS } from '@/common/const';
import FormHeader from './form-header.vue';
import TypeSelector from './type-selector.vue';
import FormRow from './form-row.vue';
import AccountField from './account-field.vue';
import { FORM_TYPES } from './types';
import { getDestinationAccountId, getDestinationAmount } from './helpers';

const getFormTypeFromTransaction = (tx: TransactionModel): FORM_TYPES => {
  if (tx.isTransfer) return FORM_TYPES.transfer;

  return tx.transactionType === TRANSACTION_TYPES.expense
    ? FORM_TYPES.expense
    : FORM_TYPES.income;
};

const { addModal } = useModalCenter();

const getTxTypeFromFormType = (formType: FORM_TYPES): TRANSACTION_TYPES => {
  if (formType === FORM_TYPES.transfer) return TRANSACTION_TYPES.expense;

  return formType === FORM_TYPES.expense
    ? TRANSACTION_TYPES.expense
    : TRANSACTION_TYPES.income;
};

type VerbosePaymentType = {
  value: PAYMENT_TYPES;
  label: string;
}
const VERBOSE_PAYMENT_TYPES: VerbosePaymentType[] = [
  { value: PAYMENT_TYPES.creditCard, label: 'Credit Card' },
  { value: PAYMENT_TYPES.bankTransfer, label: 'Bank Transfer' },
  { value: PAYMENT_TYPES.cash, label: 'Cash' },
  { value: PAYMENT_TYPES.debitCard, label: 'Debit Card' },
  { value: PAYMENT_TYPES.mobilePayment, label: 'Mobile Payment' },
  { value: PAYMENT_TYPES.voucher, label: 'Voucher' },
  { value: PAYMENT_TYPES.webPayment, label: 'Web Payment' },
];

defineOptions({
  name: 'record-form',
});

const props = withDefaults(defineProps<{
  transaction?: TransactionModel;
  oppositeTransaction?: TransactionModel;
}>(), {
  transaction: undefined,
  oppositeTransaction: undefined,
});

// const limit = 10;

// const fetchTransactions = ({ pageParam = 0 }) => {
//   const from = pageParam * limit;
//   return loadTransactions({ limit, from });
// };

// const {
//   data: transactionsPages,
//   // fetchNextPage,
//   // hasNextPage,
//   // isFetched,
// } = useInfiniteQuery({
//   queryKey: VUE_QUERY_CACHE_KEYS.recordsPageRecordsList,
//   queryFn: fetchTransactions,
//   getNextPageParam: (lastPage, pages) => {
//     // No more pages to load
//     if (lastPage.length < limit) return undefined;
//     // returns the number of pages fetched so far as the next page param
//     return pages.length;
//   },
//   staleTime: Infinity,
// });

const openTransactionModalList = () => {
  const modalOptions = {
    oppositeTransaction: undefined,
    transactionType: props.transaction.transactionType,
  };

  addModal({
    type: MODAL_TYPES.recordList,
    data: modalOptions,
  });
};

const emit = defineEmits([MODAL_EVENTS.closeModal]);

const { currenciesMap } = storeToRefs(useCurrenciesStore());
const { accountsRecord, systemAccounts } = storeToRefs(useAccountsStore());
const { formattedCategories, categoriesMap } = storeToRefs(useCategoriesStore());
const queryClient = useQueryClient();

const isFormCreation = computed(() => !props.transaction);

const form = ref<{
  amount: number;
  account: AccountModel;
  toAccount?: AccountModel;
  category: CategoryModel;
  time: string;
  paymentType: VerbosePaymentType;
  note?: string;
  type: FORM_TYPES;
  targetAmount?: number;
}>({
  amount: null,
  account: null,
  toAccount: null,
  targetAmount: null,
  category: formattedCategories.value[0],
  time: new Date().toISOString().substring(0, 19),
  paymentType: VERBOSE_PAYMENT_TYPES.find(item => item.value === PAYMENT_TYPES.creditCard),
  note: null,
  type: FORM_TYPES.expense,
});

const isRecordExternal = computed(() => {
  if (!props.transaction) return false;
  return props.transaction.accountType !== ACCOUNT_TYPES.system;
});
// If record is external, the account field will be disabled, so we need to preselect
// the account
watch(() => isRecordExternal.value, (value) => {
  if (value) {
    nextTick(() => {
      if (accountsRecord.value[props.transaction.accountId]) {
        form.value.account = accountsRecord.value[props.transaction.accountId];
      }
    });
  }
}, { immediate: true });

const isLoading = ref(false);

const currentTxType = computed(() => form.value.type);
const isTransferTx = computed(() => currentTxType.value === FORM_TYPES.transfer);

const isAmountFieldDisabled = computed(() => {
  if (isRecordExternal.value) {
    if (!isTransferTx.value) return true;
    if (props.transaction.transactionType === TRANSACTION_TYPES.expense) return true;
  }

  return false;
});
const isTargetAmountFieldDisabled = computed(() => {
  if (isRecordExternal.value) {
    if (!isTransferTx.value) return true;
    if (props.transaction.transactionType === TRANSACTION_TYPES.income) return true;
  }

  return false;
});
const fromAccountFieldDisabled = computed(() => {
  if (isRecordExternal.value) {
    if (!isTransferTx.value) return true;
    if (props.transaction.transactionType === TRANSACTION_TYPES.expense) return true;
  }

  return false;
});
const toAccountFieldDisabled = computed(() => {
  if (isRecordExternal.value) {
    if (!isTransferTx.value) return true;
    if (props.transaction.transactionType === TRANSACTION_TYPES.income) return true;
  }

  return false;
});

const isCurrenciesDifferent = computed(() => {
  if (!form.value.account || !form.value.toAccount) return false;

  return form.value.account.currencyId !== form.value.toAccount.currencyId;
});

const currencyCode = computed(() => {
  if (form.value.account?.currencyId) {
    return currenciesMap.value[form.value.account.currencyId].currency.code;
  }
  return undefined;
});

const targetCurrency = computed(
  () => currenciesMap.value[form.value.toAccount?.currencyId],
);

const filteredAccounts = computed(() => systemAccounts.value.filter(
  (item) => item.id !== form.value.account?.id,
));

watch(() => props.transaction, (value) => {
  if (value) {
    form.value = {
      amount: value.amount,
      account: accountsRecord.value[value.accountId],
      type: getFormTypeFromTransaction(value),
      category: categoriesMap.value[value.categoryId],
      time: new Date(value.time).toISOString().substring(0, 19),
      paymentType: VERBOSE_PAYMENT_TYPES.find(item => item.value === value.paymentType),
      note: value.note,
    };
  }
}, { immediate: true, deep: true });

watch(() => props.oppositeTransaction, (value) => {
  if (value) {
    form.value.toAccount = accountsRecord.value[value.accountId];
    form.value.targetAmount = value.amount;
  }
}, { immediate: true, deep: true });

watch(() => form.value.account, (value) => {
  // If fromAccount is the same as toAccount, make toAccount empty
  if (form.value.toAccount?.id === value?.id) {
    form.value.toAccount = null;
  }
});

watch(currentTxType, (value, prevValue) => {
  if (props.transaction) {
    if (value === FORM_TYPES.transfer) {
      if (props.transaction.transactionType === TRANSACTION_TYPES.income) {
        form.value.targetAmount = props.transaction.amount;
        form.value.amount = null;

        form.value.toAccount = accountsRecord.value[props.transaction.accountId];
        form.value.account = null;
      }
    } else if (prevValue === FORM_TYPES.transfer) {
      if (props.transaction.transactionType === TRANSACTION_TYPES.income) {
        form.value.amount = props.transaction.amount;
        form.value.targetAmount = null;

        form.value.account = accountsRecord.value[props.transaction.accountId];
        form.value.toAccount = null;
      }
    }
  }
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

    if (isFormCreation.value) {
      const creationParams: Parameters<typeof createTransaction>[0] = {
        amount,
        note,
        time: new Date(time).toUTCString(),
        transactionType: getTxTypeFromFormType(formTxType),
        paymentType: paymentType.value,
        accountId,
      };

      if (isTransferTx.value) {
        creationParams.destinationAccountId = toAccount.id;
        creationParams.destinationAmount = isCurrenciesDifferent.value
          ? form.value.targetAmount
          : amount;
        creationParams.isTransfer = true;
      } else {
        creationParams.categoryId = category.id;
      }

      await createTransaction(creationParams);
    } else {
      let editionParams: Parameters<typeof editTransaction>[0] = {
        txId: props.transaction.id,
      };

      if (isRecordExternal.value) {
        editionParams = {
          ...editionParams,
          note,
          paymentType: paymentType.value,
          isTransfer: false,
        };
      } else {
        editionParams = {
          ...editionParams,
          amount,
          note,
          time,
          transactionType: getTxTypeFromFormType(formTxType),
          paymentType: paymentType.value,
          accountId,
          isTransfer: false,
        };
      }

      if (isTransferTx.value) {
        editionParams.destinationAccountId = getDestinationAccountId({
          isRecordExternal: isRecordExternal.value,
          accountId: form.value.account.id,
          toAccountId: form.value.toAccount.id,
          sourceTransaction: props.transaction,
        });
        editionParams.destinationAmount = getDestinationAmount({
          sourceTransaction: props.transaction,
          isRecordExternal: isRecordExternal.value,
          fromAmount: Number(form.value.amount),
          toAmount: Number(form.value.targetAmount),
          isCurrenciesDifferent: isCurrenciesDifferent.value,
        });
        editionParams.isTransfer = true;
      } else {
        editionParams.categoryId = category.id;
      }

      await editTransaction(editionParams);
    }

    emit(MODAL_EVENTS.closeModal);
    // Reload all cached data in the app
    queryClient.invalidateQueries([VUE_QUERY_TX_CHANGE_QUERY]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
const deleteTransactionHandler = async () => {
  try {
    if (props.transaction.accountType !== ACCOUNT_TYPES.system) {
      return;
    }

    isLoading.value = true;

    await deleteTransaction(props.transaction.id);

    emit(MODAL_EVENTS.closeModal);
    // Reload all cached data in the app
    queryClient.invalidateQueries({ queryKey: [VUE_QUERY_TX_CHANGE_QUERY] });
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

onMounted(() => {
  if (!props.transaction) {
    form.value.account = systemAccounts.value[0];
  }
});
</script>

<style lang="scss" scoped>
$border-top-radius: 10px;
.modify-record {
  background-color: var(--app-bg-color);
  width: 100%;
  max-width: 600px;
  border-top-right-radius: $border-top-radius;
  border-top-left-radius: $border-top-radius;
}
.modify-record__header {
  padding: 24px;
  margin-bottom: 24px;

  border-top-right-radius: $border-top-radius;
  border-top-left-radius: $border-top-radius;

  transition: .2s ease-out;

  .modify-record--income & {
    background-color: var(--app-income-color);
  }
  .modify-record--expense & {
    background-color: var(--app-expense-color);
  }
  .modify-record--transfer & {
    background-color: var(--app-transfer-color);
  }
}
.modify-record__form {
  padding: 0 24px;
}
.modify-record__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 24px;
}
.modify-record__action--submit {
  margin-left: auto;
}
.modify-record__action-link {
  width: 100%;
}
</style>
