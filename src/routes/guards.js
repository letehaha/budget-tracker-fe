import { api } from '@/api';
import { store, authVuexTypes, userVuexTypes } from '@/store';

export function authPageGuard(to, from, next) {
  const isLoggedIn = store.getters[authVuexTypes.isLoggedIn];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    api.setToken(token);
    next('/');
  } else {
    next();
  }
}

export function redirectRouteGuard(to, from, next) {
  const isLoggedIn = store.getters[`auth/${authVuexTypes.GET_IS_LOGGED_IN}`];
  const user = store.getters[`user/${userVuexTypes.GET_USER}`];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    api.setToken(token);
    if (!user) {
      store.dispatch(`user/${userVuexTypes.FETCH_USER}`);
    }
    next();
  } else {
    next('/sign-in');
  }
}
