<template>
  <div class="header">
    <div class="header__actions">
      <div class="header__action">
        <ui-button @click="openFormModal">
          New Record
        </ui-button>
      </div>
    </div>

    <ui-tooltip
      :content="!isAllowedToSyncFinancialData ? 'You can sync data only once in 30 mins' : ''"
      position="bottom"
      class="header__sync-status-wrapper"
    >
      <button
        class="button-style-reset header__sync-status"
        type="button"
        :class="{
          'header__sync-status--syncing': isSyncing,
        }"
        :disabled="!isAllowedToSyncFinancialData"
        @click="syncFinancialDataHandler"
      >
        <template v-if="isSyncing">
          <refresh-icon />
          <span class="header__sync-status-text">Synchronizing...</span>
        </template>
        <template v-else>
          <checkmark-in-circle-icon />
          <span class="header__sync-status-text">Synchronized</span>
        </template>
      </button>
    </ui-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRootStore } from '@/stores';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';
import UiButton from '@/components/common/ui-button.vue';
import CheckmarkInCircleIcon from '@/assets/icons/checkmark-in-circle.svg?component';
import RefreshIcon from '@/assets/icons/refresh.svg?component';
import UiTooltip from '@/components/common/tooltip.vue';

export default defineComponent({
  components: {
    UiButton,
    UiTooltip,
    CheckmarkInCircleIcon,
    RefreshIcon,
  },
  setup() {
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

    return {
      isSyncing,

      openFormModal,
      isAllowedToSyncFinancialData,
      syncFinancialDataHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  padding: 12px 24px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--app-border-default);
  max-height: var(--header-height);
}
.header__actions {
  display: flex;
  align-items: center;
}
.header__action {
  margin-right: 16px;
}
.header__sync-status-wrapper {
  margin-left: auto;
}
.header__sync-status {
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

  &:not(.header__sync-status--syncing) svg {
    color: var(--primary-700);
  }
}
.header__sync-status--syncing {
  svg {
    animation-name: keyframes-rotate;
    animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-timing-function: linear;
  }
}
.header__sync-status-text {
  font-weight: 500;
}
</style>
