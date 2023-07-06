<template>
  <div
    class="monobank-set-token"
    data-cy="monobank-set-token-modal"
  >
    <div>
      <button @click="$emit(MODAL_EVENTS.closeModal)">
        Close
      </button>
    </div>
    <p class="monobank-set-token__descr">
      Please visit
      <a href="https://api.monobank.ua/">https://api.monobank.ua/</a>
      and follow all instructions. At the end you will see token that should be
      copied and pasted to the field below.
    </p>
    <div class="monobank-set-token__row">
      <input-field
        v-model="form.token"
        name="token"
        label="Token"
      />
    </div>
    <div class="monobank-set-token__actions">
      <ui-button
        class="
          monobank-set-token__action
          monobank-set-token__action--submit
        "
        :type="BUTTON_TYPES.submit"
        :disabled="isLoading"
        @click="submit"
      >
        <template v-if="isUpdate">
          Update token
        </template>
        <template v-else>
          Pair account
        </template>
      </ui-button>
    </div>
  </div>
</template>

<script lang="ts">
import { API_ERROR_CODES } from 'shared-types';
import { defineComponent, reactive, ref } from 'vue';
import { useBanksMonobankStore } from '@/stores';
import { ApiErrorResponseError } from '@/js/errors';
import InputField from '@/components/fields/input-field.vue';
import Button, { BUTTON_TYPES } from '@/components/common/ui-button.vue';
import { EVENTS as MODAL_EVENTS } from '@/components/modal-center/ui-modal.vue';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

export default defineComponent({
  name: 'monobank-set-token',
  components: {
    'input-field': InputField,
    'ui-button': Button,
  },
  props: {
    isUpdate: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const monobankStore = useBanksMonobankStore();
    const { addNotification } = useNotificationCenter();

    const isLoading = ref(false);
    const form = reactive({
      token: null,
    });

    const submit = async () => {
      try {
        isLoading.value = true;

        if (props.isUpdate) {
          await monobankStore.updateUser({ token: form.token });
        } else {
          await monobankStore.pairAccount({ token: form.token });
        }

        emit(MODAL_EVENTS.closeModal);

        addNotification({
          text: 'Paired',
          type: NotificationType.success,
        });
      } catch (e) {
        if (e instanceof ApiErrorResponseError) {
          if (e.data.code === API_ERROR_CODES.monobankUserAlreadyConnected) {
            addNotification({
              text: 'Account already connected',
              type: NotificationType.error,
            });

            return;
          }
        }

        addNotification({
          text: 'Unexpected error',
          type: NotificationType.error,
        });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      BUTTON_TYPES,
      MODAL_EVENTS,
      form,
      isLoading,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.monobank-set-token {
  background-color: var(--app-bg-color);
  padding: 60px;
  width: 100%;
  max-width: 600px;
}
.monobank-set-token__row {
  margin-bottom: 20px;
}
.monobank-set-token__actions {
  display: flex;
  justify-content: center;
}
.monobank-set-token__descr {
  margin: 20px 0;
}
</style>
