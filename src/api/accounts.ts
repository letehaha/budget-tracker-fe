import { AccountModel, endpointsTypes } from 'shared-types';
import { api } from '@/api/_api';
import { fromSystemAmount, toSystemAmount } from '@/api/helpers';

const formatAccount = (account: AccountModel): AccountModel => ({
  ...account,
  creditLimit: fromSystemAmount(account.creditLimit),
  currentBalance: fromSystemAmount(account.currentBalance),
  initialBalance: fromSystemAmount(account.initialBalance),
  refCreditLimit: fromSystemAmount(account.refCreditLimit),
  refCurrentBalance: fromSystemAmount(account.refCurrentBalance),
  refInitialBalance: fromSystemAmount(account.refInitialBalance),
});

export const loadAccounts = async (): Promise<AccountModel[]> => {
  const result: AccountModel[] = await api.get('/accounts');

  return result.map(item => formatAccount(item));
};

export const createAccount = async (
  payload: Omit<endpointsTypes.CreateAccountBody, 'accountTypeId'>,
): Promise<AccountModel> => {
  const params = payload;

  if (params.creditLimit) params.creditLimit = toSystemAmount(Number(params.creditLimit));
  if (params.initialBalance) params.initialBalance = toSystemAmount(Number(params.initialBalance));

  const result = await api.post('/accounts', {
    ...params,
    // For now we just doesn't allow users to select account type
    // (credit card, debit card, etc) on UI
    accountTypeId: 1,
  });

  return result;
};

export const editAccount = async (
  { id, ...data }: endpointsTypes.UpdateAccountBody & { id: number },
): Promise<AccountModel> => {
  const params = data;

  if (params.creditLimit) params.creditLimit = toSystemAmount(Number(params.creditLimit));
  if (params.currentBalance) params.currentBalance = toSystemAmount(Number(params.currentBalance));

  const result = await api.put(`/accounts/${id}`, params);

  return formatAccount(result);
};

export interface DeleteAccountPayload {
  id: number;
}
export const deleteAccount = async ({ id }: DeleteAccountPayload): Promise<void> => (
  api.delete(`/accounts/${id}`)
);
