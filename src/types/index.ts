// 用户相关类型
export interface User {
  id: number // 后端返回的是数字类型
  username: string
  email: string
  phone?: string
  avatar?: string
  nickname?: string
  points: number // 后端字段名是 points，不是 credits
  status: number
  created_at: string // 后端字段名是 created_at
  updated_at: string // 后端字段名是 updated_at
}

// 为了兼容前端其他代码，添加一个计算属性类型
export interface UserForFrontend extends Omit<User, 'points' | 'created_at'> {
  credits: number // 映射 points 到 credits
  createdAt: string // 映射 created_at 到 createdAt
}

// 认证相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  user: User
  message: string
}

// 达人相关类型 - 匹配后端API返回结构
export interface Influencer {
  id: number
  platform: string // douyin, xiaohongshu, weibo, bilibili等
  platform_id: string // 平台ID
  profile_url: string // 主页链接
  username: string // 用户名
  nickname: string // 昵称
  avatar: string // 头像
  bio: string // 简介
  followers_count: number // 粉丝数
  following_count: number // 关注数
  posts_count: number // 作品数
  likes_count: number // 点赞数
  gender: string // 性别
  age: number // 年龄
  location: string // 地区
  tags: string[] | null // 标签
  verify_status: number // 认证状态(0未认证 1已认证)
  is_active: boolean // 是否活跃
  last_sync_at: string | null // 最后同步时间
  created_at: string // 创建时间
  updated_at: string // 更新时间
}

// 兼容旧的KOL类型
export interface KOL {
  id: string
  name: string
  platform: 'tiktok' | 'xiaohongshu' | 'weibo' | 'bilibili' | 'other'
  platformId?: string // 平台内的ID
  profileUrl: string
  avatar?: string
  description?: string
  followerCount: number
  likeCount: number
  totalWorks: number
  tags: string[]
  isVerified?: boolean // 是否认证
  region?: string // 地区
  category?: string // 分类
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

// API响应类型 - 匹配后端返回格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
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

// 达人列表查询参数
export interface InfluencerQueryParams {
  page?: number
  page_size?: number
  platform?: string // 平台
  username?: string // 用户名
  nickname?: string // 昵称
  gender?: string // 性别
  location?: string // 地区
  min_followers?: number // 最小粉丝数
  max_followers?: number // 最大粉丝数
  verify_status?: number // 认证状态(0未认证 1已认证)
  is_active?: boolean // 是否活跃
  sort_by?: string // 排序字段
  sort_order?: string // 排序方式(asc/desc)
}

// 分页响应类型
export interface PagedResponse<T = any> {
  code: number
  message: string
  data: T[]
  total: number
  page: number
  size: number
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

// 路由类型
export interface RouteMenuItem {
  path: string
  name: string
  icon?: string
  children?: RouteMenuItem[]
}