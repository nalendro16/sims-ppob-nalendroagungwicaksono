import { createBrowserRouter } from 'react-router-dom'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/Dashboard'
import { ProtectedRoute, PublicRoute } from '../components/auth-guard'
import DashboardLayout from '../components/dashboard-layout'
import Transaction from '../pages/Transaction'
import TopUp from '../pages/TopUp'
import Product from '../pages/auth/Product'
import Profile from '../pages/Profile'

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/product/:id', element: <Product /> },
          { path: '/topup', element: <TopUp /> },
          { path: '/transaction', element: <Transaction /> },
          { path: '/account', element: <Profile /> },
        ],
      },
    ],
  },

  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
])
