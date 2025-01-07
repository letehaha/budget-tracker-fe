<template>
  <div class="grid gap-4 grid-cols-[repeat(2,minmax(0,450px))]">
    <Card class="py-4 px-2 max-w-[450px]">
      <div class="flex justify-center relative mb-4 py-2 px-4">
        <Button
          v-if="selectedCategory"
          variant="ghost"
          class="absolute left-2 top-0 gap-1 group"
          @click="goBack"
        >
          <ChevronLeftIcon class="group-hover:-translate-x-0.5 transition-transform size-4" />

          Back
        </Button>

        <h3 class="text-lg font-semibold">
          {{ selectedCategory ? "View Category" : "All Categories" }}
        </h3>

        <Button
          v-if="selectedCategory"
          class="absolute right-2 top-0 min-w-[80px] gap-2"
          variant="secondary"
          @click="startEditing"
        >
          Edit

          <PencilIcon class="size-3" />
        </Button>
      </div>

      <template v-if="selectedCategory">
        <div class="p-4 pt-0 grid gap-2 my-6 border-b">
          <div class="flex justify-between">
            <span class="opacity-70">Name:</span>

            {{ selectedCategory.name }}
          </div>
        </div>

        <h4 class="text-xs ml-4 uppercase">Subcategories</h4>
      </template>

      <div class="grid gap-2 mt-4 px-4 text-center">
        <template v-if="currentLevel.length">
          <template v-for="cat in currentLevel" :key="cat.id">
            <Button
              class="grid grid-cols-[1fr,min-content] gap-8 -ml-4 w-[calc(100%+32px)]"
              variant="ghost"
              :disabled="categoryLevelCount >= MAX_CATEGORIES_NESTING - 1"
              @click="selectCategory(cat)"
            >
              <div class="flex items-center gap-2">
                <CategoryCircle :category="cat" />

                {{ cat.name }}
              </div>
              <span
                v-if="categoryLevelCount < MAX_CATEGORIES_NESTING - 1"
                class="text-sm w-max opacity-70 flex gap-2"
              >
                <span>View</span>
                <span>></span>
              </span>
            </Button>
          </template>
        </template>
        <template v-else>
          <div>No subcategories</div>
        </template>
      </div>

      <div v-if="categoryLevelCount < MAX_CATEGORIES_NESTING - 1" class="px-4 mt-6 text-center">
        <Button type="button" class="w-full" variant="secondary" @click="startCreating">
          Add subcategory +
        </Button>
      </div>
    </Card>

    <template v-if="isFormVisible">
      <Card as="form" class="py-4 px-2 max-w-[450px]" @submit.prevent="applyChanges">
        <div class="flex justify-center relative mb-4 py-2 px-4">
          <Button variant="ghost" class="p-2 absolute left-2 top-0 text-primary" @click="closeForm">
            Cancel
          </Button>

          <h3 class="text-lg font-semibold">
            {{ isEditing ? "Edit Category" : "Create Category" }}
          </h3>

          <Button type="submit" class="absolute right-2 top-0">Save</Button>
        </div>

        <div class="px-4 mt-12">
          <InputField v-model="form.name" label="Category name" placeholder="Category name" />
        </div>

        <template v-if="isEditing">
          <div class="px-4 mt-12">
            <Button variant="destructive" @click="deleteCategory"> Delete category </Button>
          </div>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, reactive } from "vue";
import { API_ERROR_CODES } from "shared-types";
import { useCategoriesStore } from "@/stores";
import { editCategory, createCategory, deleteCategory as apiDeleteCategory } from "@/api";
import { useNotificationCenter } from "@/components/notification-center";
import CategoryCircle from "@/components/common/category-circle.vue";
import InputField from "@/components/fields/input-field.vue";
import { type FormattedCategory } from "@/common/types";
import { ApiErrorResponseError } from "@/js/errors";
import { removeNullishValues } from "@/common/utils/remove-keys";
import { Card } from "@/components/lib/ui/card";
import { Button } from "@/components/lib/ui/button";
import { ChevronLeftIcon, PencilIcon } from "lucide-vue-next";

defineOptions({
  name: "settings-categories",
});
const categoriesStore = useCategoriesStore();
const MAX_CATEGORIES_NESTING = 3;

const { addErrorNotification, addSuccessNotification } = useNotificationCenter();
const { formattedCategories } = storeToRefs(categoriesStore);
const currentLevel = ref<FormattedCategory[]>(formattedCategories.value);
const selectedCategory = ref<FormattedCategory | null>(null);
const categoryLevelCount = ref<number>(0);

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
  categoryLevelCount.value = 0;
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
      type InputParams = Parameters<typeof createCategory>[0];

      let params: InputParams = { name: form.name };

      if (selectedCategory.value) {
        params = removeNullishValues({
          ...params,
          imageUrl: selectedCategory.value.imageUrl,
          color: selectedCategory.value.color,
          parentId: selectedCategory.value.id,
        }) as InputParams;
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
  if (categoryLevelCount.value >= MAX_CATEGORIES_NESTING - 1) return;
  closeForm();
  selectedCategory.value = category;

  if (category.subCategories) {
    categoryLevelCount.value++;
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
