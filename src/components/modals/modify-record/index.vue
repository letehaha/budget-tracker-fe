<script lang="ts" setup>
import { ref, watch, computed, onMounted, nextTick, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useQueryClient } from "@tanstack/vue-query";
import { useEventListener } from "@vueuse/core";
import { XIcon } from "lucide-vue-next";
import {
  TRANSACTION_TYPES,
  PAYMENT_TYPES,
  type TransactionModel,
  ACCOUNT_TYPES,
  TRANSACTION_TRANSFER_NATURE,
} from "shared-types";
import { useAccountsStore, useCategoriesStore, useCurrenciesStore } from "@/stores";
import {
  createTransaction,
  editTransaction,
  deleteTransaction,
  linkTransactions,
  unlinkTransactions as apiUnlinkTransactions,
} from "@/api";
import {
  VERBOSE_PAYMENT_TYPES,
  OUT_OF_WALLET_ACCOUNT_MOCK,
  VUE_QUERY_TX_CHANGE_QUERY,
} from "@/common/const";
import InputField from "@/components/fields/input-field.vue";
import SelectField from "@/components/fields/select-field.vue";
import { MODAL_TYPES, useModalCenter } from "@/components/modal-center";
import CategorySelectField from "@/components/fields/category-select-field.vue";
import TextareaField from "@/components/fields/textarea-field.vue";
import DateField from "@/components/fields/date-field.vue";
import { Button } from "@/components/lib/ui/button";
import { EVENTS as MODAL_EVENTS } from "@/components/modal-center/ui-modal.vue";
import TransactionRecrod from "@/components/transactions-list/transaction-record.vue";
import TypeSelector from "./components/type-selector.vue";
import FormRow from "./components/form-row.vue";
import AccountField from "./components/account-field.vue";
import MarkAsRefundDialog from "./components/mark-as-refund/mark-as-refund-dialog.vue";
import { FORM_TYPES, UI_FORM_STRUCT } from "./types";
import { getFormTypeFromTransaction } from "./helpers";
import { useTransferFormLogic } from "./composables";
import { prepareTxCreationParams, prepareTxUpdationParams } from "./utils";

defineOptions({
  name: "record-form",
});

export interface CreateRecordModalProps {
  transaction?: TransactionModel;
  oppositeTransaction?: TransactionModel;
}

const props = withDefaults(defineProps<CreateRecordModalProps>(), {
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
  time: new Date(),
  paymentType: VERBOSE_PAYMENT_TYPES.find((item) => item.value === PAYMENT_TYPES.creditCard),
  note: null,
  type: FORM_TYPES.expense,
  refundTransaction: null,
});

const linkedTransaction = ref<TransactionModel | null>(null);

const refundTransactionsTypeBasedOnFormType = computed(() =>
  form.value.type === FORM_TYPES.expense ? TRANSACTION_TYPES.income : TRANSACTION_TYPES.expense,
);

