<script setup lang="ts">
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores";
import { ROUTES_NAMES } from "@/routes";
import { LogOutIcon } from "lucide-vue-next";
import UiButton from "@/components/lib/ui/button/Button.vue";

const router = useRouter();
const { logout } = useAuthStore();

const logOutHandler = () => {
  logout();
  router.push({ name: ROUTES_NAMES.signIn });
};
</script>

<template>
  <ui-button
    variant="secondary"
    class="justify-start w-full px-3 gap-2 mt-auto"
    @click="logOutHandler"
  >
    <LogOutIcon />
    <span> Logout </span>
  </ui-button>
</template>
