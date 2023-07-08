import {
  ref,
  Ref,
  computed,
  WritableComputedRef,
} from 'vue';
import { defineStore } from 'pinia';
import { CategoryModel } from 'shared-types';
import { loadSystemCategories } from '@/api';
import { getRawCategories } from './helpers';

export const useCategoriesStore = defineStore('categories', () => {
  const categories: Ref<CategoryModel[]> = ref([]);
  const rawCategories: Ref<CategoryModel[]> = ref([]);

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
    rawCategories,
    loadCategories,
    getCategoryTypeById,
  };
});
