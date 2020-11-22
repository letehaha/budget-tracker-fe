<template>
  <div class="login">
    <div class="login__wrapper">
      <h1 class="login__title">
        Log in to account
      </h1>
      <form class="login__fields">
        <InputField
          v-model="form.username"
          label="Your username"
          placeholder="ie. johnsnow"
          class="login__field"
          :disabled="isFormLoading"
        />
        <InputField
          v-model="form.passowrd"
          label="Your password"
          class="login__field"
          type="password"
          :disabled="isFormLoading"
        />
      </form>
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

<script>
import Button from '@/components/common/Button';
import InputField from '@/components/fields/InputField';

export default {
  components: {
    Button,
    InputField,
  },
  data: () => ({
    form: {
      username: '',
      password: '',
    },
    isFormLoading: false,
  }),
  methods: {
    submit() {
      this.isFormLoading = !this.isFormLoading;
    },
  },
};
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
  padding: 48px 32px;
}
.login__title {
  font-weight: 500;
  font-size: 30px;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 40px;
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
}
.login__signup-link {
  transition: .2s ease-out;
  color: var(--system-blue);

  &:hover {
    color: var(--system-blue-hovered);
  }
}
</style>
