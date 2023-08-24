import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { router } from '@/routes';
import { clickOutside, nodeResizeObserver } from '@/directives';
import { initApiCaller } from '@/api';
import { store } from '@/stores/setup';
import { useAuthStore } from '@/stores';
import App from './app.vue';
import '@/styles/index.scss';
import './registerServiceWorker';

const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(matched ? 'dark' : 'light');

const app = createApp(App);

app.directive('click-outside', clickOutside);
app.directive('node-resize-observer', nodeResizeObserver);

app.use(router);
app.use(store);

app.use(VueQueryPlugin);

app.mount('#app');

initApiCaller({
  logout: useAuthStore().logout,
});
