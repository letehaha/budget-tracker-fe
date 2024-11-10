<script setup lang="ts">
import { AccountModel } from "shared-types";
import { EditIcon } from "lucide-vue-next";
import UiButton from "@/components/lib/ui/button/Button.vue";
import LinkAccountGroup from "@/components/dialogs/account-groups/link-account-group-dialog.vue";
import { useAccountGroupForAccount } from "@/composable/data-queries/account-groups";

const props = defineProps<{
  account: AccountModel;
}>();

const { data } = useAccountGroupForAccount({ accountId: props.account.id });
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <span> Account group: </span>

    <div class="flex items-center gap-2">
      <template v-if="data">
        {{ data.name }}
      </template>
      <template v-else>
        <span> Not associated </span>
      </template>
      <LinkAccountGroup :account="account">
        <UiButton size="icon" variant="secondary">
          <span class="flex gap-3 items-center">
            <EditIcon class="size-5" />
          </span>
        </UiButton>
      </LinkAccountGroup>
    </div>
  </div>
</template>
