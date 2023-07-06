import { CategoryModel } from 'shared-types';
import { api } from '@/api/_api';

export const loadSystemCategories = async (): Promise<CategoryModel[]> => {
  const result = await api.get('/categories');

  return result;
};
