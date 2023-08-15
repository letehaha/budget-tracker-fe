import { AccountModel, endpointsTypes } from 'shared-types';
import { api } from '@/api/_api';

export const loadAccounts = async (): Promise<AccountModel[]> => {
  const result = await api.get('/accounts');

  return result;
};

export const createAccount = async (
  payload: Omit<endpointsTypes.CreateAccountBody, 'accountTypeId'>,
): Promise<AccountModel> => {
  const result = await api.post('/accounts', {
    ...payload,
    // For now we just doesn't allow users to select account type
    // (credit card, debit card, etc) on UI
    accountTypeId: 1,
  });

  return result;
};

export const editAccount = async (
  { id, ...data }: endpointsTypes.UpdateAccountBody & { id: number },
): Promise<AccountModel> => {
  const result = await api.put(`/accounts/${id}`, data);

  return result;
};

export interface DeleteAccountPayload {
  id: number;
}
export const deleteAccount = async ({ id }: DeleteAccountPayload): Promise<void> => (
  api.delete(`/accounts/${id}`)
);
