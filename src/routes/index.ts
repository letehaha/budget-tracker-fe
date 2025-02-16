import { createRouter, createWebHistory } from "vue-router";
import { redirectRouteGuard, authPageGuard, baseCurrencyExists, devOnly } from "./guards";
import { ROUTES_NAMES } from "./constants";

export { ROUTES_NAMES } from "./constants";

const routes = [
  {
    path: "/",
    name: ROUTES_NAMES.dashboard,
    component: () => import("@/layouts/dashboard.vue"),
    beforeEnter: [redirectRouteGuard, baseCurrencyExists],
    redirect: () => ({ name: ROUTES_NAMES.home }),
    children: [
      {
        path: "/dashboard",
        name: ROUTES_NAMES.home,
        component: () => import("@/pages/dashboard/dashboard.vue"),
      },
      {
        path: "/accounts",
        name: ROUTES_NAMES.accounts,
        component: () => import("@/pages/accounts/accounts.vue"),
      },
      {
        path: "/account/:id",
        name: ROUTES_NAMES.account,
        component: () => import("@/pages/account/account.vue"),
      },
      {
        path: "/create-account",
        name: ROUTES_NAMES.createAccount,
        component: () => import("@/pages/account/create.vue"),
      },
      {
        path: "/crypto",
        name: ROUTES_NAMES.crypto,
        component: () => import("@/pages/crypto/crypto.vue"),
      },
      {
        path: "/analytics",
        name: ROUTES_NAMES.analytics,
        beforeEnter: [devOnly],
        component: () => import("@/pages/analytics/index.vue"),
      },
      {
        path: "/transactions",
        name: ROUTES_NAMES.transactions,
        component: () => import("@/pages/records/records.vue"),
      },
      {
        path: "/settings",
        name: ROUTES_NAMES.settings,
        component: () => import("@/pages/settings/settings.vue"),
        children: [
          {
            path: "categories",
            name: ROUTES_NAMES.settingsCategories,
            component: () => import("@/pages/settings/subpages/categories/index.vue"),
          },
          {
            path: "currencies",
            name: ROUTES_NAMES.settingsCurrencies,
            component: () => import("@/pages/settings/subpages/currencies/index.vue"),
          },
          {
            path: "accounts",
            name: ROUTES_NAMES.settingsAccounts,
            component: () => import("@/pages/settings/subpages/accounts-groups/index.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    name: ROUTES_NAMES.auth,
    component: () => import("@/layouts/auth.vue"),
    redirect: () => ({ name: ROUTES_NAMES.signIn }),
    children: [
      {
        path: "/sign-in",
        name: ROUTES_NAMES.signIn,
        beforeEnter: authPageGuard,
        component: () => import("@/pages/auth/login.vue"),
      },
      {
        path: "/sign-up",
        name: ROUTES_NAMES.signUp,
        beforeEnter: authPageGuard,
        component: () => import("@/pages/auth/register.vue"),
      },
      {
        path: "/welcome",
        name: ROUTES_NAMES.welcome,
        beforeEnter: redirectRouteGuard,
        component: () => import("@/pages/auth/welcome.vue"),
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore dunno why but TS is stupidly angry here for now reason, after
  // adding nested routes for settings
  routes,
});
