import { useState } from 'react'
import { Provider } from 'react-redux'
import Router from '@/router'
import store from '@/stores/redux/store'

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Provider store={store}>
        <Router />
      </Provider>
    </>
  );
}
