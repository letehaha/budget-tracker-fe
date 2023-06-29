import React from 'react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client';
import Router from './Router.tsx';
import store from './stores/redux/store.ts'
import '@/styles/index.scss';

const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(matched ? 'dark' : 'light');

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>,
);
