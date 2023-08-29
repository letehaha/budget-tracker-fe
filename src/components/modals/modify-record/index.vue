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
        @change-tx-type="selectTransactionType"
      />
    </div>
    <div class="modify-record__form">
      <form-row>
        <input-field
          v-model="form.amount"
          label="Amount"
          type="number"
          :disabled="isRecordExternal"
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
        :disabled="isRecordExternal"
        :filtered-accounts="filteredAccounts"
        @close-modal="$emit('close')"
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
            :label="`Target amount (${targetCurrency.currency.code})`"
            type="number"
          />
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
        v-if="transaction"
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
import { useQueryClient } from '@tanstack/vue-query';
import {
  CategoryModel,
  AccountModel,
  TRANSACTION_TYPES,
  PAYMENT_TYPES,
  TransactionModel,
  ACCOUNT_TYPES,
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
} from '@/api/transactions';

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

import { FORM_TYPES } from './types';

const getFormTypeFromTransaction = (tx: TransactionModel): FORM_TYPES => {
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

const emit = defineEmits([MODAL_EVENTS.closeModal]);

const { getCurrency, currenciesMap } = useCurrenciesStore();
const { accountsRecord, accounts, systemAccounts } = storeToRefs(useAccountsStore());
const { categories, rawCategories } = storeToRefs(useCategoriesStore());
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
  category: categories.value[0],
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
      form.value.account = accounts.value.find(item => item.id === props.transaction.accountId);
    });
  }
}, { immediate: true });

const isLoading = ref(false);

const currentTxType = computed(() => form.value.type);
const isTransferTx = computed(() => currentTxType.value === FORM_TYPES.transfer);

const isCurrenciesDifferent = computed(() => {
  if (!form.value.account || !form.value.toAccount) return false;

  return form.value.account.currencyId !== form.value.toAccount.currencyId;
});

const currencyCode = computed(() => {
  if (form.value.account?.currencyId) {
    return currenciesMap[form.value.account.currencyId].currency.code;
  }
  return undefined;
});

const targetCurrency = computed(() => {
  if (form.value.toAccount?.currencyId) getCurrency(form.value.toAccount.currencyId);
  return undefined;
});

const filteredAccounts = computed(() => systemAccounts.value.filter(
  (item) => item.id !== form.value.account?.id,
));

watch(() => props.transaction, (value) => {
  if (value) {
    form.value = {
      amount: fromSystemAmount(value.amount),
      account: accountsRecord.value[value.accountId],
      type: getFormTypeFromTransaction(value),
      category: rawCategories.value.find(i => i.id === value.categoryId),
      time: new Date(value.time).toISOString().substring(0, 19),
      paymentType: VERBOSE_PAYMENT_TYPES.find(item => item.value === value.paymentType),
      note: value.note,
    };
  }
}, { immediate: true, deep: true });

watch(() => props.oppositeTransaction, (value) => {
  if (value) {
    form.value.toAccount = accountsRecord.value[value.accountId];
    form.value.targetAmount = fromSystemAmount(value.amount);
  }
}, { immediate: true, deep: true });

watch(() => form.value.account, (value) => {
  // If fromAccount is the same as toAccount, make toAccount empty
  if (form.value.toAccount?.id === value?.id) {
    form.value.toAccount = null;
  }
});

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

    if (isFormCreation.value) {
      const creationParams: Parameters<typeof createTransaction>[0] = {
        amount: toSystemAmount(Number(amount)),
        note,
        time: new Date(time).toISOString(),
        transactionType: getTxTypeFromFormType(formTxType),
        paymentType: paymentType.value,
        accountId,
      };

      if (isTransferTx.value) {
        creationParams.destinationAccountId = toAccount.id;
        creationParams.destinationAmount = isCurrenciesDifferent.value
          ? toSystemAmount(Number(form.value.targetAmount))
          : toSystemAmount(Number(amount));
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
          categoryId: category.id,
        };
      } else {
        editionParams = {
          ...editionParams,
          amount: toSystemAmount(Number(amount)),
          note,
          time: new Date(time).toISOString(),
          transactionType: getTxTypeFromFormType(formTxType),
          paymentType: paymentType.value,
          accountId,
        };

        if (isTransferTx.value) {
          editionParams.destinationAccountId = toAccount.id;
          editionParams.destinationAmount = isCurrenciesDifferent.value
            ? toSystemAmount(Number(form.value.targetAmount))
            : toSystemAmount(Number(amount));
          editionParams.isTransfer = true;
        } else {
          editionParams.categoryId = category.id;
        }
      }

      await editTransaction(editionParams);
    }

    emit(MODAL_EVENTS.closeModal);
    // Reload all cached data in the app
    queryClient.invalidateQueries();
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
    // Reload all cached data in the app
    queryClient.invalidateQueries();
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
</style>
