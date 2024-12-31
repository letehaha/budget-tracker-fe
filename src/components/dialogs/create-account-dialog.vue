<script setup lang="ts">
import { ref } from "vue";
import { isMobileSheetOpen } from "@/composable/global-state/mobile-sheet";

import CreateAccountForm from "@/components/forms/create-account-form.vue";
import ResponsiveDialog from "@/components/common/responsive-dialog.vue";

const emit = defineEmits(["created"]);

const isOpen = ref(false);

const onAccountCreation = () => {
  isOpen.value = false;
  isMobileSheetOpen.value = false;
  emit("created");
};
</script>

<template>
  <ResponsiveDialog v-model:open="isOpen">
    <template #trigger>
      <slot />
    </template>

    <template #title> Create account </template>

    <CreateAccountForm @created="onAccountCreation" />
  </ResponsiveDialog>
</template>
