import apiClient from './client'
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ApiResponse,
  User,
  UserForFrontend
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
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data)
    
    if (response.data.code === 200 && response.data.data) {
      // 存储token到localStorage
      localStorage.setItem('auth-token', response.data.data.token)
      
      // 创建用户对象，映射字段名
      const userForFrontend: UserForFrontend = {
        ...response.data.data.user,
        credits: response.data.data.user.points, // 映射 points 到 credits
        createdAt: response.data.data.user.created_at // 映射 created_at 到 createdAt
      }
      
      return {
        user: userForFrontend as any, // 临时类型转换
        token: response.data.data.token
      }
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
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data)
    
    if (response.data.code === 200 && response.data.data) {
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
      await apiClient.post('/auth/logout')
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
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/profile')
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data.user || response.data.data as any
    } else {
      throw new Error(response.data.message || '获取用户信息失败')
    }
  },

  /**
   * 刷新token
   * @returns 新的token信息
   */
  refreshToken: async (): Promise<{ token: string; expiresIn: number }> => {
    const response = await apiClient.post<ApiResponse<{ token: string; expiresIn: number }>>('/auth/refresh-token')
    
    if (response.data.code === 200 && response.data.data) {
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
      const response = await apiClient.get<ApiResponse<{ valid: boolean }>>('/auth/validate-token')
      return response.data.code === 200 && response.data.data?.valid === true
    } catch (error) {
      return false
    }
  }
}