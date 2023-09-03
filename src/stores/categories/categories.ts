import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useQuery } from '@tanstack/vue-query';
import { CategoryModel } from 'shared-types';
import { loadSystemCategories } from '@/api';
import { VUE_QUERY_CACHE_KEYS } from '@/common/const';
import { useAuthStore } from '@/stores/auth';
import { getRawCategories } from './helpers';

export const useCategoriesStore = defineStore('categories', () => {
  const authStore = useAuthStore();
  const isLoggedIn = computed(() => !!authStore.isLoggedIn);

  const rawCategories = ref<CategoryModel[]>([]);
  const categoriesMap = computed<Record<number, CategoryModel>>(
    () => rawCategories.value.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {}),
  );

  const { data: categories } = useQuery({
    queryFn: loadSystemCategories,
    queryKey: VUE_QUERY_CACHE_KEYS.categoriesList,
    enabled: isLoggedIn,
    staleTime: Infinity,
    placeholderData: [],
  });

  watch(categories, value => {
    rawCategories.value = getRawCategories(value);
  });

  return {
    categories,
    categoriesMap,
    rawCategories,
  };
});