const openTransactionModalList = async () => {
  const type =
    props.transaction?.transactionType === TRANSACTION_TYPES.expense
      ? TRANSACTION_TYPES.income
      : TRANSACTION_TYPES.expense;

  // if (isFormCreation.value) {
  //   type =
  //     form.value.type === FORM_TYPES.expense
  //       ? TRANSACTION_TYPES.expense
  //       : TRANSACTION_TYPES.income;
  // }

  addModal({
    type: MODAL_TYPES.recordList,
    data: {
      transactionType: type,
      onSelect(transaction) {
        linkedTransaction.value = transaction;
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
watch(
  () => isRecordExternal.value,
  (value) => {
    if (
      value &&
      props.transaction.transferNature !== TRANSACTION_TRANSFER_NATURE.transfer_out_wallet
    ) {
      nextTick(() => {
        if (accountsRecord.value[props.transaction.accountId]) {
          form.value.account = accountsRecord.value[props.transaction.accountId];
        }
      });
    }
  },
  { immediate: true },
);

const isLoading = ref(false);

const currentTxType = computed(() => form.value.type);
const isTransferTx = computed(() => currentTxType.value === FORM_TYPES.transfer);

const {
  isTargetFieldVisible,
  isTargetAmountFieldDisabled,
  targetCurrency,
  fromAccountFieldDisabled,
  toAccountFieldDisabled,
} = useTransferFormLogic({
  form,
  isTransferTx,
  isRecordExternal,
  transaction: props.transaction,
  linkedTransaction,
});

const isAmountFieldDisabled = computed(() => {
  if (isRecordExternal.value) {
    if (!isTransferTx.value) return true;
    if (props.transaction.transactionType === TRANSACTION_TYPES.expense) {
      return true;
    }
  }
  // Means it's "Out of wallet"
  if (form.value.account?.id === OUT_OF_WALLET_ACCOUNT_MOCK.id) return true;
  if (isTransferTx.value && linkedTransaction.value) return true;
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

const transferSourceAccounts = computed(() => [
  OUT_OF_WALLET_ACCOUNT_MOCK,
  ...systemAccounts.value,
]);

const transferDestinationAccounts = computed(() =>
  transferSourceAccounts.value.filter((item) => item.id !== form.value.account?.id),
);

watch(
  () => props.transaction,
  (value) => {
    if (value) {
      const initialFormValues = {
        type: getFormTypeFromTransaction(value),
        category: categoriesMap.value[value.categoryId],
        time: new Date(value.time),
        paymentType: VERBOSE_PAYMENT_TYPES.find((item) => item.value === value.paymentType),
        note: value.note,
        transactionRecordItem: value,
        refundTransaction: null,
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
  },
  { immediate: true, deep: true },
);

watch(
  () => props.oppositeTransaction,
  (value) => {
    if (value) {
      form.value.toAccount = accountsRecord.value[value.accountId];
      form.value.targetAmount = value.amount;
    }
  },
  { immediate: true, deep: true },
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

watch(
  () => [currentTxType.value, linkedTransaction.value],
  ([txType, isLinked], [prevTxType]) => {
    if (props.transaction) {
      const { amount, transactionType, accountId, transferNature } = props.transaction;

      if (isLinked) {
        form.value.amount = amount;
        form.value.account = accountsRecord.value[accountId];
      } else if (txType === FORM_TYPES.transfer) {
        if (transactionType === TRANSACTION_TYPES.income) {
          form.value.targetAmount = amount;
          form.value.amount = null;

          form.value.toAccount = accountsRecord.value[accountId];
          form.value.account = null;

          if (transferNature === TRANSACTION_TRANSFER_NATURE.transfer_out_wallet) {
            form.value.account = OUT_OF_WALLET_ACCOUNT_MOCK;
          }
        }
      } else if (prevTxType === FORM_TYPES.transfer) {
        if (transactionType === TRANSACTION_TYPES.income) {
          form.value.amount = amount;
          form.value.targetAmount = null;

          form.value.account = accountsRecord.value[accountId];
          form.value.toAccount = null;
        }
      }
    }
  },
);

const submit = async () => {
  isLoading.value = true;

  try {
    if (isFormCreation.value) {
      await createTransaction(
        // TODO: unit tests for "prepareTxCreationParams" and "prepareTxUpdationParams"
        prepareTxCreationParams({
          form: form.value,
          isTransferTx: isTransferTx.value,
          isCurrenciesDifferent: isCurrenciesDifferent.value,
          // linkedTransaction: linkedTransaction.value,
        }),
      );
    } else if (linkedTransaction.value) {
      await linkTransactions({
        ids: [[props.transaction.id, linkedTransaction.value.id]],
      });
    } else {
      await editTransaction(
        prepareTxUpdationParams({
          form: form.value,
          transaction: props.transaction,
          linkedTransaction: linkedTransaction.value,
          isTransferTx: isTransferTx.value,
          isRecordExternal: isRecordExternal.value,
          isCurrenciesDifferent: isCurrenciesDifferent.value,
        }),
      );
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

const unlinkTransactions = async () => {
  try {
    isLoading.value = true;

    await apiUnlinkTransactions({
      transferIds: [props.transaction.transferId],
    });

    emit(MODAL_EVENTS.closeModal);
    // Reload all cached data in the app
    queryClient.invalidateQueries({ queryKey: [VUE_QUERY_TX_CHANGE_QUERY] });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
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
  linkedTransaction.value = null;
};

const closeModal = () => {
  emit(MODAL_EVENTS.closeModal);
};

const selectTransactionType = (type: FORM_TYPES, disabled = false) => {
  if (!disabled) form.value.type = type;
};

// Stores element that was focused before modal was opened, to then focus it back
// when modal will be closed
const previouslyFocusedElement = ref(document.activeElement);

onMounted(() => {
  if (!props.transaction) {
    form.value.account = systemAccounts.value[0];
  }
});

onUnmounted(() => {
  (previouslyFocusedElement.value as HTMLElement).focus();
});

useEventListener(document, "keydown", (event) => {
  if (event.key === "Escape") closeModal();
});
</script>

<template>
  <div class="rounded-t-xl bg-card w-full max-w-[800px]">
    <div
      :class="[
        'h-3 transition-[background-color] ease-out duration-200 rounded-t-xl',
        currentTxType === FORM_TYPES.income && 'bg-app-income-color',
        currentTxType === FORM_TYPES.expense && 'bg-app-expense-color',
        currentTxType === FORM_TYPES.transfer && 'bg-app-transfer-color',
      ]"
    />
    <div class="flex items-center justify-between py-3 px-6 mb-4">
      <span class="text-2xl">
        {{ isFormCreation ? "Add Record" : "Edit Record" }}
      </span>

      <Button variant="ghost" @click="closeModal"> Close </Button>
    </div>
    <div class="grid grid-cols-[450px,1fr] relative">
      <div class="px-6">
        <type-selector
          :is-form-creation="isFormCreation"
          :selected-transaction-type="currentTxType"
          :transaction="transaction"
          class="mb-6"
          @change-tx-type="selectTransactionType"
        />

        <div>
          <form-row>
            <input-field
              v-model="form.amount"
              label="Amount"
              type="number"
              :disabled="isAmountFieldDisabled"
              only-positive
              placeholder="Amount"
              autofocus
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
            :is-transaction-linking="!!linkedTransaction"
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

          <template v-if="isTargetFieldVisible">
            <form-row>
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

          <template
            v-if="
              isTransferTx && !linkedTransaction && !isFormCreation && !Boolean(oppositeTransaction)
            "
          >
            <form-row>
              <Button
                class="w-full"
                :disabled="isLoading"
                size="sm"
                @click="openTransactionModalList"
              >
                Link existing transaction
              </Button>
            </form-row>
          </template>

          <template v-if="isTransferTx && oppositeTransaction">
            <form-row>
              <Button class="w-full" :disabled="isLoading" size="sm" @click="unlinkTransactions">
                Unlink transactions
              </Button>
            </form-row>
          </template>

          <template v-if="linkedTransaction && isTransferTx && !isFormCreation">
            <form-row class="flex items-center gap-2.5">
              <TransactionRecrod class="bg-background" :tx="linkedTransaction" />

              <Button aria-label="Cancel linking" size="sm" @click="deleteTransactionRecordHandler">
                Cancel
              </Button>
            </form-row>
          </template>

          <form-row>
            <date-field v-model="form.time" :disabled="isRecordExternal" label="Datetime" />
          </form-row>
        </div>

        <div class="flex items-center justify-between p-6">
          <Button
            v-if="transaction && transaction.accountType === ACCOUNT_TYPES.system"
            class="min-w-[100px]"
            :disabled="isLoading"
            aria-label="Delete transaction"
            variant="destructive"
            @click="deleteTransactionHandler"
          >
            Delete
          </Button>
          <Button
            class="ml-auto min-w-[100px]"
            :aria-label="isFormCreation ? 'Create transaction' : 'Edit transaction'"
            :disabled="isLoading"
            @click="submit"
          >
            {{ isLoading ? "Loading..." : isFormCreation ? "Submit" : "Edit" }}
          </Button>
        </div>
      </div>
      <div class="px-6 pt-6 bg-black/20 shadow-inner shadow-black/40 shadow-[inset_2px_4px_12px]">
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
          <textarea-field v-model="form.note" placeholder="Note" label="Note (optional)" />
        </form-row>
        <template v-if="!isTransferTx">
          <form-row>
            <template v-if="form.refundTransaction">
              <p class="text-sm">Refund of:</p>
              <div class="flex gap-2 items-center">
                <TransactionRecrod :tx="form.refundTransaction" />
                <Button
                  variant="default"
                  size="icon"
                  class="flex-shrink-0"
                  @click="form.refundTransaction = null"
                >
                  <XIcon />
                </Button>
              </div>
            </template>
            <template v-else>
              <MarkAsRefundDialog
                :key="refundTransactionsTypeBasedOnFormType"
                v-model="form.refundTransaction"
                :transaction-type="refundTransactionsTypeBasedOnFormType"
              />
            </template>
          </form-row>
        </template>
      </div>
    </div>
  </div>
</template>
