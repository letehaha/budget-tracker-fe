<template>
  <div class="overflow-x-auto">
    <table v-if="accountGroups.length" class="min-w-full w-full bg-card rounded-md divide-y">
      <thead class="">
        <tr>
          <th
            v-for="(header, index) in tableHeaders"
            :key="header"
            scope="col"
            :class="[
              'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
              index === tableHeaders.length - 1 ? 'text-right' : 'text-left',
            ]"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray">
        <template v-for="(group, index) in accountGroups" :key="group.id">
          <tr
            :class="[
              'hover:bg-accent hover:text-accent-foreground',
              group.accounts.length && 'cursor-pointer',
            ]"
            @click="
              () => {
                if (group.accounts.length) toggleActiveItem(group, index);
              }
            "
          >
            <td
              :class="[
                'px-4 py-2 w-[40%]',
                accountGroups.length === 1
                  ? 'rounded-bl-md'
                  : index === accountGroups.length - 1
                    ? 'rounded-bl-md'
                    : '',
              ]"
            >
              <div class="flex items-center gap-3">
                <div class="size-4">
                  <template v-if="group.accounts.length">
                    <ChevronRight
                      :class="[
                        'size-4 opacity-50 shrink-0',
                        { 'rotate-90': activeItemIndex === index },
                      ]"
                    />
                  </template>
                </div>
                <div>
                  <template v-if="openNameEditor[index]">
                    <InputField v-model="activeEditName" placeholder="Account name" @click.stop />
                  </template>
                  <template v-else>
                    <div class="">{{ group.name }}</div>
                  </template>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">{{ group.accounts.length }}</td>
            <td
              :class="[
                'px-6 py-4 text-right space-x-4',
                accountGroups.length === 1
                  ? 'rounded-br-md'
                  : index === accountGroups.length - 1
                    ? 'rounded-br-md'
                    : '',
              ]"
            >
              <Button
                v-if="openNameEditor[index]"
                variant="default"
                size="sm"
                :aria-label="'Save'"
                @click.stop="updateGroup(group, index)"
              >
                Save
              </Button>
              <Button
                v-else
                variant="default"
                size="sm"
                :aria-label="'Edit'"
                @click.stop="toggleGroupNameEdit(index, group)"
              >
                Edit
              </Button>

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
                    <div class="text-sm mb-2">
                      Before delete these accounts will be disconnected
                    </div>
                    <div v-for="item in deletedElements" :key="item.id" class="text-sm px-4 py-2">
                      - {{ item.name }}
                    </div>
                  </div>
                </template>
              </AlertDialog>
            </td>
          </tr>

          <tr v-if="activeItemIndex === index">
            <td colspan="3" class="p-4">
              <table v-if="group.accounts.length" class="min-w-full">
                <thead>
                  <tr>
                    <th
                      v-for="(header, underTableIndex) in underTableHeaders"
                      :key="header"
                      scope="col"
                      :class="[
                        'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                        underTableIndex === underTableHeaders.length - 1
                          ? 'text-right'
                          : 'text-left',
                      ]"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="account in group.accounts"
                    :key="account.id"
                    class="cursor-pointer rounded-xl hover:bg-accent hover:text-accent-foreground"
                  >
                    <td class="px-8 py-2 w-[40%] rounded-l-md">{{ account.name }}</td>
                    <td class="px-4 py-2">
                      {{ formatAmountByCurrencyId(account.currentBalance, account.currencyId) }}
                    </td>
                    <td class="px-4 py-2 space-x-2 text-right rounded-r-md">
                      <div class="flex items-center justify-end space-x-3">
                        <router-link
                          :to="{ name: ROUTES_NAMES.account, params: { id: account.id } }"
                        >
                          <Button size="sm" variant="default">
                            <SquareArrowOutUpRight :size="20" />
                          </Button>
                        </router-link>
                        <Button
                          size="sm"
                          :disabled="isFormPending"
                          variant="destructive"
                          @click="unlinkAccountFromGroup(account.id)"
                        >
                          Ungroup
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else>
                <div class="text-center">No accounts data</div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-else>
      <div class="min-w-full w-full bg-card rounded-md px-6 py-4 text-center">
        No group account data
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import {
  deleteAccountGroup,
  loadAccountGroups,
  updateAccountGroup,
  removeAccountFromGroup,
} from "@/api/account-groups";
import { AccountGroups } from "@/common/types/models";
import { AlertDialog } from "@/components/common";
import { InputField } from "@/components/fields";
import Button from "@/components/lib/ui/button/Button.vue";
import { AccountModel } from "shared-types";
import { useNotificationCenter } from "@/components/notification-center";
import { useFormatCurrency } from "@/composable";
import { SquareArrowOutUpRight, ChevronRight } from "lucide-vue-next";
import { ROUTES_NAMES } from "@/routes";

type ActiveItemIndex = number;

const activeItemIndex = ref<ActiveItemIndex>(null);
const selectedGroup = ref<AccountGroups>(null);
const activeEditName = ref<string>("");
const openNameEditor = ref<Record<number, boolean>>({});
const toggledListItem = ref([]);
const deletedElements = ref<AccountModel[]>(null);
const queryClient = useQueryClient();
const toggledAccountId = ref<number>();
const { formatAmountByCurrencyId } = useFormatCurrency();
const tableHeaders = ["Group Name", "Connected Accounts", "Actions"];
const underTableHeaders = ["Account Name", "Balance", "Actions"];

const { addSuccessNotification } = useNotificationCenter();

const { data: accountGroups } = useQuery({
  queryFn: () => loadAccountGroups(),
  queryKey: VUE_QUERY_CACHE_KEYS.accountGroups,
  staleTime: Infinity,
  placeholderData: [],
});

const { mutate: updateGroupMutation } = useMutation({
  mutationFn: updateAccountGroup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.accountGroups });
  },
});

const { isPending: isUnlinkingAccount, mutate: unlinkAccount } = useMutation({
  mutationFn: removeAccountFromGroup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.accountGroups });
  },
});

const { mutate: deleteAccountMutation } = useMutation({
  mutationFn: deleteAccountGroup,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: VUE_QUERY_CACHE_KEYS.accountGroups });
    addSuccessNotification("Group was been deleted");
  },
});

const isFormPending = computed(() => isUnlinkingAccount.value);

const toggleActiveItem = (group: AccountGroups, index: ActiveItemIndex) => {
  toggledListItem[index] = index;
  activeItemIndex.value = activeItemIndex.value === index ? null : index;
  selectedGroup.value = group;
  toggledListItem[index] = !toggledListItem[index];
};

const toggleGroupNameEdit = (index: ActiveItemIndex, group: AccountGroups) => {
  openNameEditor.value[index] = true;
  activeEditName.value = group.name;
};

const toggleDelete = (group: AccountGroups) => {
  deletedElements.value = group.accounts;
};

const updateGroup = async (group: AccountGroups, index: ActiveItemIndex) => {
  const newName = activeEditName.value.trim();

  if (newName && group.name !== newName) {
    await updateGroupMutation({
      groupId: group.id,
      updates: { name: newName },
    });
  }
  openNameEditor.value[index] = false;
  activeItemIndex.value = null;
};

const deleteAccount = async (group: AccountGroups) => {
  await deleteAccountMutation({
    userId: group.userId,
    groupId: group.id,
  });
};

const unlinkAccountFromGroup = (id: number) => {
  toggledAccountId.value = id;
  if (selectedGroup.value) {
    unlinkAccount({ accountIds: [id], groupId: selectedGroup.value.id });
  }
};
</script>
