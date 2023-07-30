import { createRouter, createWebHistory } from 'vue-router';
import { redirectRouteGuard, authPageGuard, baseCurrencyExists } from './guards';
import { ROUTES_NAMES } from './constants';

export { ROUTES_NAMES, ROUTER_LAYOUTS } from './constants';

const routes = [
  {
    path: '/',
    name: ROUTES_NAMES.dashboard,
    component: () => import('@/layouts/dashboard.vue'),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    redirect: () => ({ name: ROUTES_NAMES.home }),
    children: [
      {
        path: '/',
        name: ROUTES_NAMES.home,
        component: () => import('@/pages/dashboard/dashboard.vue'),
      },
      {
        path: '/accounts',
        name: ROUTES_NAMES.accounts,
        component: () => import('@/pages/accounts/accounts.vue'),
      },
      {
        path: '/account/:id',
        name: ROUTES_NAMES.account,
        component: () => import('@/pages/account/account.vue'),
      },
      {
        path: '/create-account',
        name: ROUTES_NAMES.createAccount,
        component: () => import('@/pages/account/create.vue'),
      },
      {
        path: '/crypto',
        name: ROUTES_NAMES.crypto,
        component: () => import('@/pages/crypto/crypto.vue'),
      },
      {
        path: '/records',
        name: ROUTES_NAMES.records,
        component: () => import('@/pages/records/records.vue'),
      },
      {
        path: '/settings',
        name: ROUTES_NAMES.settings,
        component: () => import('@/pages/settings/settings.vue'),
      },
    ],
  },
  {
    path: '/auth',
    name: ROUTES_NAMES.auth,
    component: () => import('@/layouts/auth.vue'),
    redirect: () => ({ name: ROUTES_NAMES.signIn }),
    children: [
      {
        path: '/sign-in',
        name: ROUTES_NAMES.signIn,
        beforeEnter: authPageGuard,
        component: () => import('@/pages/auth/login.vue'),
      },
      {
        path: '/sign-up',
        name: ROUTES_NAMES.signUp,
        beforeEnter: authPageGuard,
        component: () => import('@/pages/auth/register.vue'),
      },
      {
        path: '/welcome',
        name: ROUTES_NAMES.welcome,
        beforeEnter: redirectRouteGuard,
        component: () => import('@/pages/auth/welcome.vue'),
      },
    ],
  },
  // TODO: how to deal better
  // {
  //   path: '/:pathMatch(.*)',
  //   redirect: '/',
  // },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
