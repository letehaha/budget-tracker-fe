<script setup lang="ts">
import Button from "@/components/lib/ui/button/Button.vue";
import { EditIcon, Trash2Icon } from "lucide-vue-next";

import { loadSystemBudgets } from "@/api/budgets";
import { useQuery } from "@tanstack/vue-query";
import { VUE_QUERY_CACHE_KEYS } from "@/common/const";

import { deleteBudget as deleteBudgetApi } from "@/api";
import { useNotificationCenter } from "@/components/notification-center";
import { useRouter } from "vue-router";
import { ROUTES_NAMES } from "@/routes";
import { useCurrenciesStore } from "@/stores/currencies";

const { addErrorNotification } = useNotificationCenter();
const router = useRouter();
const { baseCurrency } = useCurrenciesStore();

const { data: budgetsList } = useQuery({
  queryFn: () => loadSystemBudgets(),
  queryKey: VUE_QUERY_CACHE_KEYS.budgetsList,
  staleTime: Infinity,
  placeholderData: [],
});

const toggleBudgetNameEdit = (budgetId: number) => {
  router.push({ name: ROUTES_NAMES.budgetsInfo, params: { id: budgetId } });
};

const deleteBudget = async (budgetId: number) => {
  try {
    await deleteBudgetApi(budgetId);
  } catch (err) {
    addErrorNotification("Unexpected error!");
  }
};
</script>

<template>
  <div class="mt-4">
    <div
      v-for="budget in budgetsList"
      :key="budget.id"
      class="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
    >
      <div class="flex flex-col gap-1">
        <div class="whitespace-nowrap text-ellipsis overflow-hidden w-min">
          Name: {{ budget.name }}
        </div>
        <div class="whitespace-nowrap text-ellipsis overflow-hidden w-min text-sm">
          Limit Amount: {{ budget.limitAmount }} {{ baseCurrency.currency.code }}
        </div>
      </div>
      <div class="flex justify-between items-center gap-2">
        <Button size="sm" @click="toggleBudgetNameEdit(budget.id)">
          <span class="@[360px]/budgets-list:inline"> Edit </span>
          <EditIcon class="size-4" />
        </Button>
        <Button size="sm" variant="destructive" @click="deleteBudget(budget.id)">
          <span class="@[360px]/budgets-list:inline"> Delete </span>
          <Trash2Icon class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
