<script lang="ts" setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  nextTick,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useQueryClient } from '@tanstack/vue-query';
import {
  TRANSACTION_TYPES,
  PAYMENT_TYPES,
  type TransactionModel,
  ACCOUNT_TYPES,
  TRANSACTION_TRANSFER_NATURE,
} from 'shared-types';
import { useAccountsStore, useCategoriesStore, useCurrenciesStore } from '@/stores';
import { createTransaction, editTransaction, deleteTransaction } from '@/api';
import { VERBOSE_PAYMENT_TYPES, OUT_OF_WALLET_ACCOUNT_MOCK, VUE_QUERY_TX_CHANGE_QUERY } from '@/common/const';
import InputField from '@/components/fields/input-field.vue';
import SelectField from '@/components/fields/select-field.vue';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center';
import CategorySelectField from '@/components/fields/category-select-field.vue';
import TextareaField from '@/components/fields/textarea-field.vue';
import DateField from '@/components/fields/date-field.vue';
import UiButton from '@/components/common/ui-button.vue';
import { EVENTS as MODAL_EVENTS } from '@/components/modal-center/ui-modal.vue';
import TransactionRecrod from '@/components/transactions-list/transaction-record.vue';
import FormHeader from './components/form-header.vue';
import TypeSelector from './components/type-selector.vue';
import FormRow from './components/form-row.vue';
import AccountField from './components/account-field.vue';
import { FORM_TYPES, UI_FORM_STRUCT } from './types';
import {
  getDestinationAccount,
  getDestinationAmount,
  getFormTypeFromTransaction,
  getTxTypeFromFormType,
} from './helpers';

defineOptions({
  name: 'record-form',
});

const isOutOfWalletAccount = (
  account: typeof OUT_OF_WALLET_ACCOUNT_MOCK,
) => account._isOutOfWallet;

const props = withDefaults(defineProps<{
  transaction?: TransactionModel;
  oppositeTransaction?: TransactionModel;
}>(), {
  transaction: undefined,
  oppositeTransaction: undefined,
});

const emit = defineEmits([MODAL_EVENTS.closeModal]);

const { addModal } = useModalCenter();
const { currenciesMap } = storeToRefs(useCurrenciesStore());
const { accountsRecord, systemAccounts } = storeToRefs(useAccountsStore());
const { formattedCategories, categoriesMap } = storeToRefs(useCategoriesStore());
const queryClient = useQueryClient();

const isFormCreation = computed(() => !props.transaction);

const form = ref<UI_FORM_STRUCT>({
  amount: null,
  account: null,
  transactionRecordItem: null,
  toAccount: null,
  targetAmount: null,
  category: formattedCategories.value[0],
  time: new Date().toISOString().substring(0, 19),
  paymentType: VERBOSE_PAYMENT_TYPES.find(item => item.value === PAYMENT_TYPES.creditCard),
  note: null,
  type: FORM_TYPES.expense,
});

const transactionItem = ref<TransactionModel | null>(null);
const isTransactionLength = ref(false);

const openTransactionModalList = async () => {
  const typeOfTransaction = props.transaction.transactionType === TRANSACTION_TYPES.expense
    ? TRANSACTION_TYPES.expense
    : TRANSACTION_TYPES.income;

  addModal({
    type: MODAL_TYPES.recordList,
    data: {
      transactionType: typeOfTransaction,
      onSelect(transaction) {
        transactionItem.value = transaction;
      },
    },
  });
};

const isRecordExternal = computed(() => {
  if (!props.transaction) return false;
  return props.transaction.accountType !== ACCOUNT_TYPES.system;
});
// If record is external, the account field will be disabled, so we need to preselect
// the account
watch(() => isRecordExternal.value, (value) => {
  if (
    value
    && props.transaction.transferNature !== TRANSACTION_TRANSFER_NATURE.transfer_out_wallet
  ) {
    nextTick(() => {
      if (accountsRecord.value[props.transaction.accountId]) {
        form.value.account = accountsRecord.value[props.transaction.accountId];
      }
    });
  }
}, { immediate: true });

watch(() => transactionItem.value, (value) => {
  if (value !== null) {
    isTransactionLength.value = true;
  }
});

const isLoading = ref(false);

const currentTxType = computed(() => form.value.type);
const isTransferTx = computed(() => currentTxType.value === FORM_TYPES.transfer);

