<script setup lang="ts">
import { useRouter } from "vue-router";
import { AccountModel } from "shared-types";

import { useAccountsStore } from "@/stores";
import { ROUTES_NAMES } from "@/routes";

import * as Tabs from "@/components/lib/ui/tabs";
import { Separator } from "@/components/lib/ui/separator";
import { useNotificationCenter } from "@/components/notification-center";
import { Button } from "@/components/lib/ui/button";
import AccountDetailsTab from "@/pages/account/components/account-details-tab.vue";
import SettingToggleVisibility from "@/pages/account/components/setting-toggle-visibility.vue";

const props = defineProps<{
  account: AccountModel;
}>();
const router = useRouter();

const { addSuccessNotification, addErrorNotification } =
  useNotificationCenter();
const accountsStore = useAccountsStore();

const deleteAccount = async () => {
  const accountName = props.account.name;

  try {
    await accountsStore.deleteAccount({
      id: props.account.id,
    });

    addSuccessNotification(`Account ${accountName} removed successfully`);

    router.push({ name: ROUTES_NAMES.accounts });
  } catch (e) {
    addErrorNotification("An error occured while trying to delete account");
  }
};
</script>

<template>
  <Tabs.Tabs default-value="details">
    <Tabs.TabsList class="justify-start w-full mt-4">
      <Tabs.TabsTrigger value="details"> Details </Tabs.TabsTrigger>
      <Tabs.TabsTrigger value="settings"> Settings </Tabs.TabsTrigger>
    </Tabs.TabsList>

    <AccountDetailsTab tab-name="details" :account="account" />

    <Tabs.TabsContent value="settings" class="grid gap-4 py-6">
      <SettingToggleVisibility :account="account" />

      <div></div>

      <div
        class="grid gap-4 p-4 mt-4 -mx-4 border border-destructive rounded-xl"
      >
        <p class="text-xl font-medium">Danger zone</p>

        <Separator />

        <div class="flex items-center justify-between gap-2">
          <div>
            <p class="mb-2 font-bold">Delete this account</p>
            <p class="text-xs">
              Once you delete the account, there is no going back. <br />
              <b>All the transactions will be deleted.</b>
              Please be certain.
            </p>
          </div>

          <Button variant="destructive" @click="deleteAccount">
            Delete this account
          </Button>
        </div>
      </div>
    </Tabs.TabsContent>
  </Tabs.Tabs>
</template>
