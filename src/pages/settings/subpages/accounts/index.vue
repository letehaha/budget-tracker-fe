<!-- eslint-disable vue/max-len -->
<template>
  <div class="flex flex-col gap-4 max-w-[50%]">
    <Card
      v-for="(group, index) in accountGroups"
      :key="group.id"
      class="p-4 flex flex-col gap-4 border rounded-lg shadow-sm transition-all duration-300 cursor-pointer"
      @click.prevent="toggleActiveItem(group, index)"
    >
      <div class="flex items-center justify-between">
        <h2>{{ group.name }}</h2>

        <div class="flex justify-between items-center w-[130px]">
          <Popover.Popover
            :open="openPopovers[index]"
            @update:open="(value) => togglePopover(index, value)"
          >
            <Popover.PopoverTrigger as-child>
              <Button
                variant="secondary"
                size="sm"
                @click.stop="togglePopover(index, true, group.name)"
                >Edit</Button
              >
            </Popover.PopoverTrigger>
            <Popover.PopoverContent>
              <form class="grid gap-6" @submit.prevent="updateGroup(group, index)">
                <InputField
                  v-model="activePopoverName"
                  label="Account name"
                  placeholder="Account name"
                />

                <Button type="submit" :disabled="group.name === activePopoverName"> Save </Button>
              </form>
            </Popover.PopoverContent>
          </Popover.Popover>

          <AlertDialog
            title="Do you want to delete this account group?"
            :accept-disabled="false"
            accept-variant="destructive"
            @accept="deleteAccount(group)"
          >
            <template #trigger>
              <Button variant="destructive" size="sm" @click.stop="toggleDelete(group)">
                Delete
              </Button>
            </template>
            <template #description>
              <div v-if="deletedElements.length">
                <div class="text-sm mb-2">Before delete these accounts will be disconnected</div>
                <div v-for="item in deletedElements" :key="item.id" class="text-sm px-4 py-2">
                  - {{ item.name }}
                </div>
              </div>
            </template>
          </AlertDialog>
        </div>
      </div>

      <div v-if="activeItemIndex === index">
        <template v-for="account in group.accounts" :key="account.id">
          <AccountItem :account="account" />
        </template>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { deleteAccountGroup, loadAccountGroups, updateAccountGroup } from "@/api/account-groups";
import { AccountGroups } from "@/common/types/models";
import { Card } from "@/components/lib/ui/card";
import { AlertDialog } from "@/components/common";
import { InputField } from "@/components/fields";
import * as Popover from "@/components/lib/ui/popover";
import Button from "@/components/lib/ui/button/Button.vue";
import AccountItem from "@/components/sidebar/accounts-view/accounts-item.vue";
import { AccountModel } from "shared-types";
import { useNotificationCenter } from "@/components/notification-center";

type ActiveItemIndex = number;

const { data: accountGroups } = useQuery({
  queryFn: () => loadAccountGroups(),
  queryKey: VUE_QUERY_CACHE_KEYS.accountGroups,
  staleTime: Infinity,
  placeholderData: [],
});

const activeItemIndex = ref<ActiveItemIndex>(null);
const selectedGroup = ref<AccountGroups>(null);
const openPopovers = ref<Record<number, boolean>>({});
const activePopoverName = ref<string>("");
const deletedElements = ref<AccountModel[]>(null);
const queryClient = useQueryClient();

const { addSuccessNotification } = useNotificationCenter();

const toggleActiveItem = (group: AccountGroups, index: ActiveItemIndex) => {
  activeItemIndex.value = activeItemIndex.value === index ? null : index;
  selectedGroup.value = group;
};

const togglePopover = (index: ActiveItemIndex, value: boolean, name?: string) => {
  openPopovers.value[index] = value;
  if (name) {
    activePopoverName.value = name;
  }
};

const toggleDelete = (group: AccountGroups) => {
  deletedElements.value = group.accounts;
};

const { mutate: updateGroupMutation } = useMutation({
  mutationFn: updateAccountGroup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.accountGroups });
  },
});

const updateGroup = async (group: AccountGroups, index: ActiveItemIndex) => {
  const newName = activePopoverName.value.trim();

  if (newName && group.name !== newName) {
    await updateGroupMutation({
      groupId: group.id,
      updates: { name: newName },
    });
    togglePopover(index, false);
  }
};

const { mutate: deleteAccountMutation } = useMutation({
  mutationFn: deleteAccountGroup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.accountGroups });
    addSuccessNotification("Group was been deleted");
  },
});

const deleteAccount = async (group: AccountGroups) => {
  await deleteAccountMutation({
    userId: group.userId,
    groupId: group.id,
  });
};
</script>
