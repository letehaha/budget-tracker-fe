import { api } from '@/api';

export const deleteCurrency = async (currencyId: number) => {
  await api.delete('/user/currency', { currencyId });
};
