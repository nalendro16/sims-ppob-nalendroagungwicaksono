import { Outlet } from 'react-router-dom'
import Header from './header'

export default function DashboardLayout() {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <main className='min-h-[calc(100vh-72px)] mx-auto max-w-5xl px-4 py-8'>
        {' '}
        <Outlet />
      </main>
    </div>
  )
}
