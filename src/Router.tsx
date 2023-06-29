import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App';
import Register from './pages/auth/Register';
import Login from './pages/auth/login';
import Dashboard from './pages/dashboard/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      }
    ],
  },
  {
    path: '/sign-up',
    element: <Register />,
  },
  {
    path: '/sign-in',
    element: <Login />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
