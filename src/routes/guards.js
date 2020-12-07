import { store, authVuexTypes } from '@/store';

export function authPageGuard(to, from, next) {
  const isLoggedIn = store.getters[authVuexTypes.isLoggedIn];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    next('/');
  } else {
    next();
  }
}

export function redirectRouteGuard(to, from, next) {
  const isLoggedIn = store.getters[authVuexTypes.GET_IS_LOGGED_IN];
  const token = localStorage.getItem('user-token');

  if (isLoggedIn || token) {
    next();
  } else {
    next('/sign-in');
  }
}
