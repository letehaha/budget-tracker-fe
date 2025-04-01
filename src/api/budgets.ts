/* eslint-disable prettier-vue/prettier */
import { BudgetsModel } from "shared-types";
import { api } from "@/api/_api";
import { toSystemAmount, fromSystemAmount } from "./helpers";

interface editBudgetParamsParams {
  name?: string;
  limitAmount?: number;
}

export const loadSystemBudgets = async (): Promise<BudgetsModel[]> => {
  const result = await api.get("/budgets");

  const updatedResult = result.map((budget: BudgetsModel) => {
    if (budget.limitAmount) {
      return {
        ...budget,
        limitAmount: fromSystemAmount(Number(budget.limitAmount)),
      };
    }
    return budget;
  });

  return updatedResult;
};

export const loadBudgetById = async (id: number): Promise<BudgetsModel> => {
  const result = await api.get(`/budgets/${id}`)

  if (result.limitAmount) result.limitAmount = fromSystemAmount(Number(result.limitAmount))

  return result
}

export const createBudget = async (
  payload: Omit<BudgetsModel, 'id' | 'userId'>,
): Promise<BudgetsModel> => {
  const params = payload

  if (params.limitAmount) params.limitAmount = toSystemAmount(Number(params.limitAmount));
  const result = await api.post("/budgets", params);

  return result;
};

export const deleteBudget = async (budgetId: number) => {
  await api.delete(`/budgets/${budgetId}`);
};

export const editBudget = async (
  {
    budgetId,
    payload
  }:
  {
    budgetId: number,
    payload: editBudgetParamsParams
  }
) => {
  const params = payload

  if (params.limitAmount) params.limitAmount = toSystemAmount(Number(params.limitAmount));

  await api.put(`/budgets/${budgetId}`, params)
}

export const addTransactionsToBudget = async (budgetId: number, params: unknown) => {
  await api.post(`/budgets/${budgetId}/transactions`, params)
}
