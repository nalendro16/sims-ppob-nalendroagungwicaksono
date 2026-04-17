const BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface ApiResponse<T> {
  status: number
  message: string
  data?: T
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  requireAuth?: boolean
}

async function fetchClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { body, requireAuth = true, ...customConfig } = options

  const headers = new Headers({
    // 'Content-Type': 'application/json',
    Accept: 'application/json',
  })

  if (!(body instanceof FormData)) {
    headers.append('Content-Type', 'application/json')
  }

  if (requireAuth) {
    const token = sessionStorage.getItem('token')
    if (token) headers.append('Authorization', `Bearer ${token}`)
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  }

  if (body) {
    // config.body = JSON.stringify(body)
    config.body = body instanceof FormData ? body : JSON.stringify(body)
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Terjadi kesalahan pada server')
    }

    return data as ApiResponse<T>
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message)
    throw error
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
}
