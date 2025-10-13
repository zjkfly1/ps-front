<template>
  <div class="works-list">
    <el-page-header @back="false" content="作品列表" />
    
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.search"
            placeholder="搜索作品标题"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="达人">
          <el-select
            v-model="searchForm.kolId"
            placeholder="选择达人"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="kol in kolOptions"
              :key="kol.id"
              :label="kol.name"
              :value="kol.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台">
          <el-select
            v-model="searchForm.platform"
            placeholder="选择平台"
            clearable
            style="width: 120px"
          >
            <el-option label="抖音" value="douyin" />
            <el-option label="小红书" value="xiaohongshu" />
            <el-option label="微博" value="weibo" />
            <el-option label="B站" value="bilibili" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 作品列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>作品列表 ({{ total }})</span>
        </div>
      </template>
      
      <el-table
        :data="worksList"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column label="作品信息" min-width="300">
          <template #default="{ row }">
            <div class="work-info">
              <el-image
                :src="row.thumbnail"
                :fit="'cover'"
                class="thumbnail"
                lazy
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="info">
                <div class="title">{{ row.title }}</div>
                <div class="meta">
                  <el-tag size="small" type="info">{{ getPlatformName(row.platform) }}</el-tag>
                  <span class="time">{{ formatTime(row.publishTime) }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="likeCount" label="点赞数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.likeCount) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="commentCount" label="评论数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.commentCount) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="shareCount" label="分享数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.shareCount) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="viewCount" label="播放数" width="100">
          <template #default="{ row }">
            {{ row.viewCount ? formatNumber(row.viewCount) : '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="标签" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags.slice(0, 2)"
              :key="tag"
              size="small"
              style="margin-right: 4px"
            >
              {{ tag }}
            </el-tag>
            <span v-if="row.tags.length > 2" class="more-tags">...</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewDetail(row)">
              查看详情
            </el-button>
            <el-button type="text" size="small" @click="openLink(row.url)">
              打开链接
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { Work, KOL } from '@/types'

const route = useRoute()

// 响应式数据
const loading = ref(false)
const worksList = ref<Work[]>([])
const kolOptions = ref<KOL[]>([])
const total = ref(0)

const searchForm = reactive({
  search: '',
  kolId: '',
  platform: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20
})

// 方法
const fetchWorksList = async () => {
  loading.value = true
  try {
    // TODO: 从API获取作品列表
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    worksList.value = [
      {
        id: '1',
        kolId: '1',
        title: '今天分享一道超好吃的家常菜',
        url: 'https://example.com/work1',
        platform: 'xiaohongshu',
        publishTime: new Date().toISOString(),
        likeCount: 15600,
        commentCount: 234,
        shareCount: 89,
        viewCount: 45000,
        description: '简单易学的家常菜制作方法',
        tags: ['美食', '家常菜', '简单'],
        thumbnail: 'https://example.com/thumb1.jpg',
        duration: 120,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        kolId: '2',
        title: '最新iPhone评测，值得入手吗？',
        url: 'https://example.com/work2',
        platform: 'tiktok',
        publishTime: new Date().toISOString(),
        likeCount: 23400,
        commentCount: 567,
        shareCount: 145,
        viewCount: 78000,
        description: '详细评测最新iPhone的各项功能',
        tags: ['科技', '手机', '评测'],
        thumbnail: 'https://example.com/thumb2.jpg',
        duration: 300,
        createdAt: new Date().toISOString()
      }
    ]
    
    total.value = 2
  } catch (error) {
    console.error('获取作品列表失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchKOLOptions = async () => {
  try {
    // TODO: 从API获取达人选项
    // 模拟数据
    kolOptions.value = [
      { id: '1', name: '美食博主小王' } as KOL,
      { id: '2', name: '科技达人小李' } as KOL
    ]
  } catch (error) {
    console.error('获取达人选项失败:', error)
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchWorksList()
}

const resetSearch = () => {
  searchForm.search = ''
  searchForm.kolId = ''
  searchForm.platform = ''
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchWorksList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchWorksList()
}

const getPlatformName = (platform: string) => {
  const names: Record<string, string> = {
    tiktok: '抖音',
    xiaohongshu: '小红书',
    weibo: '微博',
    bilibili: 'B站',
    other: '其他'
  }
  return names[platform] || platform
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

const formatTime = (time: string) => {
  return dayjs(time).format('MM-DD HH:mm')
}

const viewDetail = (work: Work) => {
  ElMessage.info('查看详情功能开发中...')
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

// 生命周期
onMounted(() => {
  // 如果有kolId查询参数，设置默认筛选
  if (route.query.kolId) {
    searchForm.kolId = route.query.kolId as string
  }
  
  fetchKOLOptions()
  fetchWorksList()
})
</script>

<style scoped>
.works-list {
  max-width: 1200px;
}

.search-card {
  margin: 20px 0;
}

.list-card {
  margin: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.work-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  flex-shrink: 0;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.info {
  flex: 1;
  min-width: 0;
}

.info .title {
  font-weight: 500;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info .meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info .time {
  color: #909399;
  font-size: 12px;
}

.more-tags {
  color: #909399;
  font-size: 12px;
}
</style>
