<template>
  <div class="flex items-center justify-center h-full">
    <Card class="max-w-[450px] w-full" as="form" @submit.prevent="submit">
      <card-header>
        <h1 class="text-2xl font-semibold tracking-tight text-center">Log in to account</h1>
      </card-header>
      <card-content class="grid gap-7">
        <form-wrapper :error="formError" class="grid gap-7">
          <input-field
            v-model="form.username"
            name="username"
            label="Your username"
            placeholder="ie. johnsnow"
            :disabled="isFormLoading"
            :error-message="getFieldErrorMessage('form.username')"
          />
          <input-field
            v-model="form.password"
            label="Your password"
            placeholder="Your password"
            type="password"
            :disabled="isFormLoading"
            :error-message="getFieldErrorMessage('form.password')"
          />
        </form-wrapper>

        <div class="flex justify-center">
          <Button type="submit" :disabled="isFormLoading" class="w-full">
            {{ isFormLoading ? "Loading..." : "Log in" }}
          </Button>
        </div>
      </card-content>
      <card-footer class="text-sm text-center">
        Don't have an account?

        <router-link :to="{ name: ROUTES_NAMES.signUp }">
          <Button as="span" variant="link"> Sign up </Button>
        </router-link>
      </card-footer>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, watch } from "vue";
import { useRouter } from "vue-router";
import { API_ERROR_CODES } from "shared-types";

import { ROUTES_NAMES } from "@/routes/constants";
import { useAuthStore } from "@/stores";
import { useFormValidation } from "@/composable";
import { required, minLength } from "@/js/helpers/validators";

import FormWrapper from "@/components/fields/form-wrapper.vue";
import { Button } from "@/components/lib/ui/button";
import { InputField } from "@/components/fields";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/lib/ui/card";
import { ApiErrorResponseError } from "@/js/errors";

const router = useRouter();
const { login } = useAuthStore();

const form = ref({
  username: "",
  password: "",
});
const isFormLoading = ref(false);
const formError: Ref<string | null> = ref(null);

const { isFormValid, getFieldErrorMessage } = useFormValidation(
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
      passwordMinLength: "Minimal length is 6.",
    },
  },
);

watch(form.value, () => {
  formError.value = null;
});

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
        [API_ERROR_CODES.notFound]: "Incorrect email or password.",
        [API_ERROR_CODES.invalidCredentials]: "Password is invalid.",
      };

      formError.value = errorCodes[e.data.code] || "Unexpected error.";
      return;
    }

    formError.value = "Unexpected error.";
  } finally {
    isFormLoading.value = false;
  }
};
</script>
