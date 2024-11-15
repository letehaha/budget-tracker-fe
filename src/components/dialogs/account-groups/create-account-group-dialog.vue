<script setup lang="ts">
import { computed, ref } from "vue";
import * as Dialog from "@/components/lib/ui/dialog";
import InputField from "@/components/fields/input-field.vue";
import UiButton from "@/components/lib/ui/button/Button.vue";
import { createAccountsGroup } from "@/api/account-groups";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { AccountGroups } from "@/common/types/models";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";

const queryClient = useQueryClient();
const form = ref({
  name: "",
});

const isOpen = ref(false);

const { isPending: isMutating, mutate } = useMutation({
  mutationFn: createAccountsGroup,
  onSuccess: (data) => {
    queryClient.setQueryData<AccountGroups[]>(["account-groups"], (old) => [...old, ...data]);
    queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.accountGroups });
    isOpen.value = false;
    form.value.name = "";
  },
});
const isSubmitDisabled = computed(() => isMutating.value || !form.value.name);

const createGroup = async () => {
  await mutate({ name: form.value.name });
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
        <Dialog.DialogTitle>Create group</Dialog.DialogTitle>
      </Dialog.DialogHeader>

      <form class="mt-4" @submit="createGroup">
        <InputField v-model="form.name" label="Group name" placeholder="Investments" />

        <div class="flex">
          <UiButton class="mt-3 ml-auto" :disabled="isSubmitDisabled"> Create </UiButton>
        </div>
      </form>
    </Dialog.DialogContent>
  </Dialog.Dialog>
</template>
