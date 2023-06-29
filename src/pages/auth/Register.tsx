import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Component() {
  const [formData, updateFormData] = useState({
    username: '',
    password: '',
    verifyPassowrd: '',
  })

  const [isFormLoading, setFormLoading] = useState(false)

  const onChangeInput = (e) => {
    const { name, value } = e.target

    updateFormData({ ...formData, [name]: value })
  }

  const submit = async () => {
    try {
      const { password, username } = formData;

      setFormLoading(true);

      console.log('signed up')

      // await autoStore.signup({ password, username });

      // router.push({ name: 'auth/welcome' });
    } catch (e) {
      // if (e.data.code === ERROR_CODES.userExists) {
      //   addErrorNotification('User with that username already exists!');
      //   return;
      // }

      // addErrorNotification('Unexpected error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__wrapper">
        <h1 className="register__title">
          Create an account
        </h1>

        <div className="register__fields">
          <label className="register__field">
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onChangeInput}
            />
          </label>
          <label className="register__field">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChangeInput}
            />
          </label>
          <label className="register__field">
            Username
            <input
              type="password"
              name="verifyPassowrd"
              value={formData.verifyPassowrd}
              onChange={onChangeInput}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={submit}
        >
          Sign up
        </button>
        <div className="register__signup">
          Already have an account?

          <Link
            to={'/sign-in'}
            className="register__signup-link"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

{/* <template>
  <div class="register">
    <div class="register__wrapper">
      <h1 class="register__title">
        Create an account
      </h1>
      <div class="register__fields">
        <input-field
          v-model="form.username"
          label="Username"
          placeholder="ie. johnsnow"
          class="register__field"
        />
        <input-field
          v-model="form.password"
          label="Password"
          class="register__field"
          type="password"
        />
        <input-field
          v-model="form.verifyPassowrd"
          label="Verify Password"
          class="register__field"
          type="password"
        />
      </div>
      <ui-button
        class="register__submit"
        @click="submit"
      >
        Sign up
      </ui-button>
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
import { ERROR_CODES } from 'shared-types';
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';
import UiButton from '@/components/common/ui-button.vue';
import InputField from '@/components/fields/input-field.vue';
import { useNotificationCenter } from '@/components/notification-center';

export default defineComponent({
  components: {
    UiButton,
    InputField,
  },
  setup() {
    const router = useRouter();
    const autoStore = useAuthStore();
    const { addErrorNotification } = useNotificationCenter();
    const form = reactive({
      username: '',
      password: '',
      verifyPassowrd: '',
    });

    const isFormLoading = ref(false);

    const submit = async () => {
      try {
        const { password, username } = form;

        isFormLoading.value = true;

        await autoStore.signup({ password, username });

        router.push({ name: 'auth/welcome' });
      } catch (e) {
        if (e.data.code === ERROR_CODES.userExists) {
          addErrorNotification('User with that username already exists!');
          return;
        }

        addErrorNotification('Unexpected error');
      } finally {
        isFormLoading.value = false;
      }
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
</style> */}

export default Component
