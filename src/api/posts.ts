import apiClient from './client'
import type { ApiResponse } from '@/types'

// 导入作品请求类型
export interface ImportPostsRequest {
  platform: string // 平台名称（必填）支持：douyin/xhs/weibo/kuaishou等
  urls?: string[] // 作品链接列表（选填）
  platform_ids?: string[] // 平台作品ID列表（选填）
  enable_monitored?: boolean // 是否开启监控（选填）
  monitored_expire_at?: string // 监控过期时间，格式YYYY-MM-DD（选填）
  group_id?: number // 爬虫任务组ID，默认300（选填）
  source?: number // 作品来源：1-用户导入，2-用户作品列表导入，默认1（选填）
}

// 导入作品响应类型
export interface ImportPostsResponse {
  taskId: string
  message: string
  estimatedTime?: number // 预计处理时间（秒）
}

/**
 * 作品相关API接口
 */
export const postsApi = {
  /**
   * 导入作品信息
   * @param data 导入请求数据
   * @returns 导入任务信息
   */
  importPosts: async (data: ImportPostsRequest): Promise<ImportPostsResponse> => {
    const response = await apiClient.post<ApiResponse<ImportPostsResponse>>('/posts/import', data)
    
    if (response.data.code === 200 && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '导入作品失败')
    }
  }
}

