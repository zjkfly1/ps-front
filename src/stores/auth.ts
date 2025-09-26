import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state) => state.user,
    userCredits: (state) => state.user?.credits ?? 0,
    isLoggedIn: (state) => state.isAuthenticated && !!state.token
  },

  actions: {
    /**
     * 用户登录
     */
    async login(credentials: LoginRequest) {
      try {
        const response = await authApi.login(credentials)
        this.setAuth(response.user, response.token)
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    /**
     * 用户注册
     */
    async register(userData: RegisterRequest) {
      try {
        const response = await authApi.register(userData)
        // 注册成功后不自动登录，需要用户手动登录
        return response
      } catch (error) {
        throw error
      }
    },

    /**
     * 退出登录
     */
    async logout() {
      try {
        await authApi.logout()
      } catch (error) {
        console.error('退出登录API调用失败:', error)
      } finally {
        this.clearAuth()
      }
    },

    /**
     * 获取用户信息
     */
    async fetchUserProfile() {
      try {
        const user = await authApi.getCurrentUser()
        this.updateUser(user)
        return user
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    /**
     * 刷新Token
     */
    async refreshToken() {
      try {
        const response = await authApi.refreshToken()
        this.token = response.token
        localStorage.setItem('auth-token', response.token)
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    /**
     * 验证Token
     */
    async validateToken(): Promise<boolean> {
      try {
        const isValid = await authApi.validateToken()
        if (!isValid) {
          this.clearAuth()
        }
        return isValid
      } catch (error) {
        this.clearAuth()
        return false
      }
    },

    /**
     * 设置认证信息
     */
    setAuth(user: User, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('auth-token', token)
    },

    /**
     * 清除认证信息
     */
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('auth-token')
    },

    /**
     * 更新用户信息
     */
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
      }
    },

    /**
     * 更新用户积分
     */
    updateCredits(credits: number) {
      if (this.user) {
        this.user.credits = credits
      }
    },

    /**
     * 初始化认证状态（从localStorage恢复）
     */
    initAuth() {
      const token = localStorage.getItem('auth-token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
        // 可以在这里验证token有效性或获取用户信息
        this.fetchUserProfile().catch(() => {
          // 如果获取用户信息失败，清除认证状态
          this.clearAuth()
        })
      }
    }
  },

  persist: {
    key: 'auth-storage',
    paths: ['user', 'token', 'isAuthenticated']
  }
})
