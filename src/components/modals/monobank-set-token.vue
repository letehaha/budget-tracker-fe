<template>
  <Card
    class="py-12 px-8 w-full max-w-[600px] relative rounded-xl"
    data-cy="monobank-set-token-modal"
  >
    <Button
      type="button"
      class="absolute top-3 right-3"
      theme="light-dark"
      is-icon
      @click="$emit(MODAL_EVENTS.closeModal)"
    >
      X
    </Button>

    <p class="my-5">
      Please visit
      <a href="https://api.monobank.ua/" class="text-primary"
        >https://api.monobank.ua/</a
      >
      and follow all the instructions. Paste the API token from Monobank in the
      field below
    </p>
    <div class="my-5">
      <input-field
        v-model="form.token"
        name="token"
        label="API Token"
        :error-message="getFieldErrorMessage('form.token')"
      />
    </div>
    <div class="flex justify-center">
      <Button type="submit" :disabled="isLoading" @click="submit">
        <template v-if="isUpdate"> Update token </template>
        <template v-else> Pair account </template>
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { API_ERROR_CODES } from "shared-types";
import { useBanksMonobankStore, useCurrenciesStore } from "@/stores";
import { MONOBANK_API_TOKEN_LENGTH } from "@/common/const";
import { ApiErrorResponseError } from "@/js/errors";
import { useFormValidation } from "@/composable";
import { required, minLength } from "@/js/helpers/validators";
import InputField from "@/components/fields/input-field.vue";
import Button from "@/components/common/ui-button.vue";
import { EVENTS as MODAL_EVENTS } from "@/components/modal-center/ui-modal.vue";
import { Card } from "@/components/lib/ui/card";

import {
  useNotificationCenter,
  NotificationType,
} from "@/components/notification-center";

defineOptions({
  name: "monobank-set-token",
});

const props = withDefaults(
  defineProps<{
    isUpdate?: boolean;
  }>(),
  {
    isUpdate: false,
  },
);

const emit = defineEmits([MODAL_EVENTS.closeModal]);
const monobankStore = useBanksMonobankStore();
const currenciesStore = useCurrenciesStore();
const { addNotification } = useNotificationCenter();

const isLoading = ref(false);
const form = reactive({ token: "" });
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

    await currenciesStore.loadCurrencies();

    emit(MODAL_EVENTS.closeModal);

    addNotification({
      text: "Paired",
      type: NotificationType.success,
    });
  } catch (e) {
    if (e instanceof ApiErrorResponseError) {
      if (e.data.code === API_ERROR_CODES.monobankUserAlreadyConnected) {
        addNotification({
          text: "Account already connected",
          type: NotificationType.error,
        });

        return;
      }
    }

    addNotification({
      text: "Unexpected error",
      type: NotificationType.error,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
