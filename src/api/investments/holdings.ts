import { HoldingModel } from "shared-types";
import { api } from "@/api/_api";

export const loadHoldingsList = async () => {
  const result: HoldingModel[] = await api.get("/investing/holdings");

  return result || [];
};

export const createHolding = async ({
  accountId,
  securityId,
}: {
  accountId: number;
  securityId: number;
}) => {
  const result = await api.post("/investing/holdings", {
    accountId,
    securityId,
  });

  return result;
};
