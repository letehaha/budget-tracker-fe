<template>
  <div class="accounts">Accounts</div>
  <div v-for="group in accountGroups" :key="group.id">
    {{ group.name }}
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";
import { loadAccountGroups } from "@/api/account-groups";

const { data: accountGroups } = useQuery({
  queryFn: () => loadAccountGroups(),
  queryKey: VUE_QUERY_CACHE_KEYS.accountGroups,
  staleTime: Infinity,
  placeholderData: [],
});
</script>
