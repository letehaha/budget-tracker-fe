import {
  ref,
  Ref,
  computed,
  WritableComputedRef,
} from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { CategoryRecord } from '@/js/records';
import { getRawCategories } from './helpers';

export const useCategoriesStore = defineStore('categories', () => {
  const categories: Ref<CategoryRecord[]> = ref([]);
  const rawCategories: Ref<CategoryRecord[]> = ref([]);

  const loadCategories = async () => {
    try {
      const result = await api.get('/categories');

      categories.value = result.map(i => new CategoryRecord(i));
      rawCategories.value = getRawCategories(result)
        .map(i => new CategoryRecord(i));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const getCategoryTypeById: WritableComputedRef<
    (id: number) => CategoryRecord
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
