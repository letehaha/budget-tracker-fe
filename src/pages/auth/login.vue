<template>
  <div class="login">
    <ui-box
      class="login__wrapper"
      @keypress.enter="submit"
    >
      <h2 class="login__title">
        Log in to account
      </h2>
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
        type="submit"
        class="login__submit"
        :disabled="isFormLoading"
        @click="submit"
      >
        {{ isFormLoading ? 'Loading...' : 'Log in' }}
      </ui-button>
      <div class="login__signup">
        Don’t have an account?

        <router-link
          :to="{ name: ROUTES_NAMES.signUp }"
          class="login__signup-link"
        >
          Sign up
        </router-link>
      </div>
    </ui-box>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, Ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { API_ERROR_CODES } from 'shared-types';

import { ROUTES_NAMES } from '@/routes/constants';
import { useAuthStore } from '@/stores';
import { useFormValidation } from '@/composable';
import { required, minLength } from '@/js/helpers/validators';

import FormWrapper from '@/components/fields/form-wrapper.vue';
import UiButton from '@/components/common/ui-button.vue';
import UiBox from '@/components/box.vue';
import InputField from '@/components/fields/input-field.vue';
import { ApiErrorResponseError } from '@/js/errors';

export default defineComponent({
  components: {
    UiButton,
    InputField,
    FormWrapper,
    UiBox,
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

        router.push({ name: ROUTES_NAMES.home });
      } catch (e) {
        if (e instanceof ApiErrorResponseError) {
          const errorCodes: Partial<{ [K in API_ERROR_CODES]: string }> = {
            [API_ERROR_CODES.notFound]: 'Incorrect email or password.',
            [API_ERROR_CODES.invalidCredentials]: 'Password is invalid.',
          };

          formError.value = errorCodes[e.data.code] || 'Unexpected error.';
          return;
        }

        formError.value = 'Unexpected error.';
      } finally {
        isFormLoading.value = false;
      }
    };

    return {
      ROUTES_NAMES,
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
}
.login__wrapper {
  width: 100%;
  max-width: 450px;
  padding: 32px;
}
.login__title {
  @extend %heading-2;

  text-align: center;
  margin-bottom: 48px;
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
  margin-top: 48px;
  text-align: center;
}
.login__signup-link {
  @include link-primary-color();

  transition: color .2s ease-out;
}
</style>
