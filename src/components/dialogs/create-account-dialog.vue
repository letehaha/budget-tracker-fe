<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import * as Dialog from "@/components/lib/ui/dialog";
import { isMobileSheetOpen } from "@/composable/global-state/mobile-sheet";

const CreateAccountForm = defineAsyncComponent(
  () => import("@/components/forms/create-account-form.vue"),
);

const emit = defineEmits(["created"]);

const isOpen = ref(false);

const onAccountCreation = () => {
  isOpen.value = false;
  isMobileSheetOpen.value = false;
  emit("created");
};
</script>

<template>
  <Dialog.Dialog v-model:open="isOpen" @update:open="isOpen = $event">
    <Dialog.DialogTrigger as-child>
      <slot />
    </Dialog.DialogTrigger>
    <Dialog.DialogContent
      class="sm:max-w-md max-h-[90dvh] grid-rows-[auto_auto_minmax(0,1fr)_auto]"
    >
      <Dialog.DialogHeader class="mb-4">
        <Dialog.DialogTitle>Create account</Dialog.DialogTitle>
      </Dialog.DialogHeader>

      <CreateAccountForm @created="onAccountCreation" />
    </Dialog.DialogContent>
  </Dialog.Dialog>
</template>
