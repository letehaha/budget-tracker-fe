import {
  ref,
  computed,
  WritableComputedRef,
} from 'vue';
import { defineStore } from 'pinia';
import { CategoryModel } from 'shared-types';
import { loadSystemCategories } from '@/api';
import { getRawCategories } from './helpers';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<CategoryModel[]>([]);
  const rawCategories = ref<CategoryModel[]>([]);
  const categoriesMap = computed<Record<number, CategoryModel>>(
    () => rawCategories.value.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {}),
  );

  const loadCategories = async () => {
    try {
      const result = await loadSystemCategories();

      categories.value = result;
      rawCategories.value = getRawCategories(result);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const getCategoryTypeById: WritableComputedRef<
    (id: number) => CategoryModel
  > = computed(
    () => (id: number) => rawCategories.value.find(item => item.id === id),
  );

  return {
    categories,
    categoriesMap,
    rawCategories,
    loadCategories,
    getCategoryTypeById,
  };
});
