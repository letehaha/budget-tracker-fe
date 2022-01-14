import { createApp } from 'vue';
import { router } from '@/routes';
import { store } from '@/store';
import { clickOutside } from '@/directives';
import { initApiCaller } from '@/api';
import App from './App.vue';
import '@/styles/index.scss';
import './registerServiceWorker';

const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(matched ? 'dark' : 'light');

const app = createApp(App);

app.directive('click-outside', clickOutside);

app.use(router);
app.use(store);

app.mount('#app');

initApiCaller({ store, router });
