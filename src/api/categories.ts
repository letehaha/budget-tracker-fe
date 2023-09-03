import { CategoryModel, endpointsTypes } from 'shared-types';
import { api } from '@/api/_api';

export const loadSystemCategories = async (): Promise<CategoryModel[]> => {
  const result = await api.get('/categories');

  return result;
};

export const createCategory = async (
  params: endpointsTypes.CreateCategoryBody,
): Promise<endpointsTypes.CreateCategoryResponse> => {
  const result = await api.post('/categories', params);

  return result;
};

export const editCategory = async (
  {
    categoryId,
    ...params
  }: endpointsTypes.EditCategoryBody & { categoryId: number },
): Promise<endpointsTypes.EditCategoryResponse> => {
  const result = await api.put(`/categories/${categoryId}`, params);

  return result;
};
