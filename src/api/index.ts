// API 模块统一导出
export { default as apiClient } from './client'
export { authApi } from './auth'

// 导出所有API实例
export const api = {
  auth: authApi,
}

export default api
