<template>
  <div class="categories-page">
    <div class="categories-page__card">
      <div class="categories-page__header">
        <button
          v-if="selectedCategory"
          type="button"
          class="categories-page__categories-back"
          @click="goBack"
        >
          {{ '<' }}
          Back
        </button>

        <h3 class="categories-page__title">
          {{ selectedCategory ? 'View Category' : 'All Categories' }}
        </h3>

        <button
          v-if="selectedCategory"
          type="button"
          class="categories-page__category-edit"
          @click="enableEditing"
        >
          Edit
        </button>
      </div>

      <template v-if="selectedCategory">
        <div class="categories-page__details">
          <div class="categories-page__details-row">
            <span>Name:</span>

            {{ selectedCategory.name }}
          </div>
        </div>

        <h4 class="base-text-xsmall categories-page__subcategories-title">
          Subcategories
        </h4>
      </template>

      <div class="categories-page__list">
        <template v-if="currentLevel.length">
          <template
            v-for="cat in currentLevel"
            :key="cat.id"
          >
            <button
              class="categories-page__list-item"
              type="button"
              @click="selectCategory(cat)"
            >
              <div class="categories-page__category-info">
                <CategoryCircle :category="cat" />

                {{ cat.name }}
              </div>
              <span class="base-text-smaller categories-page__category-view">
                <span>View</span>
                <span>></span>
              </span>
            </button>
          </template>
        </template>
        <template v-else>
          <div>
            No subcategories
          </div>
        </template>
      </div>
    </div>
    <template v-if="isEditing">
      <form
        class="categories-page__card"
        @submit.prevent="applyChanges"
      >
        <div class="categories-page__header">
          <button
            type="button"
            class="categories-page__categories-back"
            @click="cancelEditing"
          >
            Cancel
          </button>

          <h3 class="categories-page__title">
            Edit Category
          </h3>

          <button
            type="submit"
            class="categories-page__category-edit"
          >
            Save
          </button>
        </div>

        <div class="categories-page__form">
          <InputField
            v-model="form.name"
            label="Category name"
          />
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { CategoryModel } from 'shared-types';
import { useCategoriesStore } from '@/stores';
import { editCategory } from '@/api';
import { useNotificationCenter } from '@/components/notification-center';
import CategoryCircle from '@/components/common/category-circle.vue';
import InputField from '@/components/fields/input-field.vue';
import { VUE_QUERY_CACHE_KEYS } from '@/common/const';

defineOptions({
  name: 'settings-categories',
});
const queryClient = useQueryClient();

const { addErrorNotification, addSuccessNotification } = useNotificationCenter();
const { categories } = storeToRefs(useCategoriesStore());
const currentLevel = ref<CategoryModel[]>(categories.value);
const selectedCategory = ref<CategoryModel>(null);

const form = reactive({
  name: null,
});
const isEditing = ref(false);
const enableEditing = () => {
  form.name = selectedCategory.value.name;

  isEditing.value = true;
};
const cancelEditing = () => {
  isEditing.value = false;
};
const goBack = () => {
  cancelEditing();
  selectedCategory.value = null;
  currentLevel.value = categories.value;
};
const applyChanges = async () => {
  try {
    await editCategory({
      categoryId: selectedCategory.value.id,
      name: form.name,
    });
    addSuccessNotification('Successfully updated!');
    await queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.categoriesList });
    goBack();
  } catch (err) {
    addErrorNotification('Unexpected error!');
  }
};
const selectCategory = (category: CategoryModel) => {
  cancelEditing();
  selectedCategory.value = category;

  if (category.subCategories) {
    currentLevel.value = category.subCategories;
  }
};
</script>

<style lang="scss">
.categories-page {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 450px));
  gap: 16px;
}
.categories-page__card {
  @include surface-container();
  padding: 16px 8px;

  max-width: 450px;
}
.categories-page__header {
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 16px;
  padding: 8px 16px;
}
.categories-page__title {
  @extend %heading-3;
}
.categories-page__list {
  display: grid;
  gap: 8px;
  margin-top: 16px;
  padding: 0 16px;
  text-align: center;
}
.categories-page__list-item {
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 1fr min-content;
  gap: 32px;
  cursor: pointer;
  margin-left: -16px;
  width: calc(100% + 32px);
  transition: .2s ease-out;
  border-radius: 8px;

  &:hover {
    background-color: var(--abc-background-dark-400);
  }
}
.categories-page__category-info {
  display: grid;
  grid-template-columns: min-content 1fr;
  align-items: center;
  gap: 8px;
}
.categories-page__category-view {
  width: max-content;
  opacity: .7;
  display: flex;
  gap: 8px;
}
.categories-page__subcategories-title {
  margin-left: 16px;
  text-transform: uppercase;
}
.categories-page__categories-back {
  padding: 8px;
  position: absolute;
  left: 8px;
  top: 0;
  color: var(--app-primary);
}
.categories-page__category-edit {
  padding: 8px;
  position: absolute;
  right: 8px;
  top: 0;
  color: var(--app-primary);
}
.categories-page__details {
  padding: 0 16px 16px;
  display: grid;
  gap: 4px;
  margin: 24px 0;
  border-bottom: 1px solid var(--abc-background-dark-400);
}
.categories-page__details-row {
  display: flex;
  justify-content: space-between;

  span {
    opacity: .7;
  }
}
.categories-page__form {
  padding: 0 16px;
  margin-top: 48px;
}
</style>
