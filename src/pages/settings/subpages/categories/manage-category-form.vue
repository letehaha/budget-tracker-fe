<template>
  <div class="manage-category-form">
    <InputField
      v-model="form.name"
      label="Edit name"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { CategoryModel } from 'shared-types';
import InputField from '@/components/fields/input-field.vue';

const props = defineProps<{
  category: CategoryModel;
}>();

const form = reactive({
  name: props.category.name,
});
</script>
