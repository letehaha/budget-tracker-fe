import React from 'react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import Router from './Router'
import store from './stores/redux/store'
import '@/styles/index.scss'

const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(matched ? 'dark' : 'light');

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>,
);
