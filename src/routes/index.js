import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home'
import Register from '@/pages/auth/Register'
import Login from '@/pages/auth/Login'
import { redirectRouteGuard, authPageGuard } from './guards';

const routes = [
  {
    path: '/',
    component: Home,
    beforeEnter: redirectRouteGuard,
  },
  {
    path: '/sign-up',
    component: Register,
    beforeEnter: authPageGuard,
  },
  {
    path: '/sign-in',
    component: Login,
    beforeEnter: authPageGuard,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
