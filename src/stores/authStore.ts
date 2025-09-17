import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/api/auth'

interface User {
  id: string
  username: string
  email: string
  credits: number
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  updateCredits: (credits: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
        
      logout: async () => {
        try {
          // 调用退出登录API
          await authApi.logout()
        } catch (error) {
          console.error('退出登录API调用失败:', error)
        } finally {
          // 无论API调用是否成功，都清除本地状态
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },
        
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
        
      updateCredits: (credits) =>
        set((state) => ({
          user: state.user ? { ...state.user, credits } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
