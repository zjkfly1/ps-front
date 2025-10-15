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

// 作品查询参数类型
export interface PostsQueryParams {
  page?: number // 页码
  page_size?: number // 每页数量
  influencer_id?: number // 达人ID
  platform?: string // 平台
  title?: string // 标题
  media_type?: string // 媒体类型
  min_views?: number // 最小播放量
  max_views?: number // 最大播放量
  min_likes?: number // 最小点赞数
  max_likes?: number // 最大点赞数
  source?: number // 来源(1:用户导入 2:达人作品列表导入)
  start_date?: string // 开始日期(YYYY-MM-DD)
  end_date?: string // 结束日期(YYYY-MM-DD)
  sort_by?: string // 排序字段
  sort_order?: string // 排序方式(asc/desc)
}

// 作品数据类型
export interface Post {
  id: number
  platform: string
  platform_id: string
  post_url: string
  source: number // 1:用户导入 2:达人作品列表导入
  title: string
  description: string
  cover_image: string
  media_type: string
  media_urls: string[] | null
  duration: number
  views_count: number
  likes_count: number
  comments_count: number
  shares_count: number
  collect_count: number
  tags: string[] | null
  location: string
  published_at: string
  enable_monitored: boolean
  monitored_expire_at: string
  schedule_id: number
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

// 作品列表响应类型
export interface PostsListResponse {
  data: Post[]
  total: number
  page: number
  size: number
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
  },

  /**
   * 获取作品列表
   * @param params 查询参数
   * @returns 作品列表
   */
  getPosts: async (params?: PostsQueryParams): Promise<PostsListResponse> => {
    // 后端返回格式：{code, message, data: [...], total, page, size}
    const response = await apiClient.get<{
      code: number
      message: string
      data: Post[]
      total: number
      page: number
      size: number
    }>('/posts', { params })
    
    if (response.data.code === 200) {
      // 返回统一的格式
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        size: response.data.size || 10
      }
    } else {
      throw new Error(response.data.message || '获取作品列表失败')
    }
  }
}

