import dayjs from 'dayjs'

export default function TransactionCard({
  transaction,
}: {
  transaction: {
    invoice_number: string
    transaction_type: string
    total_amount: number
    created_on: string
    description: string
  }
}) {
  return (
    <div className='w-full outline outline-neutral-400/80 px-6 py-2 rounded-md flex justify-between gap-1'>
      <div>
        <p
          className={
            transaction.transaction_type === 'TOPUP'
              ? 'text-green-600/90 font-semibold'
              : 'text-red-500/90 font-semibold'
          }
        >
          {transaction.transaction_type === 'TOPUP' ? '+' : '-'}{' '}
          {transaction.total_amount.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
          })}
        </p>
        <p className='text-sm text-neutral-400/80'>
          {dayjs(transaction.created_on).format('DD MMM YYYY HH:mm')}
        </p>
      </div>

      <div className='text-sm text-neutral-500'>{transaction.description}</div>
    </div>
  )
}
