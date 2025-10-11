import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

console.log('API基础地址:', API_BASE_URL)
console.log('当前环境:', import.meta.env.MODE)

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
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
      const errorData = data as any
      
      switch (status) {
        case 401:
          // 未授权，清除本地token并跳转到登录页
          localStorage.removeItem('auth-token')
          localStorage.removeItem('auth-storage')
          ElMessage.error('登录已过期，请重新登录')
          router.push('/login')
          break
          
        case 403:
          ElMessage.error('权限不足')
          break
          
        case 404:
          ElMessage.error('请求的资源不存在')
          break
          
        case 422:
          // 表单验证错误
          const errorMsg = errorData?.message || '请求参数错误'
          ElMessage.error(errorMsg)
          break
          
        case 500:
          ElMessage.error('服务器内部错误')
          break
          
        default:
          // 使用后端返回的message字段
          const defaultMsg = errorData?.message || '请求失败'
          ElMessage.error(defaultMsg)
      }
    } else if (error.request) {
      // 网络错误
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      ElMessage.error('请求处理失败')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient