<template>
  <div class="login">
    <div
      class="login__wrapper"
      @keypress.enter="submit"
    >
      <h1 class="login__title">
        Log in to account
      </h1>
      <FormWrapper
        :error="formError"
        class="login__fields"
      >
        <InputField
          v-model="form.username"
          label="Your username"
          placeholder="ie. johnsnow"
          class="login__field"
          :disabled="isFormLoading"
          :error-message="getFieldErrorMessage('form.username')"
        />
        <InputField
          v-model="form.password"
          label="Your password"
          class="login__field"
          type="password"
          :disabled="isFormLoading"
          :error-message="getFieldErrorMessage('form.password')"
        />
      </FormWrapper>
      <Button
        class="login__submit"
        :disabled="isFormLoading"
        @click="submit"
      >
        {{ isFormLoading ? 'Loading...' : 'Log in' }}
      </Button>
      <div class="login__signup">
        Don’t have an account?

        <router-link
          to="sign-up"
          class="login__signup-link"
        >
          Sign up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ERROR_CODES } from 'shared-types';
import {
  defineComponent, ref, Ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/newStore';
import { useFormValidation } from '@/composable';
import { required, minLength } from '@/js/helpers/validators.helper';

import FormWrapper from '@/components/fields/FormWrapper.vue';
import Button from '@/components/common/Button.vue';
import InputField from '@/components/fields/InputField.vue';

export default defineComponent({
  components: {
    Button,
    InputField,
    FormWrapper,
  },
  setup() {
    const router = useRouter();
    const { login } = useAuthStore();

    const form = ref({
      username: '',
      password: '',
    });
    const isFormLoading = ref(false);
    const formError: Ref<string | null> = ref(null);

    const {
      isFormValid,
      getFieldErrorMessage,
    } = useFormValidation(
      { form },
      {
        form: {
          username: { required },
          password: {
            required,
            passwordMinLength: minLength(6),
          },
        },
      },
      undefined,
      {
        customValidationMessages: {
          passwordMinLength: 'Minimal length is 6.',
        },
      },
    );

    watch(form.value, () => { formError.value = null; });

    const submit = async () => {
      if (!isFormValid()) return;

      const { password, username } = form.value;

      try {
        isFormLoading.value = true;

        await login({ password, username });

        router.push({ name: 'dashboard' });
      } catch (e) {
        const errorCodes = {
          [ERROR_CODES.notFound]: 'Incorrect email or password.',
          [ERROR_CODES.invalidCredentials]: 'Password is invalid.',
        };

        formError.value = errorCodes[e.code] || 'Unexpected error.';
      } finally {
        isFormLoading.value = false;
      }
    };

    return {
      form,
      formError,
      isFormLoading,
      submit,
      getFieldErrorMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--app-bg-color);
}
.login__wrapper {
  width: 100%;
  max-width: 450px;
  padding: 48px 32px;
}
.login__title {
  font-weight: 500;
  font-size: 30px;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 40px;
  color: var(--app-on-bg-color);
}
.login__field {
  &:not(:last-child) {
    margin-bottom: 24px;
  }
}
.login__submit {
  margin: 32px auto 0;
}
.login__signup {
  margin-top: 40px;
  text-align: center;
  font-weight: 400;
  color: var(--app-on-bg-color);
}
.login__signup-link {
  transition: .2s ease-out;
  color: var(--primary-500);

  &:hover {
    color: var(--primary-700);
  }
}
</style>
