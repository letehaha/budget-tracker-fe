import {
  MonobankUserModel,
  MonobankTrasnactionModel,
  MonobankAccountModel,
  endpointsTypes,
} from 'shared-types';
import { api } from '@/api/_api';

export const loadMonoUser = async (): Promise<MonobankUserModel> => {
  const result = await api.get('/banks/monobank/user');

  return result;
};

export const updateMonoTransactionById = async (
  payload: endpointsTypes.UpdateMonobankTransactionBody,
): Promise<MonobankTrasnactionModel> => {
  const result = await api.post('/banks/monobank/transaction', payload);

  return result;
};

export const getMonoAccounts = async (): Promise<MonobankAccountModel[]> => api.get('/banks/monobank/accounts');

export const updateMonoAccountById = async (
  payload: endpointsTypes.UpdateMonobankAccountByIdBody,
): Promise<MonobankAccountModel> => api.post('/banks/monobank/account', payload);

export const refreshMonoAccounts = async (): Promise<MonobankAccountModel[]> => api.get('/banks/monobank/refresh-accounts');

export const loadMonoTransactions = async (
  payload: endpointsTypes.LoadMonoTransactionsQuery,
): Promise<endpointsTypes.LoadMonoTransactionsResponse> => api.get('/banks/monobank/load-transactions', payload);

export const getMonoTransactions = async (
  payload: endpointsTypes.GetMonobankTransactionsQuery,
): Promise<endpointsTypes.GetMonobankTransactionsResponse> => api.get('/banks/monobank/transactions', payload);

export const updateMonoWebhook = async (
  payload: endpointsTypes.UpdateWebhookBody,
): Promise<void> => api.post('/banks/monobank/update-webhook', payload);

export const updateMonoUser = async (
  payload: endpointsTypes.UpdateMonobankUserBody,
): Promise<MonobankUserModel> => api.post('/banks/monobank/user', payload);

export const pairMonoAccount = async (
  payload: endpointsTypes.PairMonobankAccountBody,
): Promise<void> => api.post('/banks/monobank/pair-user', payload);
