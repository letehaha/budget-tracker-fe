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
          {{ "<" }}
          Back
        </button>

        <h3 class="categories-page__title">
          {{ selectedCategory ? "View Category" : "All Categories" }}
        </h3>

        <button
          v-if="selectedCategory"
          type="button"
          class="categories-page__category-edit"
          @click="startEditing"
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
          <template v-for="cat in currentLevel" :key="cat.id">
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
          <div>No subcategories</div>
        </template>
      </div>

      <div class="categories-page__add-subcategory">
        <button type="button" @click="startCreating">Add subcategory +</button>
      </div>
    </div>
    <template v-if="isFormVisible">
      <form class="categories-page__card" @submit.prevent="applyChanges">
        <div class="categories-page__header">
          <button
            type="button"
            class="categories-page__categories-back"
            @click="closeForm"
          >
            Cancel
          </button>

          <h3 class="categories-page__title">
            {{ isEditing ? "Edit Category" : "Create Category" }}
          </h3>

          <button type="submit" class="categories-page__category-edit">
            Save
          </button>
        </div>

        <div class="categories-page__fields">
          <InputField
            v-model="form.name"
            label="Category name"
            placeholder="Category name"
          />
        </div>
        <template v-if="isEditing">
          <div class="categories-page__form-actions">
            <UiButton theme="danger" @click="deleteCategory"> Delete </UiButton>
          </div>
        </template>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, reactive } from "vue";
import { API_ERROR_CODES } from "shared-types";
import { useCategoriesStore } from "@/stores";
import {
  editCategory,
  createCategory,
  deleteCategory as apiDeleteCategory,
} from "@/api";
import { useNotificationCenter } from "@/components/notification-center";
import CategoryCircle from "@/components/common/category-circle.vue";
import InputField from "@/components/fields/input-field.vue";
import UiButton from "@/components/common/ui-button.vue";
import { type FormattedCategory } from "@/common/types";
import { ApiErrorResponseError } from "@/js/errors";

defineOptions({
  name: "settings-categories",
});
const categoriesStore = useCategoriesStore();

const { addErrorNotification, addSuccessNotification } =
  useNotificationCenter();
const { formattedCategories } = storeToRefs(categoriesStore);
const currentLevel = ref<FormattedCategory[]>(formattedCategories.value);
const selectedCategory = ref<FormattedCategory | null>(null);

const form = reactive({
  name: "",
});
const isFormVisible = ref(false);
const isEditing = ref(false);
const isCreating = ref(false);
const closeForm = () => {
  isEditing.value = false;
  isCreating.value = false;
  isFormVisible.value = false;
  form.name = "";
};
const startEditing = () => {
  closeForm();
  if (selectedCategory.value) {
    form.name = selectedCategory.value.name;
  }
  isEditing.value = true;
  isFormVisible.value = true;
};
const startCreating = () => {
  closeForm();
  isCreating.value = true;
  isFormVisible.value = true;
};
const goBack = () => {
  closeForm();
  selectedCategory.value = null;
  currentLevel.value = formattedCategories.value;
};
const applyChanges = async () => {
  if (!selectedCategory.value) return;

  try {
    if (isEditing.value) {
      await editCategory({
        categoryId: selectedCategory.value.id,
        name: form.name,
      });
    } else if (isCreating.value) {
      let params: Parameters<typeof createCategory>[0] = {
        name: form.name,
        imageUrl: "",
        color: "",
      };
      if (selectedCategory.value) {
        params = {
          ...params,
          imageUrl: selectedCategory.value.imageUrl,
          color: selectedCategory.value.color,
          parentId: selectedCategory.value.id,
        };
      }
      await createCategory(params);
    }
    addSuccessNotification("Successfully updated!");
    await categoriesStore.loadCategories();
    goBack();
  } catch (err) {
    addErrorNotification("Unexpected error!");
  }
};
const selectCategory = (category: FormattedCategory) => {
  closeForm();
  selectedCategory.value = category;

  if (category.subCategories) {
    currentLevel.value = category.subCategories;
  }
};
const deleteCategory = async () => {
  try {
    await apiDeleteCategory({ categoryId: selectedCategory.value.id });

    await categoriesStore.loadCategories();
    addSuccessNotification("Successfully deleted!");
    goBack();
  } catch (err) {
    if (err instanceof ApiErrorResponseError) {
      if (err.data.code === API_ERROR_CODES.validationError) {
        addErrorNotification(err.data.message);
        return;
      }
    }
    addErrorNotification("Unexpected error. Category is not deleted.");
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
  transition: 0.2s ease-out;
  border-radius: 8px;

  &:hover {
    background-color: var(--abc-background-dark-400);
  }
}
.categories-page__category-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.categories-page__category-view {
  width: max-content;
  opacity: 0.7;
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
    opacity: 0.7;
  }
}
.categories-page__fields {
  padding: 0 16px;
  margin-top: 48px;
}
.categories-page__form-actions {
  padding: 0 16px;
  margin-top: 48px;
}
.categories-page__add-subcategory {
  padding: 0 16px;
  margin-top: 24px;
  text-align: center;
  color: var(--app-primary);

  button {
    padding: 8px 16px;
    border-radius: 8px;
  }
}
</style>
