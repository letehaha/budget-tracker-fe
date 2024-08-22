import { TRANSACTION_TRANSFER_NATURE, TransactionModel } from "shared-types";
import { editTransaction } from "@/api";
import { UI_FORM_STRUCT } from "../types";
import {
  getTxTypeFromFormType,
  getDestinationAccount,
  isOutOfWalletAccount,
  getDestinationAmount,
} from "../helpers";

export const prepareTxUpdationParams = ({
  form,
  transaction,
  linkedTransaction,
  isTransferTx,
  isRecordExternal,
  isCurrenciesDifferent,
}: {
  transaction: TransactionModel;
  linkedTransaction?: TransactionModel | null;
  form: UI_FORM_STRUCT;
  isTransferTx: boolean;
  isRecordExternal: boolean;
  isCurrenciesDifferent: boolean;
}) => {
  const { amount, note, time, type: formTxType, paymentType, account, category } = form;

  const accountId = account?.id || null;

  let editionParams: Parameters<typeof editTransaction>[0] = {
    txId: transaction.id,
  };

  if (isRecordExternal) {
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
      time: time.toISOString(),
      transactionType: getTxTypeFromFormType(formTxType),
      paymentType: paymentType.value,
      accountId,
      transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
    };
  }

  if (isTransferTx) {
    const destinationAccount = getDestinationAccount({
      isRecordExternal,
      account: form.account,
      toAccount: form.toAccount,
      sourceTransaction: transaction,
    });

    if (!linkedTransaction?.id) {
      if (isOutOfWalletAccount(destinationAccount)) {
        editionParams.transferNature = TRANSACTION_TRANSFER_NATURE.transfer_out_wallet;
      } else {
        editionParams.destinationAccountId = destinationAccount.id;
        editionParams.destinationAmount = getDestinationAmount({
          sourceTransaction: transaction,
          isRecordExternal,
          fromAmount: Number(form.amount),
          toAmount: Number(form.targetAmount),
          isCurrenciesDifferent,
        });
        editionParams.transferNature = TRANSACTION_TRANSFER_NATURE.common_transfer;
      }
    } else {
      editionParams.destinationTransactionId = linkedTransaction.id;
      editionParams.transferNature = TRANSACTION_TRANSFER_NATURE.common_transfer;
    }
  } else {
    editionParams.categoryId = category.id;
  }

  return editionParams;
};
