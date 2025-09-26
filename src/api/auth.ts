import apiClient from './client'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ApiResponse,
  User
} from '@/types'

/**
 * 认证相关API接口
 */
export const authApi = {
  /**
   * 用户登录
   * @param data 登录数据
   * @returns 登录响应
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/user/login', data)
    
    if (response.data.success && response.data.data) {
      // 存储token到localStorage
      localStorage.setItem('auth-token', response.data.data.token)
      return response.data.data
    } else {
      throw new Error(response.data.message || '登录失败')
    }
  },

  /**
   * 用户注册
   * @param data 注册数据
   * @returns 注册响应
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/user/register', data)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '注册失败')
    }
  },

  /**
   * 退出登录
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/user/logout')
    } catch (error) {
      console.warn('退出登录请求失败，但仍将清除本地数据')
    } finally {
      // 清除本地存储的认证信息
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-storage')
    }
  },

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/user/profile')
    
    if (response.data.success && response.data.data) {
      return response.data.data.user
    } else {
      throw new Error(response.data.message || '获取用户信息失败')
    }
  },

  /**
   * 刷新token
   * @returns 新的token信息
   */
  refreshToken: async (): Promise<{ token: string; expiresIn: number }> => {
    const response = await apiClient.post<ApiResponse<{ token: string; expiresIn: number }>>('/user/refresh-token')
    
    if (response.data.success && response.data.data) {
      // 更新本地token
      localStorage.setItem('auth-token', response.data.data.token)
      return response.data.data
    } else {
      throw new Error(response.data.message || '刷新token失败')
    }
  },

  /**
   * 验证token是否有效
   */
  validateToken: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get<ApiResponse<{ valid: boolean }>>('/user/validate-token')
      return response.data.success && response.data.data?.valid === true
    } catch (error) {
      return false
    }
  }
}