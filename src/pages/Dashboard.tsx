import { api } from '../service/api'
import { useQuery } from '@tanstack/react-query'
import type { BannerItemType, ServiceItemType } from '../types/dashboard'
import ProfileBalanceCard from '../components/profile-balance-card'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const {
    data: servicesRes,
    isLoading: isServicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ['service'],
    queryFn: () => api.get<ServiceItemType[]>('/services'),
  })

  const {
    data: bannerRes,
    isLoading: isBannerLoading,
    error: bannerError,
    refetch: refetchBanners,
  } = useQuery({
    queryKey: ['banner'],
    queryFn: () => api.get<BannerItemType[]>('/banner'),
  })

  return (
    <>
      <ProfileBalanceCard />

      <div className='flex items-center my-6 gap-4 overflow-x-auto no-scrollbar'>
        {isServicesLoading ? (
          <div className='flex gap-4 py-4 animate-pulse'>
            {[...Array(12)].map((_, i) => (
              <div key={i} className='h-20 w-20 bg-gray-200 rounded-lg' />
            ))}
          </div>
        ) : servicesError ? (
          <div className='p-4 bg-red-50 border border-red-100 rounded-lg text-center'>
            <p className='text-xs text-red-600 mb-2'>
              Gagal memuat layanan: {(servicesError as Error).message}
            </p>
            <button
              onClick={() => refetchServices()}
              className='text-xs font-bold text-red-500 underline'
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-4 overflow-x-auto no-scrollbar'>
            {servicesRes?.data?.map((service) => (
              <Link
                to={`/product/${service.service_code}`}
                key={service.service_code}
                className='p-4 flex flex-col items-center gap-2 min-w-25'
              >
                <img
                  src={service.service_icon}
                  alt={service.service_name}
                  className='h-12 w-12 object-cover'
                />
                <span className='text-xs text-center line-clamp-2'>
                  {service.service_name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <span className='mt-12 mb-8 font-semibold'>Temukan Promo Menarik</span>
      <div className='flex items-center gap-4 overflow-x-auto mt-2'>
        {isBannerLoading ? (
          <div className='flex gap-4 mt-4 animate-pulse'>
            <div className='h-32 w-full bg-gray-200 rounded-xl' />
          </div>
        ) : bannerError ? (
          <div className='mt-4 p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center'>
            <p className='text-sm text-gray-500 mb-2'>
              Promo tidak tersedia saat ini
            </p>
            <button
              onClick={() => refetchBanners()}
              className='text-xs font-bold text-red-500 underline'
            >
              Muat Ulang Promo
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-4 overflow-x-auto mt-4 no-scrollbar'>
            {bannerRes?.data?.map((banner) => (
              <div className='min-w-70 h-32' key={banner.banner_name}>
                <img
                  src={banner.banner_image}
                  alt={banner.banner_name}
                  className='w-full h-full object-cover rounded-xl'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
