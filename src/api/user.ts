import { api } from '@/api/_api';
import * as types from '@/common/types';

export const loadUserData = async (): Promise<types.UserRecord> => {
  const result = await api.get('/user');

  return result;
};
