import api from "./api"
import type { AuthResponse, User } from "./types"

export const authService = {
  async signup(email: string, password: string, name: string): Promise<{ user: User }> {
    const response = await api.post<{ user: User }>("/auth/signup", { email, password, name })
    if (response.data.user?.id) {
      localStorage.setItem("userId", response.data.user.id)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  async login(email: string, password: string): Promise<{ user: User }> {
    const response = await api.post<{ user: User }>("/auth/login", { email, password })
    if (response.data.user?.id) {
      localStorage.setItem("userId", response.data.user.id)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
    localStorage.removeItem("userId")
    localStorage.removeItem("user")
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me")
    return response.data
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("userId")
  },
}
