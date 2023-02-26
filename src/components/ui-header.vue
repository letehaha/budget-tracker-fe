<template>
  <div class="header">
    <template v-if="!onlySignOut">
      <div class="header__actions">
        <div class="header__action">
          <ui-button @click="openFormModal">
            New Record
          </ui-button>
        </div>
        <div class="header__action">
          <input-field
            v-model="form.search"
            placeholder="Search..."
          />
        </div>
      </div>
    </template>

    <div
      class="header__sync-status"
      :class="{
        'header__sync-status--syncing': isSyncing,
      }"
    >
      <template v-if="isSyncing">
        <refresh-icon />
        <span class="header__sync-status-text">Synchronizing...</span>
      </template>
      <template v-else>
        <checkmark-in-circle-icon />
        <span class="header__sync-status-text">Synchronized</span>
      </template>
    </div>

    <div class="header__sign-out">
      <button
        type="button"
        class="header__sign-out-action"
        @click="logOutHandler"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore, useRootStore } from '@/stores';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';
import UiButton from '@/components/common/ui-button.vue';
import InputField from '@/components/fields/input-field.vue';
import CheckmarkInCircleIcon from '@/assets/icons/checkmark-in-circle.svg?component';
import RefreshIcon from '@/assets/icons/refresh.svg?component';

export default defineComponent({
  components: {
    UiButton,
    InputField,
    CheckmarkInCircleIcon,
    RefreshIcon,
  },
  props: {
    onlySignOut: Boolean,
  },
  setup() {
    const router = useRouter();
    const form = reactive({
      search: '',
    });
    const { addModal } = useModalCenter();
    const { logout } = useAuthStore();
    const rootStore = useRootStore();
    const { isAppInitialized, isFinancialDataSyncing } = storeToRefs(rootStore);

    const isSyncing = computed(() => !isAppInitialized.value || isFinancialDataSyncing.value);

    const openFormModal = () => {
      addModal({
        type: MODAL_TYPES.systemTxForm,
      });
    };

    const logOutHandler = () => {
      logout();
      router.push({ name: 'auth/sign-in' });
    };

    return {
      form,
      isSyncing,

      openFormModal,
      logOutHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  padding: 16px 32px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--app-surface-color);
}
.header__actions {
  display: flex;
  align-items: center;
}
.header__action {
  margin-right: 16px;
}
.header__sign-out {
  margin-left: 24px;
}
.header__sign-out-action {
  border: none;
  background-color: transparent;
  outline: none;
  color: var(--app-on-surface-color);
  letter-spacing: 0.5px;
  font-size: 16px;
  cursor: pointer;
}
.header__sync-status {
  display: grid;
  grid-template-columns: 14px 1fr;
  align-items: center;
  margin-left: auto;
  gap: 8px;
  font-size: 12px;

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
