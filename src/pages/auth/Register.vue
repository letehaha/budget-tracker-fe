<template>
  <div class="register">
    <div class="register__wrapper">
      <h1 class="register__title">
        Create an account
      </h1>
      <div class="register__fields">
        <InputField
          v-model="form.username"
          label="Username"
          placeholder="ie. johnsnow"
          class="register__field"
        />
        <InputField
          v-model="form.password"
          label="Password"
          class="register__field"
          type="password"
        />
        <InputField
          v-model="form.verifyPassowrd"
          label="Verify Password"
          class="register__field"
          type="password"
        />
      </div>
      <Button
        class="register__submit"
        @click="submit"
      >
        Sign up
      </Button>
      <div class="register__signup">
        Already have an account?

        <router-link
          to="sign-in"
          class="register__signup-link"
        >
          Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/newStore';
import Button from '@/components/common/Button.vue';
import InputField from '@/components/fields/InputField.vue';

export default defineComponent({
  components: {
    Button,
    InputField,
  },
  setup() {
    const form = reactive({
      username: '',
      password: '',
      verifyPassowrd: '',
    });

    const isFormLoading = ref(false);

    const submit = async () => {
      const { password, username } = form;

      isFormLoading.value = true;

      await useAuthStore().signup({ password, username });

      useRouter().push({ name: 'dashboard' });

      isFormLoading.value = false;
    };

    return {
      form,

      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register__wrapper {
  width: 100%;
  max-width: 450px;
  padding: 48px 32px;
}
.register__title {
  font-weight: 500;
  font-size: 30px;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 40px;
}
.register__field {
  &:not(:last-child) {
    margin-bottom: 24px;
  }
}
.register__submit {
  margin: 32px auto 0;
}
.register__signup {
  margin-top: 40px;
  text-align: center;
  font-weight: 400;
}
.register__signup-link {
  transition: .2s ease-out;
  color: var(--primary-500);

  &:hover {
    color: var(--primary-700);
  }
}
</style>
