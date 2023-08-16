<template>
  <div
    class="monobank-set-token"
    data-cy="monobank-set-token-modal"
  >
    <ui-button
      type="button"
      class="button-style-reset monobank-set-token__close"
      theme="light-dark"
      is-icon
      @click="$emit(MODAL_EVENTS.closeModal)"
    >
      X
    </ui-button>

    <p class="monobank-set-token__descr">
      Please visit
      <a href="https://api.monobank.ua/">https://api.monobank.ua/</a>
      and follow all the instructions. Paste the API token from Monobank in the
      field below
    </p>
    <div class="monobank-set-token__row">
      <input-field
        v-model="form.token"
        name="token"
        label="API Token"
        :error-message="getFieldErrorMessage('form.token')"
      />
    </div>
    <div class="monobank-set-token__actions">
      <ui-button
        class="
          monobank-set-token__action
          monobank-set-token__action--submit
        "
        type="submit"
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
import { defineComponent, reactive, ref } from 'vue';
import { API_ERROR_CODES } from 'shared-types';
import { useBanksMonobankStore } from '@/stores';
import { MONOBANK_API_TOKEN_LENGTH } from '@/js/const';
import { ApiErrorResponseError } from '@/js/errors';
import { useFormValidation } from '@/composable';
import { required, minLength } from '@/js/helpers/validators';
import InputField from '@/components/fields/input-field.vue';
import Button from '@/components/common/ui-button.vue';
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
  emits: [MODAL_EVENTS.closeModal],
  setup(props, { emit }) {
    const monobankStore = useBanksMonobankStore();
    const { addNotification } = useNotificationCenter();

    const isLoading = ref(false);
    const form = reactive<{ token: string }>({
      token: null,
    });
    const { isFormValid, getFieldErrorMessage } = useFormValidation(
      { form },
      {
        form: {
          token: {
            required,
            apiToken: minLength(MONOBANK_API_TOKEN_LENGTH),
          },
        },
      },
      undefined,
      {
        customValidationMessages: {
          apiToken: `Monobank API token should be ${MONOBANK_API_TOKEN_LENGTH} characters length`,
        },
      },
    );

    const submit = async () => {
      try {
        if (!isFormValid()) return;

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
      MODAL_EVENTS,
      form,
      isLoading,
      submit,
      getFieldErrorMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.monobank-set-token {
  background-color: var(--app-bg-box);
  padding: 48px 32px;
  width: 100%;
  max-width: 600px;
  position: relative;
  border-radius: 12px;
}
.monobank-set-token__close {
  position: absolute;
  top: 12px;
  right: 12px;
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

  a {
    color: var(--app-primary);
  }
}
</style>