const isAmountFieldDisabled = computed(() => {
  if (isRecordExternal.value) {
    if (!isTransferTx.value) return true;
    if (props.transaction.transactionType === TRANSACTION_TYPES.expense) return true;
  }

  // Means it's "Out of wallet"
  if (form.value.account?.id === OUT_OF_WALLET_ACCOUNT_MOCK.id) return true;

  return false;
});
const isTargetAmountFieldDisabled = computed(() => {
  if (isRecordExternal.value) {
    if (!isTransferTx.value) return true;
    if (props.transaction.transactionType === TRANSACTION_TYPES.income) return true;
  }

  // Means it's "Out of wallet"
  if (form.value.toAccount?.id === OUT_OF_WALLET_ACCOUNT_MOCK.id) return true;

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

const transferSourceAccounts = computed(() => [
  OUT_OF_WALLET_ACCOUNT_MOCK,
  ...systemAccounts.value,
]);

const transferDestinationAccounts = computed(() => (
  transferSourceAccounts.value.filter((item) => item.id !== form.value.account?.id)
));

watch(() => props.transaction, (value) => {
  if (value) {
    const initialFormValues = {
      type: getFormTypeFromTransaction(value),
      category: categoriesMap.value[value.categoryId],
      time: new Date(value.time).toISOString().substring(0, 19),
      paymentType: VERBOSE_PAYMENT_TYPES.find(item => item.value === value.paymentType),
      note: value.note,
      transactionRecordItem: value,
    } as typeof form.value;

    if (value.transferNature === TRANSACTION_TRANSFER_NATURE.transfer_out_wallet) {
      if (value.transactionType === TRANSACTION_TYPES.income) {
        initialFormValues.account = OUT_OF_WALLET_ACCOUNT_MOCK;
        initialFormValues.targetAmount = value.amount;
        initialFormValues.toAccount = accountsRecord.value[value.accountId];
      } else if (value.transactionType === TRANSACTION_TYPES.expense) {
        initialFormValues.amount = value.amount;
        initialFormValues.account = accountsRecord.value[value.accountId];
        initialFormValues.toAccount = OUT_OF_WALLET_ACCOUNT_MOCK;
      }
    } else {
      initialFormValues.amount = value.amount;
      initialFormValues.account = accountsRecord.value[value.accountId];
    }

    form.value = initialFormValues;
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
    const {
      amount, transactionType, accountId, transferNature,
    } = props.transaction;

    if (value === FORM_TYPES.transfer) {
      if (transactionType === TRANSACTION_TYPES.income) {
        form.value.targetAmount = amount;
        form.value.amount = null;

        form.value.toAccount = accountsRecord.value[accountId];
        form.value.account = null;

        if (transferNature === TRANSACTION_TRANSFER_NATURE.transfer_out_wallet) {
          form.value.account = OUT_OF_WALLET_ACCOUNT_MOCK;
        }
      }
    } else if (prevValue === FORM_TYPES.transfer) {
      if (transactionType === TRANSACTION_TYPES.income) {
        form.value.amount = amount;
        form.value.targetAmount = null;

        form.value.account = accountsRecord.value[accountId];
        form.value.toAccount = null;
      }
    }
  }
});

async function handleCreateTransaction() {
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
    creationParams.transferNature = TRANSACTION_TRANSFER_NATURE.common_transfer;
  } else {
    creationParams.categoryId = category.id;
  }

  // Handle transfer_out_wallet
  // Always send amount+accountId and never destination data
  if ([
    creationParams.accountId,
    creationParams.destinationAccountId,
  ].includes(OUT_OF_WALLET_ACCOUNT_MOCK.id)) {
    creationParams.transferNature = TRANSACTION_TRANSFER_NATURE.transfer_out_wallet;

    if (creationParams.accountId === OUT_OF_WALLET_ACCOUNT_MOCK.id) {
      creationParams.transactionType = TRANSACTION_TYPES.income;
      creationParams.amount = creationParams.destinationAmount;
      creationParams.accountId = creationParams.destinationAccountId;
      delete creationParams.destinationAmount;
      delete creationParams.destinationAccountId;
    } else if (creationParams.destinationAccountId === OUT_OF_WALLET_ACCOUNT_MOCK.id) {
      creationParams.transactionType = TRANSACTION_TYPES.expense;
      delete creationParams.destinationAmount;
      delete creationParams.destinationAccountId;
    }
  }

  await createTransaction(creationParams);
}

async function handleEditTransaction() {
  const {
    amount,
    note,
    time,
    type: formTxType,
    paymentType,
    account,
    category,
  } = form.value;

  const accountId = account?.id || null;

  let editionParams: Parameters<typeof editTransaction>[0] = {
    txId: props.transaction.id,
  };

  if (isRecordExternal.value) {
    editionParams = {
      ...editionParams,
      note,
      paymentType: paymentType.value,
      transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
    };
  } else {
    editionParams = {
      ...editionParams,
      amount: Number(amount),
      note,
      time,
      transactionType: getTxTypeFromFormType(formTxType),
      paymentType: paymentType.value,
      accountId,
      transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
    };
  }

  if (isTransferTx.value) {
    const destinationAccount = getDestinationAccount({
      isRecordExternal: isRecordExternal.value,
      account: form.value.account,
      toAccount: form.value.toAccount,
      sourceTransaction: props.transaction,
    });

    if (!transactionItem.value?.id) {
      if (isOutOfWalletAccount(destinationAccount)) {
        editionParams.transferNature = TRANSACTION_TRANSFER_NATURE.transfer_out_wallet;
      } else {
        editionParams.destinationAccountId = destinationAccount.id;
        editionParams.destinationAmount = getDestinationAmount({
          sourceTransaction: props.transaction,
          isRecordExternal: isRecordExternal.value,
          fromAmount: Number(form.value.amount),
          toAmount: Number(form.value.targetAmount),
          isCurrenciesDifferent: isCurrenciesDifferent.value,
        });
        editionParams.transferNature = TRANSACTION_TRANSFER_NATURE.common_transfer;
      }
    } else {
      editionParams.destinationTransactionId = transactionItem.value.id;
      editionParams.transferNature = TRANSACTION_TRANSFER_NATURE.common_transfer;
    }
  } else {
    editionParams.categoryId = category.id;
  }

  await editTransaction(editionParams);
}

const submit = async () => {
  isLoading.value = true;

  try {
    if (isFormCreation.value) {
      await handleCreateTransaction();
    } else {
      await handleEditTransaction();
    }

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

const deleteTransactionRecordHandler = () => {
  transactionItem.value = null;
  isTransactionLength.value = false;
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
      <form-row v-if="!transactionItem || transactionItem.transactionType !== 'expense'">
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
        v-model:account="form.account"
        v-model:to-account="form.toAccount"
        :is-transfer-transaction="isTransferTx"
        :is-transaction-record="isTransactionLength"
        :transaction-type="props.transaction?.transactionType || TRANSACTION_TYPES.expense"
        :accounts="isTransferTx ? transferSourceAccounts : systemAccounts"
        :from-account-disabled="fromAccountFieldDisabled"
        :to-account-disabled="toAccountFieldDisabled"
        :filtered-accounts="transferDestinationAccounts"
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

      <template
        v-if="isTransferTx && !transactionItem
          || (transactionItem && transactionItem.transactionType === 'expense')
        "
      >
        <form-row>
          <!-- TODO: for transfer tx disable this field if both accounts have same currency -->
          <input-field
            v-model="form.targetAmount"
            :disabled="isTargetAmountFieldDisabled"
            only-positive
            label="Target amount"
            placeholder="Target amount"
            type="number"
          >
            <template #iconTrailing>
              <span>{{ targetCurrency?.currency?.code }}</span>
            </template>
          </input-field>
        </form-row>
      </template>

      <template v-if="isTransferTx && !transactionItem && !isFormCreation">
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

      <template v-if="transactionItem && isTransferTx && !isFormCreation">
        <form-row class="modify-record__transaction">
          <TransactionRecrod class="modify-record__transaction-button" :tx="transactionItem" />
          <ui-button
            class="modify-record__action modify-record__action-transaction"
            @click="deleteTransactionRecordHandler"
          >
            Cancel
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
        aria-label="Delete transaction"
        @click="deleteTransactionHandler"
      >
        Delete
      </ui-button>
      <ui-button
        class="
          modify-record__action
          modify-record__action--submit
        "
        :aria-label="isFormCreation ? 'Create transaction' : 'Edit transaction'"
        :disabled="isLoading"
        @click="submit"
      >
        {{ isLoading ? 'Loading...' : isFormCreation ? 'Submit' : 'Edit' }}
      </ui-button>
    </div>
  </div>
</template>

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

.modify-record__transaction {
  display: flex;
}
.modify-record__transaction-button {
  background-color: var(--app-surface-color);
}
.modify-record__action-link {
  width: 100%;
}
.modify-record__action-transaction {
  margin-left: 10px;
}
</style>
