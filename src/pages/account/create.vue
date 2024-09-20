<template>
  <div class="p-6">
    <CreateAccountForm class="max-w-[440px]" @created="pushToAccountsPage" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { ROUTES_NAMES } from "@/routes/constants";
import CreateAccountForm from "@/components/forms/create-account-form.vue";

const router = useRouter();
const pushToAccountsPage = () => {
  router.push({ name: ROUTES_NAMES.accounts });
};
</script>
