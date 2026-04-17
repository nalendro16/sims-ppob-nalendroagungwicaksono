import { NavLink, Link } from 'react-router-dom'
import { Logo } from '../assets'

export default function Header() {
  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
    }`

  return (
    <nav className='sticky top-0 z-50 border-b border-gray-200 bg-white py-4 shadow-sm'>
      <div className='mx-auto flex max-w-5xl items-center justify-between px-4'>
        <Link to='/' className='flex items-center gap-2'>
          <img src={Logo} alt='Logo' className='h-8 w-auto' />
          <span className='text-lg font-bold'>SIMS PPOB</span>
        </Link>

        <div className='flex items-center gap-8'>
          <NavLink to='/topup' className={navLinkStyle}>
            Top Up
          </NavLink>

          <NavLink to='/transaction' className={navLinkStyle}>
            Transaction
          </NavLink>

          <NavLink to='/account' className={navLinkStyle}>
            Akun
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
