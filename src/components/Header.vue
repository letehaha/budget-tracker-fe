<template>
  <div class="header">
    <div class="header__actions">
      <div class="header__action header__create-transaction">
        <Button
          @click="openFormModal"
        >
          New Record
        </Button>
      </div>
      <div class="header__action header__search">
        <InputField
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
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import { authVuexTypes } from '@/store';
import { MODAL_TYPES } from '@/components/Modal.vue';
import { eventBus } from '@/js/utils';
import Button from '@/components/common/Button.vue';
import InputField from '@/components/fields/InputField.vue';

export default defineComponent({
  components: {
    Button,
    InputField,
  },
  data: () => ({
    form: {
      search: '',
    },
  }),
  methods: {
    ...mapActions('auth', {
      logOut: authVuexTypes.LOG_OUT,
    }),
    openFormModal() {
      eventBus.emit(eventBus.eventsList.modalOpen, {
        type: MODAL_TYPES.transactionForm,
      });
    },
    logOutHandler() {
      this.logOut();
      this.$router.push('/sign-in');
    },
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
  background-color: #fff;
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
  color: #333;
  letter-spacing: 0.5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
