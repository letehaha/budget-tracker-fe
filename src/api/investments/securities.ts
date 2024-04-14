import { SecurityModel } from "shared-types";
import { api } from "@/api/_api";

export const loadSecuritiesList = async ({
  query,
}: { query?: string } = {}): Promise<SecurityModel[]> => {
  const result: SecurityModel[] = await api.get(
    query ? `/investing/securities?query=${query}` : "/investing/securities",
  );

  return result || [];
};

export const loadSecuritiesPrices = async () => {
  const result = await api.get("/investing/securities/prices");

  return result;
};

export const syncSecurities = async (): Promise<void> =>
  api.get("/investing/securities/sync");
