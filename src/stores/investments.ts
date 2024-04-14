import { defineStore } from "pinia";
import { useFetchHoldingsList, useFetchSecuritiesList } from "@/composable";

export const useInvestmentsStore = defineStore("investments", () => {
  const { data: holdings } = useFetchHoldingsList();
  const { data: securities } = useFetchSecuritiesList();

  return { holdings, securities };
});
