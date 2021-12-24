<template>
  <div class="api-keys-form">
    <h3>Please define your API keys</h3>
    <InputField
      v-model="form.public"
      label="Public Key"
      :error-message="getFieldErrorMessage('form.public')"
    />
    <InputField
      v-model="form.secret"
      label="Secret Key"
      :error-message="getFieldErrorMessage('form.secret')"
    />
    <Button
      :disabled="isFormLoading"
      @click="submit"
    >
      {{ isFormLoading ? 'Loading...' : 'Submit' }}
    </Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useFormValidation, useCryptoBinanceInfo } from '@/composable';
import { required } from '@/js/helpers/validators.helper';
import InputField from '@/components/fields/InputField.vue';
import Button from '@/components/common/Button.vue';

export default defineComponent({
  components: { InputField, Button },
  setup() {
    const { setUserSettings } = useCryptoBinanceInfo();

    const isFormLoading = ref(false);
    const form = ref({
      public: '',
      secret: '',
    });

    const {
      isFormValid,
      getFieldErrorMessage,
      resetValidation,
    } = useFormValidation(
      { form },
      {
        form: {
          public: { required },
          secret: { required },
        },
      },
    );

    const submit = async (): Promise<undefined> => {
      if (!isFormValid()) return undefined;

      isFormLoading.value = true;

      try {
        await setUserSettings({
          publicKey: form.value.public,
          secretKey: form.value.secret,
        });

        form.value = {
          public: '',
          secret: '',
        };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      } finally {
        isFormLoading.value = false;
        resetValidation();
      }

      return undefined;
    };

    return {
      form,
      isFormLoading,
      submit,
      getFieldErrorMessage,
    };
  },
});
</script>
