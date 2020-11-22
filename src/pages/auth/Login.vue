<template>
  <div class="login">
    <div class="login__wrapper">
      <h1 class="login__title">
        Log in to account
      </h1>
      <div class="login__fields">
        <InputField
          v-model="form.username"
          label="Your username"
          placeholder="ie. johnsnow"
          class="login__field"
        />
        <InputField
          v-model="form.passowrd"
          label="Your password"
          class="login__field"
          type="password"
        />
      </div>
      <Button
        class="login__submit"
      >
        Log in
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
  }),
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
  font-weight: 300;
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
  font-weight: 300;
}
.login__signup-link {
  transition: .2s ease-out;
  color: var(--system-blue);

  &:hover {
    color: var(--system-blue-hovered);
  }
}
</style>
