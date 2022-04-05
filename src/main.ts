import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/routes';
import { clickOutside } from '@/directives';
import { initApiCaller } from '@/api';
import { useAuthStore } from '@/stores';
import App from './App.vue';
import '@/styles/index.scss';
import './registerServiceWorker';

const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(matched ? 'dark' : 'light');

const app = createApp(App);

app.directive('click-outside', clickOutside);

app.use(router);
app.use(createPinia());

app.mount('#app');

initApiCaller({
  logout: useAuthStore().logout,
  router,
});
