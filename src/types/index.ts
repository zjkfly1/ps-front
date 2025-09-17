// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  credits: number
  avatar?: string
  createdAt: string
}

// 达人相关类型
export interface KOL {
  id: string
  name: string
  platform: 'tiktok' | 'xiaohongshu' | 'weibo' | 'bilibili' | 'other'
  profileUrl: string
  avatar?: string
  description?: string
  followerCount: number
  likeCount: number
  totalWorks: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

// 作品相关类型
export interface Work {
  id: string
  kolId: string
  title: string
  url: string
  platform: string
  publishTime: string
  likeCount: number
  commentCount: number
  shareCount: number
  viewCount?: number
  description?: string
  tags: string[]
  thumbnail?: string
  duration?: number
  createdAt: string
}

// 积分记录类型
export interface CreditRecord {
  id: string
  userId: string
  type: 'charge' | 'consume'
  amount: number
  balance: number
  description: string
  relatedTask?: string
  createdAt: string
}

// 任务类型
export interface Task {
  id: string
  userId: string
  type: 'import_kol' | 'import_work' | 'export_data'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  input: {
    url?: string
    kolId?: string
    [key: string]: any
  }
  result?: {
    kolData?: KOL
    workData?: Work[]
    exportUrl?: string
    [key: string]: any
  }
  creditCost: number
  errorMessage?: string
  createdAt: string
  completedAt?: string
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

// 列表查询参数类型
export interface QueryParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, any>
}

// 统计数据类型
export interface Stats {
  totalKOLs: number
  totalWorks: number
  totalCredits: number
  todayTasks: number
  monthlyGrowth: {
    kols: number
    works: number
    tasks: number
  }
}
