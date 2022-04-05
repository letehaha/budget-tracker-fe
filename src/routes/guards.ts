import { NavigationGuard } from 'vue-router';
import { api } from '@/api';
import {
  store,
  authVuexTypes,
} from '@/store';

import { useUserStore, useCategoriesStore } from '@/newStore';

export const authPageGuard: NavigationGuard = (to, from, next): void => {
  const isLoggedIn = store.getters[`auth/${authVuexTypes.GET_IS_LOGGED_IN}`];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    api.setToken(token);
    next('/');
  } else {
    next();
  }
};

export const redirectRouteGuard: NavigationGuard = (to, from, next): void => {
  const userStore = useUserStore();
  const categoriesStore = useCategoriesStore();
  const isLoggedIn = store.getters[`auth/${authVuexTypes.GET_IS_LOGGED_IN}`];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    api.setToken(token);
    if (!userStore.user) {
      userStore.loadUser();
      categoriesStore.loadCategories();
    }
    next();
  } else {
    next('/sign-in');
  }
};
