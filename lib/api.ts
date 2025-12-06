import axios from "axios"

const api = axios.create({
  baseURL: "https://mood-board-backend-two.vercel.app/",
  // baseURL: "http://localhost:3001/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - add userId to requests
api.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      config.headers["x-user-id"] = userId
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor (removed 401 handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default api
