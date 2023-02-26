<template>
  <div class="login">
    <div
      class="login__wrapper"
      @keypress.enter="submit"
    >
      <h1 class="login__title">
        Log in to account
      </h1>
      <form-wrapper
        :error="formError"
        class="login__fields"
      >
        <input-field
          v-model="form.username"
          name="username"
          label="Your username"
          placeholder="ie. johnsnow"
          class="login__field"
          :disabled="isFormLoading"
          :error-message="getFieldErrorMessage('form.username')"
        />
        <input-field
          v-model="form.password"
          label="Your password"
          class="login__field"
          type="password"
          :disabled="isFormLoading"
          :error-message="getFieldErrorMessage('form.password')"
        />
      </form-wrapper>
      <ui-button
        :type="BUTTON_TYPES.submit"
        class="login__submit"
        :disabled="isFormLoading"
        @click="submit"
      >
        {{ isFormLoading ? 'Loading...' : 'Log in' }}
      </ui-button>
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
import { useAuthStore } from '@/stores';
import { useFormValidation } from '@/composable';
import { required, minLength } from '@/js/helpers/validators';

import FormWrapper from '@/components/fields/form-wrapper.vue';
import UiButton, { BUTTON_TYPES } from '@/components/common/ui-button.vue';
import InputField from '@/components/fields/input-field.vue';

export default defineComponent({
  components: {
    UiButton,
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
      BUTTON_TYPES,
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
