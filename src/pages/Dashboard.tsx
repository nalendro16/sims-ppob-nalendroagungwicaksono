import { api } from '../service/api'
import { useQuery } from '@tanstack/react-query'
import type { BannerItemType, ServiceItemType } from '../types/dashboard'
import ProfileBalanceCard from '../components/profile-balance-card'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data: servicesRes, isLoading: isServicesLoading } = useQuery({
    queryKey: ['service'],
    queryFn: () => api.get<ServiceItemType[]>('/services'),
  })

  const { data: bannerRes, isLoading: isBannerLoading } = useQuery({
    queryKey: ['banner'],
    queryFn: () => api.get<BannerItemType[]>('/banner'),
  })

  const isPageLoading = isServicesLoading || isBannerLoading

  if (isPageLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='animate-pulse text-lg font-semibold text-gray-500'>
          Memuat data dashboard...
        </p>
      </div>
    )
  }

  return (
    <>
      <ProfileBalanceCard />

      <div className='flex items-center my-6 gap-4 overflow-x-auto no-scrollbar'>
        {servicesRes?.data?.map((service) => (
          <Link
            to={`/product/${service.service_code}`}
            key={service.service_code}
            className='p-4 flex flex-col items-center gap-2 w-1/4'
          >
            <div className='h-12 w-12'>
              <img
                src={service.service_icon}
                alt={service.service_name}
                className='h-12 w-12 object-cover'
              />
            </div>

            <span className='text-sm text-center w-full h-8'>
              {service.service_name}
            </span>
          </Link>
        ))}
      </div>

      <span className='mt-12 mb-8 font-semibold'>Temukan Promo Menarik</span>
      <div className='flex items-center gap-4 overflow-x-auto mt-2'>
        {bannerRes?.data?.map((banner) => (
          <div className='h-full w-full' key={banner.banner_name}>
            <img
              src={banner.banner_image}
              alt={banner.banner_name}
              className='w-full h-full object-cover'
            />
          </div>
        ))}
      </div>
    </>
  )
}
