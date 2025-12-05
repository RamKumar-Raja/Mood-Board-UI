import api from "./api"
import type { AuthResponse, User } from "./types"

export const authService = {
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/signup", { email, password, name })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response?.data?.user))
    }
    return response.data
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me")
    return response.data
  },

  isAuthenticated(): boolean {
    return true
  },
}
