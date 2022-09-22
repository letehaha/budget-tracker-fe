import { NavigationGuard } from 'vue-router';
import { storeToRefs } from 'pinia';
import { api } from '@/api';
import {
  useUserStore,
  useCategoriesStore,
  useAuthStore,
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
