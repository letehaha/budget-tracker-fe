import {
  MonobankUserModel,
  MonobankTrasnactionModel,
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
