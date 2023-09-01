<template>
  <template v-if="categoryColor">
    <div
      class="category-circle"
      :style="{
        backgroundColor: category.color,
      }"
    />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { CategoryModel } from 'shared-types';
import { useCategoriesStore } from '@/stores';

const props = defineProps<{
  category?: CategoryModel;
  categoryId?: number;
}>();

const { categoriesMap } = storeToRefs(useCategoriesStore());

const categoryColor = computed(() => {
  if (props.category) return props.category.color;
  if (props.categoryId) return categoriesMap.value[props.categoryId]?.color;
  return null;
});
</script>

<style lang="scss">
.category-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>
