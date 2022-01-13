import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/pages/Dashboard.vue';
import Accounts from '@/pages/Accounts.vue';
import Account from '@/pages/Account.vue';
import Crypto from '@/pages/Crypto.vue';
import Register from '@/pages/auth/Register.vue';
import Login from '@/pages/auth/Login.vue';
import { redirectRouteGuard, authPageGuard } from './guards';

export const ROUTER_LAYOUTS = Object.freeze({
  auth: 'auth',
  dashboard: 'dashboard',
});

const routes = [
  {
    path: '/',
    component: Dashboard,
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/accounts',
    component: Accounts,
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/account',
    component: Account,
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/crypto',
    component: Crypto,
    beforeEnter: redirectRouteGuard,
    meta: {
      layout: ROUTER_LAYOUTS.dashboard,
    },
  },
  {
    path: '/sign-up',
    component: Register,
    beforeEnter: authPageGuard,
    meta: {
      layout: ROUTER_LAYOUTS.auth,
    },
  },
  {
    path: '/sign-in',
    component: Login,
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
