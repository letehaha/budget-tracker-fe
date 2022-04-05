import { NavigationGuard } from 'vue-router';
import { api } from '@/api';
import {
  store,
  authVuexTypes,
  categoriesVuexTypes,
} from '@/store';

import { useUserStore } from '@/newStore';

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
  const isLoggedIn = store.getters[`auth/${authVuexTypes.GET_IS_LOGGED_IN}`];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    api.setToken(token);
    if (!userStore.user) {
      userStore.loadUser();
      store.dispatch(`categories/${categoriesVuexTypes.FETCH_CATEGORIES}`, null, { root: true });
    }
    next();
  } else {
    next('/sign-in');
  }
};
