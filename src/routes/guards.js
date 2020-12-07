import { store, authVuexTypes } from '@/store';

export function authPageGuard(to, from, next) {
  const isLoggedIn = store.getters[authVuexTypes.isLoggedIn];
  if (isLoggedIn) {
    next('/');
  } else {
    next();
  }
}

export function redirectRouteGuard(to, from, next) {
  const isLoggedIn = store.getters[authVuexTypes.GET_IS_LOGGED_IN];

  if (isLoggedIn) {
    next();
  } else {
    next('/sign-in');
  }
}
