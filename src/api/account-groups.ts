import { api } from "@/api/_api";
import { AccountGroups } from "@/common/types/models";

export const loadAccountGroups = async (
  payload: { accountIds?: number[] } = {},
): Promise<AccountGroups[]> => {
  const result: AccountGroups[] = await api.get("/account-group", payload);

  return result;
};

export const createAccountsGroup = async (payload: { name: string }): Promise<AccountGroups[]> => {
  const result: AccountGroups[] = await api.post("/account-group", payload);

  return result;
};

export const linkAccountToGroup = async (payload: { accountId: number; groupId: number }) => {
  const result: AccountGroups[] = await api.post(
    `/account-group/${payload.groupId}/add-account/${payload.accountId}`,
  );
  return result;
};

export const removeAccountFromGroup = async (payload: { accountId: number; groupId: number }) => {
  await api.delete(`/account-group/${payload.groupId}/accounts/${payload.accountId}`);
};
