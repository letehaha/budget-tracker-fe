<script lang="ts" setup>
import * as Drawer from "@/components/lib/ui/drawer";
import { defineAsyncComponent, ref } from "vue";

const DialogContent = defineAsyncComponent(() => import("./dialog-content.vue"));

const isOpen = ref(false);
</script>

<template>
  <Drawer.Drawer v-model:open="isOpen">
    <Drawer.DrawerTrigger class="w-full" as-child>
      <slot />
    </Drawer.DrawerTrigger>
    <Drawer.DrawerContent custom-indicator>
      <DialogContent />
    </Drawer.DrawerContent>
  </Drawer.Drawer>
</template>
