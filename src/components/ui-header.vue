<template>
  <div class="layout-header">
    <div class="layout-header__actions">
      <div class="layout-header__action">
        <ui-button @click="openFormModal">
          New Record
        </ui-button>
      </div>
    </div>

    <div class="layout-header__to-left">
      <button
        type="button"
        class="layout-header__toggle-theme"
        @click="toggleTheme"
      >
        <template v-if="currentTheme === Themes.dark">
          <moon-icon />
        </template>
        <template v-else>
          <sun-icon />
        </template>
      </button>

      <ui-tooltip
        :content="!isAllowedToSyncFinancialData ? 'You can sync data only once in 30 mins' : ''"
        position="bottom"
        class="layout-header__sync-status-wrapper"
      >
        <button
          class="layout-header__sync-status"
          type="button"
          :class="{
            'layout-header__sync-status--syncing': isSyncing,
          }"
          :disabled="!isAllowedToSyncFinancialData"
          @click="syncFinancialDataHandler"
        >
          <template v-if="isSyncing">
            <refresh-icon />
            <span class="layout-header__sync-status-text">Synchronizing...</span>
          </template>
          <template v-else>
            <checkmark-in-circle-icon />
            <span class="layout-header__sync-status-text">Synchronized</span>
          </template>
        </button>
      </ui-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid';
import { useRootStore } from '@/stores';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';
import UiButton from '@/components/common/ui-button.vue';
import CheckmarkInCircleIcon from '@/assets/icons/checkmark-in-circle.svg?component';
import RefreshIcon from '@/assets/icons/refresh.svg?component';
import UiTooltip from '@/components/common/tooltip.vue';
import { toggleTheme, currentTheme, Themes } from '@/common/utils';

const { addModal } = useModalCenter();
const rootStore = useRootStore();
const {
  isAppInitialized,
  isFinancialDataSyncing,
  isAllowedToSyncFinancialData,
} = storeToRefs(rootStore);

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
  display: flex;
  align-items: center;
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
    left: 30%
  }
}
.layout-header__sync-status {
  display: grid;
  grid-template-columns: 14px 1fr;
  align-items: center;
  gap: 8px;
  font-size: 12px;

  padding: 8px 12px;
  transition: background-color .2s ease-out;
  border-radius: 6px;

  &[disabled] {
    cursor: not-allowed;
    opacity: .8;
  }

  &:not([disabled]):hover {
    background-color: rgba(0, 0, 0, .05);

    body.dark & {
      background-color: rgba(255, 255, 255, .05);
    }
  }

  &:not(.layout-header__sync-status--syncing) svg {
    color: var(--primary-700);
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
.layout-header__toggle-theme {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  padding: 4px;
}
</style>
