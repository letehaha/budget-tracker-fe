<template>
  <section class="p-6">
    <accounts-list />

    <div class="flex items-center justify-center gap-1 my-6">
      <ui-button size="icon" variant="ghost" @click="selectPrevPeriod">
        <ChevronLeft :size="20" />
      </ui-button>

      <div class="dashboard-page__period">
        {{ periodSelectorText }}
      </div>

      <ui-button
        size="icon"
        variant="ghost"
        :disabled="isCurrentPeriodSameMonth"
        @click="selectNextPeriod"
      >
        <ChevronRight :size="20" />
      </ui-button>
    </div>

    <div class="dashboard-page__info">
      <BalanceTrendWidget :selected-period="currentPeriod" class="dashboard-page__balance-trend" />
      <SpendingCategoriesWidget
        :selected-period="currentPeriod"
        class="dashboard-page__spending-categories"
      />
      <LatestRecordsWidget class="dashboard-page__latest-records" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from "vue";
import {
  subDays,
  isSameMonth,
  addMonths,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import UiButton from "@/components/lib/ui/button/Button.vue";
import AccountsList from "./accounts-list/accounts-list.vue";

const BalanceTrendWidget = defineAsyncComponent(
  () => import("@/components/widgets/balance-trend.vue"),
);
const LatestRecordsWidget = defineAsyncComponent(
  () => import("@/components/widgets/latest-records.vue"),
);
const SpendingCategoriesWidget = defineAsyncComponent(
  () => import("@/components/widgets/expenses-structure.vue"),
);

defineOptions({
  name: "page-dashboard",
});

const currentDayInMonth = new Date().getDate();

const currentPeriod = ref({
  from: subDays(new Date(), currentDayInMonth - 1),
  to: new Date(),
});

const isCurrentPeriodSameMonth = computed(() => isSameMonth(new Date(), currentPeriod.value.to));
const periodSelectorText = computed(() => {
  if (isCurrentPeriodSameMonth.value) return "Current Month";

  const from = format(currentPeriod.value.from, "dd MMM");
  const to = format(currentPeriod.value.to, "dd MMM");

  return `${from} - ${to}`;
});

const selectPrevPeriod = () => {
  const from = startOfMonth(subMonths(currentPeriod.value.from, 1));
  const to = endOfMonth(subMonths(currentPeriod.value.to, 1));
  currentPeriod.value = { from, to };
};
const selectNextPeriod = () => {
  const from = startOfMonth(addMonths(currentPeriod.value.from, 1));
  let to = endOfMonth(addMonths(currentPeriod.value.to, 1));

  if (isSameMonth(new Date(), to)) to = new Date();

  currentPeriod.value = { from, to };
};
</script>

<style lang="scss">
.dashboard-page__info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) 420px;
  grid-template-areas: "balance-trend spending-categories latest-records";
  grid-gap: 24px;

  @include below(1300) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-areas: "balance-trend spending-categories" "latest-records latest-records";
  }
  @include below(900) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "balance-trend" "spending-categories" "latest-records";
  }
}
.dashboard-page__charts {
  color: var(--app-on-surface-color);
}
.dashboard-page__balance-trend {
  grid-area: balance-trend;
}
.dashboard-page__latest-records {
  grid-area: latest-records;

  @include over(900) {
    max-width: 420px;
  }
}
.dashboard-page__spending-categories {
  grid-area: spending-categories;
}
.dashboard-page__period {
  @apply w-[150px] text-center;
}
</style>
