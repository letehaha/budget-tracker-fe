import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/pages/Dashboard';
import Accounts from '@/pages/Accounts';
import Account from '@/pages/Account';
import Register from '@/pages/auth/Register';
import Login from '@/pages/auth/Login';
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
  {
    path: '/:pathMatch(.*)',
    redirect: '/',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
