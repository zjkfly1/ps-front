import apiClient from './client'
import type { 
  ApiResponse,
  KOL,
  Task,
  QueryParams,
  Influencer,
  InfluencerQueryParams,
  PagedResponse
} from '@/types'

// 导入达人请求类型 - 匹配最新后端API
export interface ImportInfluencersRequest {
  platform: string
  urls?: string[] // 达人链接数组
  platform_ids?: string[] // 平台ID数组
  posts?: string[] // 作品链接数组
  
  // 监测相关配置
  enable_monitored?: boolean // 是否启用监测
  monitored_expire_at?: string // 监测过期时间 YYYY-MM-DD
  
  // 作品相关配置
  include_posts?: boolean // 是否包含作品
  content_list_monitored?: boolean // 是否监测作品列表
  content_list_expire_at?: string // 作品列表过期时间 YYYY-MM-DD
  posts_updated_since?: string // 作品更新时间 YYYY-MM-DD
}

// 导入达人响应类型
export interface ImportInfluencersResponse {
  taskId: string
  message: string
  estimatedTime?: number // 预计处理时间（秒）
}

// 导入历史查询参数
export interface ImportHistoryParams {
  page?: number
  page_size?: number
  platform?: string
  platform_id?: string
  status?: number // 1成功 2失败
  start_date?: string // YYYY-MM-DD格式
  end_date?: string // YYYY-MM-DD格式
}

// 导入历史记录项 - 匹配实际API返回结构
export interface ImportHistoryItem {
  id: number
  platform: string
  platform_id?: string
  source_url?: string
  status: number // 1成功 2失败
  message: string
  created_at: string
}

// 导入历史响应结构
export interface ImportHistoryResponse {
  data: ImportHistoryItem[]
  total: number
  page: number
  size: number
}

/**
 * 达人相关API接口
 */
export const kolApi = {
  /**
   * 导入达人信息
   * @param data 导入请求数据
   * @returns 导入任务信息
   */
  importInfluencers: async (data: ImportInfluencersRequest): Promise<ImportInfluencersResponse> => {
    const response = await apiClient.post<ApiResponse<ImportInfluencersResponse>>('/influencers/import', data)
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '导入达人失败')
    }
  },

  /**
   * 获取达人导入历史
   * @param params 查询参数
   * @returns 导入历史列表
   */
  getImportHistory: async (params?: ImportHistoryParams): Promise<ImportHistoryResponse> => {
    const response = await apiClient.get<ApiResponse<ImportHistoryResponse>>('/influencers/import/history', { params })
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取导入历史失败')
    }
  },

  /**
   * 获取达人列表
   * @param params 查询参数
   * @returns 达人列表
   */
  getInfluencers: async (params?: InfluencerQueryParams): Promise<PagedResponse<Influencer>> => {
    const response = await apiClient.get<PagedResponse<Influencer>>('/influencers', { params })
    
    if (response.data.code === 200) {
      return response.data
    } else {
      throw new Error(response.data.message || '获取达人列表失败')
    }
  },

  /**
   * 获取KOL列表（旧版本兼容）
   * @param params 查询参数
   * @returns KOL列表
   */
  getKOLList: async (params?: QueryParams): Promise<{
    list: KOL[]
    total: number
    page: number
    pageSize: number
  }> => {
    const response = await apiClient.get<ApiResponse<{
      list: KOL[]
      total: number
      page: number
      pageSize: number
    }>>('/influencers', { params })
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取达人列表失败')
    }
  },

  /**
   * 获取KOL详情
   * @param kolId KOL ID
   * @returns KOL详情
   */
  getKOLDetail: async (kolId: string): Promise<KOL> => {
    const response = await apiClient.get<ApiResponse<KOL>>(`/influencers/${kolId}`)
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取达人详情失败')
    }
  },

  /**
   * 删除KOL
   * @param kolId KOL ID
   */
  deleteKOL: async (kolId: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/influencers/${kolId}`)
    
    if (response.data.code !== 200) {
      throw new Error(response.data.message || '删除达人失败')
    }
  }
}
