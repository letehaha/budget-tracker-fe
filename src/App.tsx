import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Link to={'/dashboard'}>Dashboard</Link>
      <Link to={'/sign-up'}>Register</Link>
      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Outlet />
    </>
  );
}
