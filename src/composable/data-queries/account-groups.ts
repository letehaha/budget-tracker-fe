import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { loadAccountGroups } from "@/api/account-groups";
import { AccountGroups } from "@/common/types/models";

export const useAccountGroupForAccount = (
  { accountId }: { accountId: string | number },
  queryOptions: Partial<Parameters<typeof useQuery<AccountGroups | null, Error>>[0]> = {},
) => {
  const queryClient = useQueryClient();
  const query = useQuery<AccountGroups | null>({
    queryFn: async () => {
      const result = await loadAccountGroups({ accountIds: [Number(accountId)] });
      return result.length ? result[0] : null;
    },
    queryKey: ["account-group-of-account", accountId],
    staleTime: Infinity,
    ...queryOptions,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["account-group-of-account", accountId] });
  };

  return {
    group: query.data,
    invalidate,
    ...query,
  };
};
