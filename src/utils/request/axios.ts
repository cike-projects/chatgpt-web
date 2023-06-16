import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ALL_BASE_URL,
})

const goUrls = ['/member/wallet', '/member/info', '/auth/checkToken', '/bot/publicBot']

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    if (goUrls.includes(config.url)) {
      config.url = import.meta.env.VITE_APP_API_GO_BASE_URL + config.url
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
