import { createRouter, createWebHistory } from 'vue-router';
import { redirectRouteGuard, authPageGuard, baseCurrencyExists } from './guards';

export const ROUTER_LAYOUTS = Object.freeze({
  auth: 'auth',
  dashboard: 'dashboard',
});

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/dashboard.vue'),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('@/pages/accounts/accounts.vue'),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/pages/account/account.vue'),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/create-account',
    name: 'create-account',
    component: () => import('@/pages/account/create.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/crypto',
    name: 'crypto',
    component: () => import('@/pages/crypto/crypto.vue'),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/pages/records/records.vue'),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings/settings.vue'),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/sign-up',
    name: 'auth/sign-up',
    component: () => import('@/pages/auth/register.vue'),
    beforeEnter: authPageGuard,
    meta: {
      layout: ROUTER_LAYOUTS.auth,
    },
  },
  {
    path: '/sign-in',
    name: 'auth/sign-in',
    component: () => import('@/pages/auth/login.vue'),
    beforeEnter: authPageGuard,
    meta: {
      layout: ROUTER_LAYOUTS.auth,
    },
  },
  {
    path: '/welcome',
    name: 'auth/welcome',
    component: () => import('@/pages/auth/welcome.vue'),
    meta: {
      layout: ROUTER_LAYOUTS.auth,
    },
  },
  // TODO: investigate how to deal with it
  // {
  //   path: '/:pathMatch(.*)',
  //   redirect: '/',
  // },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
