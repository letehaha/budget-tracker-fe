import { api } from "@/api/_api";
import { AccountGroups } from "@/common/types/models";
import { formatAccount } from "./accounts";

const formatAccountGroups = (groups: AccountGroups[]): AccountGroups[] =>
  groups.map((group) => ({
    ...group,
    accounts: group.accounts.map(formatAccount),
    childGroups: formatAccountGroups(group.childGroups),
  }));

export const loadAccountGroups = async (
  payload: { accountIds?: number[]; hidden?: boolean } = {},
): Promise<AccountGroups[]> => {
  const result: AccountGroups[] = await api.get("/account-group", payload);

  return formatAccountGroups(result);
};

export const createAccountsGroup = async (payload: { name: string }): Promise<AccountGroups[]> => {
  const result: AccountGroups[] = await api.post("/account-group", payload);

  return formatAccountGroups(result);
};

export const linkAccountToGroup = async (payload: { accountId: number; groupId: number }) => {
  const result: AccountGroups[] = await api.post(
    `/account-group/${payload.groupId}/add-account/${payload.accountId}`,
  );
  return formatAccountGroups(result);
};

export const removeAccountFromGroup = async (payload: { accountId: number; groupId: number }) => {
  await api.delete(`/account-group/${payload.groupId}/accounts/${payload.accountId}`);
};
