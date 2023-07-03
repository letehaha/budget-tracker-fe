import { useState } from 'react'
import { Provider } from 'react-redux'
import Router from '@/router'
import store from '@/stores/redux/store'

export default function App() {
  return (
    <>
      <Provider store={store}>
        <Router />
      </Provider>
    </>
  );
}
