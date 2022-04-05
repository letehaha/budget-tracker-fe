import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { ERROR_CODES } from 'shared-types';
import { api } from '@/api';
import { useUserStore } from './user';
import { useCategoriesStore } from './categories/categories';

const userStore = useUserStore();
const categoriesStore = useCategoriesStore();

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isLoggedIn = ref(false);
  const userToken: Ref<string | null> = ref(null);

  const login = async ({ password, username }) => {
    try {
      const result = await api.post('/auth/login', {
        password,
        username,
      });

      if (result.token) {
        api.setToken(result.token);

        await userStore.loadUser();
        await categoriesStore.loadCategories();

        userToken.value = result.token;
        localStorage.setItem('user-token', result.token);
        isLoggedIn.value = true;
      }
    } catch (e) {
      const possibleErrorCodes = [
        ERROR_CODES.notFound,
        ERROR_CODES.invalidCredentials,
      ];

      if (possibleErrorCodes.includes(e.data.code)) {
        throw e.data;
      }
    }
  };

  const signup = async ({ password, username }) => {
    try {
      await api.post('/auth/register', { password, username });

      await login({ password, username });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const logout = () => {
    api.setToken('');
    localStorage.setItem('user-token', '');
    userToken.value = null;
    isLoggedIn.value = false;

    // commit(`accounts/${accountsVuexTypes.RESET_STATE}`, null, { root: true });
    // commit(`bankMonobank/${bankMonobankVuexTypes.RESET_STORE}`, null, { root: true });
    // commit(`categories/${categoriesVuexTypes.RESET_STORE}`, null, { root: true });
    // commit(`transactions/${transactionsVuexTypes.RESET_STORE}`, null, { root: true });
    // commit(`user/${userVuexTypes.RESET_STORE}`, null, { root: true });
  };

  return {
    user,
    isLoggedIn,
    userToken,

    login,
    signup,
    logout,
  };
});
