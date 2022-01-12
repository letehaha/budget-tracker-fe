<template>
  <div class="login">
    <div
      class="login__wrapper"
      @keypress.enter="submit"
    >
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
          v-model="form.password"
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

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import { authVuexTypes } from '@/store';
import Button from '@/components/common/Button.vue';
import InputField from '@/components/fields/InputField.vue';

export default defineComponent({
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
    ...mapActions('auth', {
      signIn: authVuexTypes.LOG_IN,
    }),
    async submit() {
      const { password, username } = this.form;
      this.isFormLoading = true;

      await this.signIn({ password, username });

      this.$router.push('/');

      this.isFormLoading = false;
    },
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
