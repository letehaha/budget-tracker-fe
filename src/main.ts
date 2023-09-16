import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { router } from '@/routes';
import { clickOutside, nodeResizeObserver } from '@/directives';
import { initApiCaller } from '@/api';
import { store } from '@/stores/setup';
import { useAuthStore } from '@/stores';
import { identifyCurrentTheme } from '@/common/utils';
import App from './app.vue';
import '@/styles/index.scss';
import './registerServiceWorker';

identifyCurrentTheme();

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
