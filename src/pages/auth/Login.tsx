import { Link, useNavigate } from 'react-router-dom'
import { IllustrasiLogin, Logo } from '../../assets'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { useState } from 'react'
import { api } from '../../service/api'

const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

type LoginInput = z.infer<typeof LoginSchema>

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await api.post<{ token: string }>(
        '/login',
        {
          email: data.email,
          password: data.password,
        },
        { requireAuth: false },
      )

      sessionStorage.setItem('token', response.data?.token)
      alert(response.message || 'Login Berhasil!')

      navigate('/')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex'>
      <div className='flex min-h-screen items-center justify-center w-1/2'>
        <div className='w-full max-w-md rounded-xl bg-white p-8'>
          <div className='flex gap-2 items-center justify-center mb-4'>
            <img src={Logo} alt='Logo PPOB' className='w-8 h-8' />
            <h1 className='text-center text-2xl font-bold text-red-500'>
              SIMS PPOB
            </h1>
          </div>
          <h2 className='mb-6 text-center text-xl font-semibold'>
            Masuk atau buat akun untuk memulai
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
                {...register('password')}
                type='password'
                placeholder='buat password'
                autoComplete='off'
                className={`w-full rounded-md border p-3 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={!isValid || isLoading}
              className='w-full rounded-md bg-red-500 p-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:bg-gray-300 mt-6'
            >
              Masuk
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            belum punya akun? registrasi{' '}
            <Link to='/register' className='font-bold text-red-500'>
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
