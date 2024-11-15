<script setup lang="ts">
import { Card, CardContent, CardHeader } from "@/components/lib/ui/card";
import NavigationLinks from "./navigation-links.vue";
import AccountsList from "./accounts-list.vue";
import LogounButton from "./logout-button.vue";
</script>

<template>
  <Card class="flex flex-col rounded-none">
    <CardHeader class="sm:py-3 h-[52px]">
      <div class="text-lg font-medium">
        <span class="hidden md:block"> BudgetTracker </span>
        <span class="md:hidden"> BT </span>
      </div>
    </CardHeader>
    <CardContent class="px-3 md:px-6 flex flex-col flex-grow max-h-[calc(100%-52px)]">
      <NavigationLinks />

      <AccountsList />

      <LogounButton />
    </CardContent>
  </Card>
</template>
