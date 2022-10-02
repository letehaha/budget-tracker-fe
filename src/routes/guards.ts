import { NavigationGuard } from 'vue-router';
import { storeToRefs } from 'pinia';
import { api } from '@/api';
import {
  useUserStore,
  useCurrenciesStore,
  useCategoriesStore,
  useAuthStore,
  useRootStore,
} from '@/stores';

export const authPageGuard: NavigationGuard = (to, from, next): void => {
  const token = localStorage.getItem('user-token');

  if (useAuthStore().isLoggedIn || token) {
    api.setToken(token);
    next('/');
  } else {
    next();
  }
};

export const baseCurrencyExists: NavigationGuard = (to, from, next): void => {
  const rootStore = useRootStore();
  const userCurrenciesStore = useCurrenciesStore();
  const { isBaseCurrencyExists } = storeToRefs(userCurrenciesStore);
  const { isAppInitialized } = storeToRefs(rootStore);

  if (isAppInitialized.value && !isBaseCurrencyExists.value) {
    next('/welcome');
  } else {
    next();
  }
};

export const redirectRouteGuard: NavigationGuard = (to, from, next): void => {
  const token = localStorage.getItem('user-token');
  const authStore = useAuthStore();
  const { isLoggedIn } = storeToRefs(authStore);

  if (isLoggedIn || token) {
    isLoggedIn.value = true;
    api.setToken(token);
    if (!useUserStore().user) {
      useUserStore().loadUser();
      useCategoriesStore().loadCategories();
    }
    next();
  } else {
    next('/sign-in');
  }
};
