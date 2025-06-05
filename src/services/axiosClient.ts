import axios, { type AxiosInstance } from 'axios'

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5269',
})

export default axiosClient
