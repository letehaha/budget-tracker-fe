import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { API_ERROR_CODES } from 'shared-types';
import { authLogin, authRegister, api } from '@/api';
import { useCategoriesStore } from '@/stores';
import { useUserStore } from './user';
import { resetAllDefinedStores } from './setup';

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore();
  const categoriesStore = useCategoriesStore();

  const isLoggedIn = ref(false);
  const userToken: Ref<string | null> = ref(null);

  const login = async (
    { password, username }:
    { password: string; username: string },
  ) => {
    try {
      const result = await authLogin({
        password,
        username,
      });

      if (result.token) {
        api.setToken(result.token);

        await userStore.loadUser();
        await categoriesStore.loadCategories();

        isLoggedIn.value = true;
        userToken.value = result.token;
        localStorage.setItem('user-token', result.token);
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

  const signup = async (
    { password, username }:
    { password: string; username: string },
  ) => {
    await authRegister({ password, username });
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
