import { createApp } from 'vue';
import { router } from '@/routes';
import { store } from '@/store';
import { clickOutside } from '@/directives';
import { initApiCaller } from '@/api';
import App from './App.vue';
import '@/assets/styles/index.scss';
import './registerServiceWorker';

const app = createApp(App);

// eslint-disable-next-line no-console
console.log('testing new update');

app.directive('click-outside', clickOutside);

app.use(router);
app.use(store);

app.mount('#app');

initApiCaller({ store, router });
