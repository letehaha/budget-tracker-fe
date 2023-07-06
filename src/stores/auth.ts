import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { API_ERROR_CODES } from 'shared-types';
import { api } from '@/api/_api';
import { useUserStore } from './user';
import { useCategoriesStore } from './categories/categories';
import { resetAllDefinedStores } from './setup';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();
  const categoriesStore = useCategoriesStore();

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
        API_ERROR_CODES.notFound,
        API_ERROR_CODES.invalidCredentials,
      ];

      if (possibleErrorCodes.includes(e.data.code)) {
        throw e.data;
      }
    }
  };

  const setLoggedIn = () => { isLoggedIn.value = true; };

  const signup = async ({ password, username }) => {
    await api.post('/auth/register', { password, username });
    await login({ password, username });
  };

  const logout = () => {
    api.setToken('');
    localStorage.setItem('user-token', '');

    resetAllDefinedStores();
  };

  return {
    isLoggedIn,
    userToken,

    setLoggedIn,
    login,
    signup,
    logout,
  };
});
