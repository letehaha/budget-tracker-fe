import { Ref, computed } from "vue";
import { TRANSACTION_TYPES, TransactionModel } from "shared-types";
import { OUT_OF_WALLET_ACCOUNT_MOCK } from "@/common/const";
import { storeToRefs } from "pinia";
import { useCurrenciesStore } from "@/stores";
import { UI_FORM_STRUCT } from "../types";

export const useTransferFormLogic = ({
  form,
  isTransferTx,
  isRecordExternal,
  transaction,
}: {
  form: Ref<UI_FORM_STRUCT>;
  isTransferTx: Ref<boolean>;
  isRecordExternal: Ref<boolean>;
  transaction: TransactionModel;
}) => {
  const { currenciesMap } = storeToRefs(useCurrenciesStore());

  const toAccount = computed(() => form.value.toAccount);

  const isTargetFieldVisible = computed(() => isTransferTx.value);

  const isTargetAmountFieldDisabled = computed(() => {
    if (isRecordExternal.value) {
      if (!isTransferTx.value) return true;
      if (transaction.transactionType === TRANSACTION_TYPES.income) return true;
    }

    // Means it's "Out of wallet"
    if (toAccount.value?.id === OUT_OF_WALLET_ACCOUNT_MOCK.id) return true;

    return false;
  });

  const targetCurrency = computed(
    () => currenciesMap.value[form.value.toAccount?.currencyId],
  );

  const fromAccountFieldDisabled = computed(() => {
    if (isRecordExternal.value) {
      if (!isTransferTx.value) return true;
      if (transaction.transactionType === TRANSACTION_TYPES.expense)
        return true;
    }

    return false;
  });
  const toAccountFieldDisabled = computed(() => {
    if (isRecordExternal.value) {
      if (!isTransferTx.value) return true;
      if (transaction.transactionType === TRANSACTION_TYPES.income) return true;
    }

    return false;
  });

  return {
    isTargetFieldVisible,
    isTargetAmountFieldDisabled,
    targetCurrency,
    fromAccountFieldDisabled,
    toAccountFieldDisabled,
  };
};
