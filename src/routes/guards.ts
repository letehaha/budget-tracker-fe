import { NavigationGuard } from 'vue-router';
import { api } from '@/api';
import {
  store,
  authVuexTypes,
  userVuexTypes,
  categoriesVuexTypes,
} from '@/store';

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
  const isLoggedIn = store.getters[`auth/${authVuexTypes.GET_IS_LOGGED_IN}`];
  const user = store.getters[`user/${userVuexTypes.GET_USER}`];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    api.setToken(token);
    if (!user) {
      store.dispatch(`user/${userVuexTypes.FETCH_USER}`);
      store.dispatch(`categories/${categoriesVuexTypes.FETCH_CATEGORIES}`, null, { root: true });
    }
    next();
  } else {
    next('/sign-in');
  }
};
