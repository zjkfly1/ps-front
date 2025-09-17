import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api'

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加认证token
    const token = localStorage.getItem('auth-token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加请求日志
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    })
    
    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 添加响应日志
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    })
    
    return response
  },
  (error: AxiosError) => {
    console.error('[API Response Error]', error)
    
    // 统一错误处理
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除本地token并跳转到登录页
          localStorage.removeItem('auth-token')
          localStorage.removeItem('auth-storage')
          message.error('登录已过期，请重新登录')
          window.location.href = '/login'
          break
          
        case 403:
          message.error('权限不足')
          break
          
        case 404:
          message.error('请求的资源不存在')
          break
          
        case 422:
          // 表单验证错误
          const errorMsg = (data as any)?.message || '请求参数错误'
          message.error(errorMsg)
          break
          
        case 500:
          message.error('服务器内部错误')
          break
          
        default:
          const defaultMsg = (data as any)?.message || '请求失败'
          message.error(defaultMsg)
      }
    } else if (error.request) {
      // 网络错误
      message.error('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      message.error('请求处理失败')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
