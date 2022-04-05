import { NavigationGuard } from 'vue-router';
import { api } from '@/api';
import {
  useUserStore,
  useCategoriesStore,
  useAuthStore,
} from '@/newStore';

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

  if (useAuthStore().isLoggedIn || token) {
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
