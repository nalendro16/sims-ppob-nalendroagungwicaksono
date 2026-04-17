import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../service/api'
import ProfileBalanceCard from '../components/profile-balance-card'

const PRESETS = [10000, 20000, 50000, 100000, 250000, 500000]

export default function TopUp() {
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    setValue,

    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { top_up_amount: '' },
  })

  const mutation = useMutation({
    mutationFn: (amount: number) =>
      api.post('/topup', { top_up_amount: amount }),
    onSuccess: (res) => {
      alert(res.message || 'Top Up Berhasil!')
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      setValue('top_up_amount', '')
    },
    onError: (err) => {
      alert(err.message || 'Top Up Gagal')
    },
  })

  const onSubmit = (data: { top_up_amount: string }) => {
    const nominal = parseInt(data.top_up_amount)
    if (nominal > 1000000) return alert('Maksimal Top Up adalah Rp1.000.000')
    mutation.mutate(nominal)
  }

  return (
    <>
      <ProfileBalanceCard />

      <div className='mt-12'>
        <p className='text-lg'>Silahkan masukan</p>
        <h1 className='text-3xl font-bold'>Nominal Top Up</h1>

        <div className='mt-8 flex flex-col md:flex-row gap-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex-1 flex flex-col gap-4'
          >
            <Controller
              name='top_up_amount'
              control={control}
              rules={{
                required: true,
                min: 10000,
                max: 1000000,
              }}
              render={({ field: { onChange, value } }) => (
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 grayscale'>
                    💵
                  </span>
                  <input
                    type='text'
                    placeholder='masukan nominal Top Up'
                    className='w-full border border-gray-300 rounded-md py-3 pl-10 pr-4 outline-none focus:border-red-500'
                    value={value ? Number(value).toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '')

                      onChange(rawValue)
                    }}
                  />
                </div>
              )}
            />

            <button
              type='submit'
              disabled={!isValid || mutation.isPending}
              className={`w-full py-3 rounded-md font-semibold text-white transition-all hover:cursor-pointer hover:bg-red-500/80 ${
                isValid && !mutation.isPending ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              {mutation.isPending ? 'Processing...' : 'Top Up'}
            </button>
          </form>

          <div className='grid grid-cols-3 gap-3 w-full md:w-1/3'>
            {PRESETS.map((nominal) => (
              <button
                key={nominal}
                type='button'
                onClick={() =>
                  setValue('top_up_amount', nominal.toString(), {
                    shouldValidate: true,
                  })
                }
                className='border border-gray-300 py-3 rounded-md text-sm hover:bg-gray-50 transition-colors'
              >
                Rp{nominal.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
