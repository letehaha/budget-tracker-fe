import { AccountModel } from 'shared-types';
import { api } from '@/api/_api';

export const loadAccounts = async (): Promise<AccountModel[]> => {
  const result = await api.get('/accounts');

  return result;
};

export type CreateAccountPayload = {
  name: string;
  currencyId: number;
  accountTypeId: number;
  currentBalance?: number;
  creditLimit?: number;
}
export const createAccount = async (payload: CreateAccountPayload): Promise<AccountModel> => {
  const result = await api.post('/accounts', payload);

  return result;
};

export const editAccount = async ({ id, ...data }): Promise<AccountModel> => {
  const result = await api.put(`/accounts/${id}`, data);

  return result;
};

export interface DeleteAccountPayload {
  id: number;
}
export const deleteAccount = async ({ id }: DeleteAccountPayload): Promise<void> => (
  api.delete(`/accounts/${id}`)
);
