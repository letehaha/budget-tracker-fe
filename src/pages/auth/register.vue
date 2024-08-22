<template>
  <div class="flex items-center justify-center h-full">
    <Card class="max-w-[450px] w-full" as="form" @submit.prevent="submit">
      <CardHeader>
        <h1 class="text-2xl font-semibold tracking-tight text-center">Create an account</h1>
      </CardHeader>
      <CardContent class="grid gap-7">
        <input-field
          v-model="form.username"
          label="Username"
          placeholder="ie. johnsnow"
          :disabled="isFormLoading"
          :error-message="getFieldErrorMessage('form.username')"
        />
        <input-field
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="Your password"
          :disabled="isFormLoading"
          :error-message="getFieldErrorMessage('form.password')"
        />
        <input-field
          v-model="form.verifyPassowrd"
          label="Verify Password"
          type="password"
          placeholder="Verify password"
          :disabled="isFormLoading"
          :error-message="getFieldErrorMessage('form.verifyPassowrd')"
        />

        <div class="flex justify-center">
          <Button type="submit" :disabled="isFormLoading" class="w-full">
            {{ isFormLoading ? "Loading..." : "Sign up" }}
          </Button>
        </div>
      </CardContent>

      <CardFooter class="text-sm text-center">
        Don't have an account?

        <router-link :to="{ name: ROUTES_NAMES.signIn }">
          <Button as="span" variant="link"> Sign in </Button>
        </router-link>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { API_ERROR_CODES } from "shared-types";

import { ROUTES_NAMES } from "@/routes/constants";
import { useAuthStore } from "@/stores";
import { required, minLength, sameAs } from "@/js/helpers/validators";
import { Button } from "@/components/lib/ui/button";
import { InputField } from "@/components/fields";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/lib/ui/card";
import { useNotificationCenter } from "@/components/notification-center";
import { ApiErrorResponseError } from "@/js/errors";
import { useFormValidation } from "@/composable";

const router = useRouter();
const autoStore = useAuthStore();
const { addErrorNotification } = useNotificationCenter();
const form = reactive({
  username: "",
  password: "",
  verifyPassowrd: "",
});

const { isFormValid, getFieldErrorMessage } = useFormValidation(
  { form },
  {
    form: {
      username: { required },
      password: {
        required,
        passwordMinLength: minLength(6),
      },
      verifyPassowrd: {
        required,
        passwordMinLength: minLength(6),
        sameAs: sameAs(computed(() => form.password)),
      },
    },
  },
  undefined,
  {
    customValidationMessages: {
      passwordMinLength: "Minimal length is 6.",
      sameAs: "Passwords doesn't match",
    },
  },
);

const isFormLoading = ref(false);

const submit = async () => {
  try {
    if (!isFormValid()) return;

    const { password, username } = form;

    isFormLoading.value = true;

    await autoStore.signup({ password, username });

    router.push({ name: ROUTES_NAMES.welcome });
  } catch (e) {
    if (e instanceof ApiErrorResponseError) {
      if (e.data.code === API_ERROR_CODES.userExists) {
        addErrorNotification("User with that username already exists!");
        return;
      }
    }

    addErrorNotification("Unexpected error");
  } finally {
    isFormLoading.value = false;
  }
};
</script>
