import React from 'react';
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/styles/index.scss'

const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(matched ? 'dark' : 'light');

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
