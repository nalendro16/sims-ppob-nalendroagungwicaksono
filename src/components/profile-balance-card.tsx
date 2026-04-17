import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../service/api'
import { DefaultProfile } from '../assets'
import type { UserBalanceType, UserProfileType } from '../types/dashboard'

export default function ProfileBalanceCard({
  className,
}: {
  className?: string
}) {
  const [showBalance, setShowBalance] = useState(false)
  const toggleBalance = () => setShowBalance(!showBalance)

  const { data: profileRes, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<UserProfileType>('/profile'),
  })

  const { data: balanceRes, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: () => api.get<UserBalanceType>('/balance'),
  })

  if (isProfileLoading || isBalanceLoading) {
    return (
      <div
        className={`flex items-center justify-between animate-pulse ${className}`}
      >
        <div className='flex w-1/2 flex-col gap-4'>
          <div className='h-20 w-20 rounded-full bg-gray-200'></div>
          <div className='h-6 w-48 rounded bg-gray-200 mt-2'></div>
          <div className='h-10 w-64 rounded bg-gray-200'></div>
        </div>

        <div className='h-40 w-1/2 rounded-xl bg-gray-200'></div>
      </div>
    )
  }

  const profile = profileRes?.data
  const balance = balanceRes?.data?.balance || 0

  const imageUrl =
    profile?.profile_image ===
    'https://minio.nutech-integrasi.com/take-home-test/null'
      ? DefaultProfile
      : profile?.profile_image

  return (
    <div className='flex items-center justify-between'>
      <div className='flex w-1/2 flex-col'>
        <div className='mb-4'>
          <img
            src={imageUrl}
            alt='Profile'
            className='h-20 w-20 rounded-full border border-gray-200 object-cover'
          />
        </div>
        <span className='mt-4 text-2xl text-gray-600'>Selamat Datang, </span>
        <span className='text-4xl font-semibold text-gray-800'>
          {profile?.first_name} {profile?.last_name}
        </span>
      </div>

      <div className='bg-card-saldo relative w-1/2 overflow-hidden rounded-xl p-6 text-white shadow-md'>
        <div className='absolute inset-0 z-0 bg-black/10'></div>
        <div className='relative z-10 flex flex-col items-start'>
          <p className='mb-2 text-sm opacity-90'>Saldo Anda</p>
          <h2 className='text-3xl font-bold'>
            {showBalance
              ? `Rp ${balance.toLocaleString('id-ID')}`
              : 'Rp ••••••••'}
          </h2>
          <div className='mt-4 flex items-center gap-2'>
            <div className='inline-block text-xs font-semibold opacity-80 hover:opacity-100'>
              Lihat Saldo
            </div>
            <button
              onClick={toggleBalance}
              className='focus:outline-none opacity-80 transition-opacity hover:opacity-100'
            >
              {showBalance ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.822 7.822L21 21m-7.772-7.772a3 3 0 0 1-4.243-4.243m4.243 4.243-3.65-3.65'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.412 8.143 7.033 5 12 5c4.968 0 8.588 3.143 9.964 6.678.04.104.04.212 0 .316C20.588 15.857 16.967 19 12 19c-4.968 0-8.588-3.143-9.964-6.678Z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
