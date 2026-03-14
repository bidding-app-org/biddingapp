import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL

if (!baseURL) {
  throw new Error('REACT_APP_API_URL is not defined. Set it in the .env file.')
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
