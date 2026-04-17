import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from './components/toast.tsx'
import { store } from './store/index.ts'
import { Provider } from 'react-redux'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
        <Toast />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
