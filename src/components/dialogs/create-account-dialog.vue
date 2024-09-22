<script setup lang="ts">
import { ref } from "vue";
import * as Dialog from "@/components/lib/ui/dialog";
import CreateAccountForm from "@/components/forms/create-account-form.vue";

const isOpen = ref(false);
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

      <CreateAccountForm @created="isOpen = false" />
    </Dialog.DialogContent>
  </Dialog.Dialog>
</template>
