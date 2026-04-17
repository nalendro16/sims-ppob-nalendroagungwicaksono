import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { IllustrasiLogin, Logo } from '../../assets'
import { useState } from 'react'
import { api } from '../../service/api'
import { useDispatch } from 'react-redux'
import { showToast } from '../../store/slices/uiSlice'

const registerSchema = z
  .object({
    email: z.string().email('Format email tidak valid'),
    first_name: z.string().min(2, 'Nama depan minimal 2 karakter'),
    last_name: z.string().min(2, 'Nama belakang minimal 2 karakter'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

type RegisterInput = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await api.post(
        '/registration',
        {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        },
        { requireAuth: false },
      )

      dispatch(
        showToast({
          message: response.message || 'Registrasi Berhasil!',
          type: 'success',
        }),
      )

      navigate('/login')
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else if (typeof error === 'string') {
        setErrorMessage(error)
      } else {
        setErrorMessage('Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex'>
      <div className='flex min-h-screen items-center justify-center p-4 w-1/2'>
        <div className='w-full max-w-md rounded-xl bg-white p-8'>
          <div className='flex gap-2 items-center justify-center mb-4'>
            <img src={Logo} alt='Logo PPOB' className='w-8 h-8' />
            <h1 className='text-center text-2xl font-bold text-red-500'>
              SIMS PPOB
            </h1>
          </div>
          <h2 className='mb-6 text-center text-xl font-semibold'>
            Lengkapi data untuk membuat akun
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <input
                {...register('email')}
                type='email'
                placeholder='masukan email anda'
                autoComplete='off'
                className={`w-full rounded-md border p-3 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('first_name')}
                type='first_name'
                placeholder='nama depan'
                autoComplete='off'
                className={`w-full rounded-md border p-3 outline-none ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.first_name && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('last_name')}
                type='last_name'
                placeholder='nama belakang'
                autoComplete='off'
                className={`w-full rounded-md border p-3 outline-none ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.last_name && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.last_name.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('password')}
                type='password'
                placeholder='buat password'
                className={`w-full rounded-md border p-3 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('confirmPassword')}
                type='password'
                placeholder='konfirmasi password'
                className={`w-full rounded-md border p-3 outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={!isValid || isLoading}
              className='w-full rounded-md bg-red-500 p-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:bg-gray-300 mt-6'
            >
              {isLoading ? 'Memproses...' : 'Registrasi'}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            sudah punya akun? login{' '}
            <Link to='/login' className='font-bold text-red-500'>
              di sini
            </Link>
          </p>

          {errorMessage && (
            <div className='rounded bg-red-100 p-3 text-sm text-red-600 mt-4'>
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      <div className='w-1/2'>
        <img
          src={IllustrasiLogin}
          alt='login illustration'
          className='object-cover h-screen w-full'
        />
      </div>
    </div>
  )
}
