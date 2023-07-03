import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/stores/redux/store'
import Login from '@/pages/auth/login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/index'
import Application from '@/pages/Application'

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
          <Route path="/" element={<Application />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Auth routes */}
        <Route element={<AuthOutlet />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Public routes */}
      </Routes>
    </BrowserRouter>
  )
}
