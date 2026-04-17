import { Navigate, Outlet } from 'react-router-dom'

export const PublicRoute = () => {
  const token = sessionStorage.getItem('token')

  if (token) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

export const ProtectedRoute = () => {
  const token = sessionStorage.getItem('token')

  if (!token) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
