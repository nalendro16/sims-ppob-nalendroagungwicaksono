import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { hideToast } from '../store/slices/uiSlice'

export default function Toast() {
  const dispatch = useDispatch<AppDispatch>()
  const toast = useSelector((state: RootState) => state.ui.toast)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(hideToast())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [toast, dispatch])

  if (!toast) return null

  return (
    <div className='fixed bottom-5 right-5 z-9999 animate-bounce-in'>
      <div
        className={`px-6 py-3 rounded-lg shadow-lg font-semibold ${
          toast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-white text-red-500 border border-red-500'
        }`}
      >
        {toast.type === 'success' ? '✅ ' : '❌ '}
        {toast.message}
      </div>
    </div>
  )
}
