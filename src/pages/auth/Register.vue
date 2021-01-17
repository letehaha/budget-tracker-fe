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

<script>
import { mapActions } from 'vuex';
import { authVuexTypes } from '@/store';
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
      verifyPassowrd: '',
    },
  }),
  methods: {
    ...mapActions('auth', {
      signUp: authVuexTypes.SIGN_UP,
    }),
    async submit() {
      const { password, username } = this.form;
      this.isFormLoading = true;

      await this.signUp({ password, username });

      this.$router.push('/');

      this.isFormLoading = false;
    },
  },
};
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
  color: var(--system-blue);

  &:hover {
    color: var(--system-blue-hovered);
  }
}
</style>
