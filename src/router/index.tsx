import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '@/stores/redux/store'
import { initializeApp } from '@/stores/redux/root'

import Login from '@/pages/auth/login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/index'
import Application from '@/pages/Application'
import SplashScreen from '@/pages/SplashScreen'

const SplashScreenOutlet = () => {
  const dispatchRedux = useAppDispatch()
  const isTokenChecked = useAppSelector((state) => state.auth.isTokenChecked)

  useEffect(() => {
    dispatchRedux(initializeApp())
  }, [])

  // TODO: Add transition
  if (isTokenChecked) return <Outlet />

  return <SplashScreen />
}

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
        <Route path="/" element={<SplashScreenOutlet />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
