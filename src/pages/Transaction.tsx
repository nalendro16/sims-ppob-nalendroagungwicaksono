import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ProfileBalanceCard from '../components/profile-balance-card'
import { api } from '../service/api'
import type {
  TransactionHistoryResponse,
  TransactionItemType,
} from '../types/transaction'
import TransactionCard from '../components/transaction-card'

export default function Transaction() {
  const [limit] = useState(5)
  const [offset, setOffset] = useState(0)
  const [allRecords, setAllRecords] = useState<TransactionItemType[]>([])
  const [hasMore, setHasMore] = useState(true)

  const { isLoading, isFetching } = useQuery({
    queryKey: ['transactions-list', offset],
    queryFn: async () => {
      const res = await api.get<TransactionHistoryResponse>(
        `/transaction/history?offset=${offset}&limit=${limit}`,
      )

      const newRecords = res.data?.records || []

      setAllRecords((prev) => [...prev, ...newRecords])

      if (newRecords.length < limit) {
        setHasMore(false)
      }

      return res.data
    },
  })

  const handleShowMore = () => {
    setOffset((prev) => prev + limit)
  }

  if (isLoading && offset === 0) {
    return (
      <div className='p-8 text-center animate-pulse'>Memuat Transaksi...</div>
    )
  }

  return (
    <>
      <ProfileBalanceCard className='mb-8' />

      <div className='text-lg font-semibold my-6'>Semua Transaksi</div>

      {allRecords.length !== 0 ? (
        <div className='space-y-6'>
          {allRecords.map((transaction, index) => (
            <TransactionCard
              transaction={transaction}
              key={`${transaction.invoice_number}-${index}`}
            />
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-400 mt-8 mb-10 text-sm'>
          Tidak ada transaksi untuk ditampilkan
        </p>
      )}

      {hasMore && (
        <div className='mt-10 mb-10 text-center'>
          <button
            onClick={handleShowMore}
            disabled={isFetching}
            className='font-bold text-red-500 hover:text-red-700 transition-colors disabled:text-gray-400'
          >
            {isFetching ? 'Memuat...' : 'Show More'}
          </button>
        </div>
      )}

      {!hasMore && allRecords.length > 0 && (
        <p className='text-center text-gray-400 mt-8 mb-10 text-sm'>
          Semua transaksi telah ditampilkan
        </p>
      )}
    </>
  )
}
