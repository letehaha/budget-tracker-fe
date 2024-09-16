<template>
  <div class="layout-header">
    <div class="layout-header__actions">
      <div class="layout-header__action">
        <ui-button variant="default" size="lg" @click="openFormModal"> New Transaction </ui-button>
      </div>
    </div>

    <div class="flex items-center gap-2 ml-auto">
      <ui-button variant="ghost" size="icon" @click="toggleTheme">
        <template v-if="currentTheme === Themes.dark">
          <MoonStar :size="20" />
        </template>
        <template v-else>
          <Sun :size="20" />
        </template>
      </ui-button>

      <ui-tooltip
        :content="!isAllowedToSyncFinancialData ? 'You can sync data only once in 30 mins' : ''"
        position="bottom"
        class="layout-header__sync-status-wrapper"
      >
        <ui-button
          variant="ghost"
          class="flex items-center gap-2"
          size="sm"
          :disabled="!isAllowedToSyncFinancialData"
          @click="syncFinancialDataHandler"
        >
          <template v-if="isSyncing">
            <RefreshCcw />
            <span class="layout-header__sync-status-text">Synchronizing...</span>
          </template>
          <template v-else>
            <CheckCircle :size="14" class="text-green-700" />
            <span class="layout-header__sync-status-text">Synchronized</span>
          </template>
        </ui-button>
      </ui-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRootStore } from "@/stores";
import { MODAL_TYPES, useModalCenter } from "@/components/modal-center/index";
import UiTooltip from "@/components/common/tooltip.vue";
import { toggleTheme, currentTheme, Themes } from "@/common/utils";
import UiButton from "@/components/lib/ui/button/Button.vue";
import { MoonStar, Sun, CheckCircle, RefreshCcw } from "lucide-vue-next";

const { addModal } = useModalCenter();
const rootStore = useRootStore();
const { isAppInitialized, isFinancialDataSyncing, isAllowedToSyncFinancialData } =
  storeToRefs(rootStore);

const isSyncing = computed(() => !isAppInitialized.value || isFinancialDataSyncing.value);

const openFormModal = () => {
  addModal({ type: MODAL_TYPES.createRecord });
};
const syncFinancialDataHandler = () => {
  if (isAllowedToSyncFinancialData.value) {
    rootStore.syncFinancialData();
  }
};
</script>

<style lang="scss">
.layout-header {
  padding: 12px 24px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--app-border-default);
  max-height: var(--header-height);
}
.layout-header__actions {
  @apply flex items-center;
}
.layout-header__action {
  margin-right: 16px;
}
.layout-header__to-left {
  margin-left: auto;
  display: flex;
}
.layout-header__sync-status-wrapper {
  .ui-tooltip__content-wrapper {
    left: 30%;
  }
}
.layout-header__sync-status--syncing {
  svg {
    animation-name: keyframes-rotate;
    animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-timing-function: linear;
  }
}
.layout-header__sync-status-text {
  font-weight: 500;
}
</style>
