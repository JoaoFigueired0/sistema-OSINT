import axios from 'axios'

const client = axios.create({
  baseURL: 'https://sistema-osint-api.onrender.com',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Erro ${error.response.status}: ${error.response.statusText}`
      return Promise.reject(new Error(message))
    } else if (error.request) {
      return Promise.reject(
        new Error('Servidor não respondeu. Verifique se o backend está acessível em https://sistema-osint-api.onrender.com')
      )
    } else {
      return Promise.reject(new Error(error.message || 'Erro desconhecido'))
    }
  }
)

export default client
