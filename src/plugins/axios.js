import axios from 'axios'

const BASE_URL = 'https://dev.moydomonline.ru'

const axiosInstance = axios.create({
  baseURL: BASE_URL
})

axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('authenticityToken')
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
}, (error) => {
    return Promise.reject(error);
  }
)

export default axiosInstance