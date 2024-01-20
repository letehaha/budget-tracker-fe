import {
  INCOME_TRANSACTION,
  EXPENSE_TRANSACTION,
  COMMON_TRANSFER_TRANSACTION,
  OUT_OF_WALLET_TRANSACTION,
} from "@tests/mocks";
import { TRANSACTION_TYPES } from "shared-types";
import {
  getDestinationAmount,
  getFormTypeFromTransaction,
  getTxTypeFromFormType,
} from "./helpers";
import { FORM_TYPES } from "./types";

describe("components/modals/modify-record/helpers", () => {
  describe("getDestinationAmount", () => {
    test.each([
      [[10, 20, false, false, INCOME_TRANSACTION], 10],
      [[10, 20, false, true, INCOME_TRANSACTION], 10],
      [[10, 20, true, false, INCOME_TRANSACTION], 20],

      [[10, 20, false, false, EXPENSE_TRANSACTION], 10],
      [[10, 20, false, true, EXPENSE_TRANSACTION], 20],
      [[10, 20, true, false, EXPENSE_TRANSACTION], 20],
    ])("%s to be %s", (args, expected) => {
      expect(
        getDestinationAmount({
          fromAmount: args[0],
          toAmount: args[1],
          isCurrenciesDifferent: args[2],
          isRecordExternal: args[3],
          sourceTransaction: args[4],
        }),
      ).toBe(expected);
    });
  });

  describe("getFormTypeFromTransaction", () => {
    test.each([
      [INCOME_TRANSACTION, FORM_TYPES.income],
      [EXPENSE_TRANSACTION, FORM_TYPES.expense],
      [COMMON_TRANSFER_TRANSACTION, FORM_TYPES.transfer],
      [OUT_OF_WALLET_TRANSACTION, FORM_TYPES.transfer],
    ])("%s to be %s", (value, expected) => {
      expect(getFormTypeFromTransaction(value)).toBe(expected);
    });
  });

  describe("getTxTypeFromFormType", () => {
    test.each([
      [FORM_TYPES.income, TRANSACTION_TYPES.income],
      [FORM_TYPES.expense, TRANSACTION_TYPES.expense],
      [FORM_TYPES.transfer, TRANSACTION_TYPES.expense],
    ])("%s to be %s", (value, expected) => {
      expect(getTxTypeFromFormType(value)).toBe(expected);
    });
  });
});
