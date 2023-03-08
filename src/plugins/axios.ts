import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
  baseURL: 'https://apiv4.cloudlms.top/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosIns.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken')

    if (token)
      config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error: any) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

axiosIns.interceptors.response.use(
  (response: any) => {
    return response.data
  },
  (error: any) => {
    return error
  },
)

export default axiosIns
