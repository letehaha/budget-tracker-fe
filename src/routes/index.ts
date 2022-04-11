import { createRouter, createWebHistory } from 'vue-router';
import { redirectRouteGuard, authPageGuard } from './guards';

export const ROUTER_LAYOUTS = Object.freeze({
  auth: 'auth',
  dashboard: 'dashboard',
});

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('@/pages/Accounts/Accounts.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/pages/Account/Account.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/create-account',
    name: 'create-account',
    component: () => import('@/pages/Account/Create.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/crypto',
    name: 'crypto',
    component: () => import('@/pages/Crypto.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/pages/Records.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/Settings/Settings.vue'),
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/sign-up',
    name: 'auth/sign-up',
    component: () => import('@/pages/auth/Register.vue'),
    beforeEnter: authPageGuard,
    meta: {
      layout: ROUTER_LAYOUTS.auth,
    },
  },
  {
    path: '/sign-in',
    name: 'auth/sign-in',
    component: () => import('@/pages/auth/Login.vue'),
    beforeEnter: authPageGuard,
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
