import { useQuery } from "@tanstack/vue-query";
import { storeToRefs } from "pinia";
import { useRootStore } from "@/stores";
import {
  loadSecuritiesList,
  loadSecuritiesPrices,
  loadHoldingsList,
  getInvestmentTransactionsForAccount,
} from "@/api";
import { InvestmentTransactionModel } from "shared-types";

export const useFetchSecuritiesList = () => {
  const rootStore = useRootStore();
  const { isAppInitialized } = storeToRefs(rootStore);

  return useQuery({
    queryKey: ["useFetchSecuritiesList"],
    queryFn: () => loadSecuritiesList(),
    staleTime: Infinity,
    placeholderData: [],
    enabled: isAppInitialized,
  });
};

export const useFetchSecuritiesPrices = () => {
  const rootStore = useRootStore();
  const { isAppInitialized } = storeToRefs(rootStore);

  return useQuery({
    queryKey: ["useFetchSecuritiesPrices"],
    queryFn: loadSecuritiesPrices,
    staleTime: Infinity,
    placeholderData: [],
    enabled: isAppInitialized,
  });
};

export const useFetchHoldingsList = () => {
  const rootStore = useRootStore();
  const { isAppInitialized } = storeToRefs(rootStore);

  return useQuery({
    queryKey: ["useFetchHoldingsList"],
    queryFn: loadHoldingsList,
    staleTime: Infinity,
    placeholderData: [],
    enabled: isAppInitialized,
  });
};

export const useInvestTxsForAccount = ({ accountId, securityId }) => {
  const rootStore = useRootStore();
  const { isAppInitialized } = storeToRefs(rootStore);

  return useQuery({
    queryKey: ["useInvestTxsForAccount", { accountId, securityId }],
    queryFn: (): Promise<InvestmentTransactionModel[]> =>
      getInvestmentTransactionsForAccount({ accountId, securityId }),
    staleTime: Infinity,
    placeholderData: [],
    enabled: isAppInitialized,
  });
};
