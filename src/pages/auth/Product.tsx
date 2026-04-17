import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ServiceItemType } from '../../types/dashboard'
import { api } from '../../service/api'
import { useNavigate, useParams } from 'react-router-dom'
import ProfileBalanceCard from '../../components/profile-balance-card'

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: servicesRes } = useQuery({
    queryKey: ['service'],
    queryFn: () => api.get<ServiceItemType[]>('/services'),
  })

  const mutation = useMutation({
    mutationFn: (code: string) =>
      api.post('/transaction', { service_code: code }),
    onSuccess: (res) => {
      alert(res.message || 'Pembayaran Berhasil!')
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      navigate('/')
    },
    onError: (err) => {
      alert(err.message || 'Pembayaran Gagal')
    },
  })

  const service = servicesRes?.data?.find((s) => s.service_code === id)

  const onSubmit = () => {
    if (service) {
      mutation.mutate(service?.service_code)
    }
  }

  return (
    <div>
      <ProfileBalanceCard />

      <div className='mt-12 mb-8'>
        <span>PemBayaran</span>

        <div className='flex items-center gap-4 mt-4 w-fit'>
          <img
            src={service?.service_icon}
            alt={service?.service_name}
            className='h-12 w-12 object-cover'
          />
          <span className='font-semibold text-center w-full'>
            {service?.service_name}
          </span>
        </div>
      </div>

      <div className='flex-1 flex flex-col gap-4'>
        <div className='w-full border border-gray-300 rounded-md py-3 px-4 gap-4 flex outline-none'>
          <span className='grayscale'>💵</span>
          <span>
            {service?.service_tariff
              ? Number(service?.service_tariff).toLocaleString('id-ID')
              : ''}
          </span>
        </div>

        <button
          type='submit'
          className='w-full mt-4 py-3 rounded-md font-semibold text-white transition-all  hover:cursor-pointer hover:bg-red-500/80 bg-red-500'
          onClick={onSubmit}
        >
          Bayar
        </button>
      </div>
    </div>
  )
}
