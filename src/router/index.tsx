import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/stores/redux/store'
import Login from '@/pages/auth/login'

const PrivateOutlet = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

const AuthOutlet = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Private routes */}
        <Route path="/" element={<PrivateOutlet />}>
          <Route path="/" lazy={() => import('@/pages/Application')}>
            <Route path="dashboard" lazy={() => import('@/pages/dashboard/index')} />
          </Route>
        </Route>

        {/* Auth routes */}
        <Route element={<AuthOutlet />}>
          <Route path="/register" lazy={() => import('@/pages/auth/Register')} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Public routes */}
      </Routes>
    </BrowserRouter>
  )
}
