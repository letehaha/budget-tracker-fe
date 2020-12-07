import { createApp } from 'vue';
import { router } from '@/routes';
import { store } from '@/store';
import { clickOutside } from '@/directives';
import { eventBus } from '@/js/utils';
import App from './App';
import '@/assets/styles/index.scss';
import './registerServiceWorker';

const app = createApp(App);

app.config.globalProperties.$bus = eventBus;

app.directive('click-outside', clickOutside);

app.use(router);
app.use(store);

app.mount('#app');
