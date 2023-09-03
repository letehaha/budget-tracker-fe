import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { CategoryModel } from 'shared-types';
import { loadSystemCategories } from '@/api';
import { type FormattedCategory } from '@/common/types';
import { useNotificationCenter } from '@/components/notification-center';
import { buildCategiesObjectGraph } from './helpers';

export const useCategoriesStore = defineStore('categories', () => {
  const notificationStore = useNotificationCenter();

  const categories = ref<CategoryModel[]>([]);

  const loadCategories = async () => {
    try {
      const result = await loadSystemCategories();

      if (result?.length) categories.value = result;
    } catch (err) {
      notificationStore.addErrorNotification('Cannot load categories');
    }
  };

  const formattedCategories = computed<FormattedCategory[]>(
    () => buildCategiesObjectGraph(categories.value),
  );
  const categoriesMap = computed<Record<number, CategoryModel>>(
    () => categories.value.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {}),
  );

  return {
    categories,
    categoriesMap,
    formattedCategories,
    loadCategories,
  };
});
