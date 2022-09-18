<template>
  <div class="header">
    <div class="header__actions">
      <div class="header__action header__create-transaction">
        <ui-button @click="openFormModal">
          New Record
        </ui-button>
      </div>
      <div class="header__action header__search">
        <input-field
          v-model="form.search"
          placeholder="Search..."
        />
      </div>
    </div>
    <div class="header__sign-out">
      <button
        tyoe="button"
        class="header__sign-out-action"
        @click="logOutHandler"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';
import { MODAL_TYPES, useModalCenter } from '@/components/modal-center/index';
import Button from '@/components/common/ui-button.vue';
import InputField from '@/components/fields/input-field.vue';

export default defineComponent({
  components: {
    'ui-button': Button,
    'input-field': InputField,
  },
  setup() {
    const router = useRouter();
    const form = reactive({
      search: '',
    });
    const { addModal } = useModalCenter();
    const { logout } = useAuthStore();

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
.header__sign-out-action {
  border: none;
  background-color: transparent;
  outline: none;
  color: var(--app-on-surface-color);
  letter-spacing: 0.5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
