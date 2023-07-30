export const ROUTER_LAYOUTS = Object.freeze({
  auth: 'auth',
  dashboard: 'dashboard',
});

export const ROUTES_NAMES = Object.freeze({
  dashboard: ROUTER_LAYOUTS.dashboard,
  home: `${ROUTER_LAYOUTS.dashboard}.home`,
  accounts: `${ROUTER_LAYOUTS.dashboard}.accounts`,
  account: `${ROUTER_LAYOUTS.dashboard}.account`,
  createAccount: `${ROUTER_LAYOUTS.dashboard}.create-account`,
  crypto: `${ROUTER_LAYOUTS.dashboard}.crypto`,
  records: `${ROUTER_LAYOUTS.dashboard}.records`,
  settings: `${ROUTER_LAYOUTS.dashboard}.settings`,

  auth: ROUTER_LAYOUTS.auth,
  signIn: `${ROUTER_LAYOUTS.auth}.sign-in`,
  signUp: `${ROUTER_LAYOUTS.auth}.sign-up`,
  welcome: `${ROUTER_LAYOUTS.auth}.welcome`,
});
