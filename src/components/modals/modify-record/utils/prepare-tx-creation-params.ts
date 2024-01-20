import { TRANSACTION_TRANSFER_NATURE, TRANSACTION_TYPES } from "shared-types";
import { createTransaction } from "@/api";
import { OUT_OF_WALLET_ACCOUNT_MOCK } from "@/common/const";
import { UI_FORM_STRUCT } from "../types";
import { getTxTypeFromFormType } from "../helpers";

export const prepareTxCreationParams = ({
  form,
  isTransferTx,
  isCurrenciesDifferent,
}: {
  form: UI_FORM_STRUCT;
  isTransferTx: boolean;
  isCurrenciesDifferent: boolean;
}) => {
  const {
    amount,
    note,
    time,
    type: formTxType,
    paymentType,
    account: { id: accountId },
    toAccount,
    category,
  } = form;

  const creationParams: Parameters<typeof createTransaction>[0] = {
    amount,
    note,
    time: new Date(time).toUTCString(),
    transactionType: getTxTypeFromFormType(formTxType),
    paymentType: paymentType.value,
    accountId,
  };

  if (isTransferTx) {
    creationParams.destinationAccountId = toAccount.id;
    creationParams.destinationAmount = isCurrenciesDifferent
      ? form.targetAmount
      : amount;
    creationParams.transferNature = TRANSACTION_TRANSFER_NATURE.common_transfer;
  } else {
    creationParams.categoryId = category.id;
  }

  // Handle transfer_out_wallet
  // Always send amount+accountId and never destination data
  if (
    [creationParams.accountId, creationParams.destinationAccountId].includes(
      OUT_OF_WALLET_ACCOUNT_MOCK.id,
    )
  ) {
    creationParams.transferNature =
      TRANSACTION_TRANSFER_NATURE.transfer_out_wallet;

    if (creationParams.accountId === OUT_OF_WALLET_ACCOUNT_MOCK.id) {
      creationParams.transactionType = TRANSACTION_TYPES.income;
      creationParams.amount = creationParams.destinationAmount;
      creationParams.accountId = creationParams.destinationAccountId;
      delete creationParams.destinationAmount;
      delete creationParams.destinationAccountId;
    } else if (
      creationParams.destinationAccountId === OUT_OF_WALLET_ACCOUNT_MOCK.id
    ) {
      creationParams.transactionType = TRANSACTION_TYPES.expense;
      delete creationParams.destinationAmount;
      delete creationParams.destinationAccountId;
    }
  }

  return creationParams;
};
