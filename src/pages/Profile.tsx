import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../service/api'
import { DefaultProfile } from '../assets'
import type { UserProfileType } from '../types/dashboard'

export default function Profile() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEdit, setIsEdit] = useState(false)

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get<UserProfileType>('/profile'),
  })

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
    },
  })

  useEffect(() => {
    if (profileRes?.data) {
      reset({
        email: profileRes.data.email,
        first_name: profileRes.data.first_name,
        last_name: profileRes.data.last_name,
      })
    }
  }, [profileRes, reset])

  const updateProfile = useMutation({
    mutationFn: (data: {
      email: string
      first_name: string
      last_name: string
    }) => api.put('/profile/update', data),
    onSuccess: () => {
      alert('Profile berhasil diperbarui!')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setIsEdit(false)
    },
  })

  const updateImage = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.put('/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      alert('Foto berhasil diperbarui!')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 100) return alert('Ukuran file maksimal 100KB')
      updateImage.mutate(file)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    navigate('/login')
  }

  if (isLoading)
    return <div className='p-8 text-center'>Loading Profile...</div>

  const profile = profileRes?.data
  const imageUrl = profile?.profile_image.includes('null')
    ? DefaultProfile
    : profile?.profile_image

  return (
    <div className='flex flex-col items-center px-8 py-10 max-w-2xl mx-auto'>
      <div className='relative group'>
        <img
          src={imageUrl}
          alt='Profile'
          className='h-32 w-32 rounded-full border-2 border-gray-200 object-cover'
        />
        <label className='absolute bottom-0 right-0 bg-white border border-gray-300 p-2 rounded-full cursor-pointer shadow-sm hover:bg-gray-50'>
          <input
            type='file'
            className='hidden'
            accept='image/*'
            onChange={onFileChange}
          />
          ✏️
        </label>
      </div>

      <h1 className='mt-4 text-3xl font-bold'>
        {profile?.first_name} {profile?.last_name}
      </h1>

      <form
        onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
        className='w-full mt-10 space-y-6'
      >
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Email</label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>
              @
            </span>
            <input
              {...register('email')}
              readOnly
              className='w-full border border-gray-300 rounded-md py-3 pl-10 pr-4 bg-gray-50 outline-none text-gray-500 read-only:cursor-default'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Nama Depan</label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>
              👤
            </span>
            <input
              {...register('first_name', { required: true })}
              readOnly={!isEdit}
              className={`w-full border border-gray-300 rounded-md py-3 pl-10 pr-4 outline-none read-only:cursor-default ${!isEdit ? 'bg-gray-50' : 'focus:border-red-500'}`}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>Nama Belakang</label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>
              👤
            </span>
            <input
              {...register('last_name', { required: true })}
              readOnly={!isEdit}
              className={`w-full border border-gray-300 rounded-md py-3 pl-10 pr-4 outline-none read-only:cursor-default ${!isEdit ? 'bg-gray-50' : 'focus:border-red-500'}`}
            />
          </div>
        </div>

        <div className='pt-6 space-y-4'>
          {isEdit ? (
            <>
              <button
                type='submit'
                className='w-full py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors'
              >
                {updateProfile.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>

              <button
                type='button'
                onClick={() => {
                  setIsEdit(false)
                  reset()
                }}
                className='w-full py-3 border border-gray-300 text-gray-500 font-bold rounded-md hover:bg-gray-100 transition-colors'
              >
                Batalkan
              </button>
            </>
          ) : (
            <>
              <div
                onClick={() => setIsEdit(true)}
                className='w-full py-3 border border-red-500 text-red-500 font-bold rounded-md hover:bg-red-50 transition-colors text-center hover:cursor-pointer'
              >
                Edit Profile
              </div>

              <button
                type='button'
                onClick={handleLogout}
                className='w-full py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors'
              >
                Logout
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
