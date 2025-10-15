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
        <el-form-item label="平台">
          <el-select
            v-model="searchForm.platform"
            placeholder="选择平台"
            clearable
            style="width: 120px"
          >
            <el-option label="抖音" value="douyin" />
            <el-option label="小红书" value="xhs" />
            <el-option label="微博" value="weibo" />
            <el-option label="快手" value="kuaishou" />
            <el-option label="B站" value="bilibili" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select
            v-model="searchForm.source"
            placeholder="选择来源"
            clearable
            style="width: 150px"
          >
            <el-option label="用户导入" :value="1" />
            <el-option label="达人作品列表导入" :value="2" />
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
          <el-button type="success" @click="handleExport" :loading="exporting">
            <el-icon><Download /></el-icon>
            导出Excel
          </el-button>
        </div>
      </template>
      
      <div class="table-container">
        <el-table
          :data="worksList"
          v-loading="loading"
          style="width: 100%"
        >
        <el-table-column label="作品信息" min-width="300">
          <template #default="{ row }">
            <div class="work-info">
              <el-image
                :src="row.cover_image"
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
                  <el-tag size="small" :type="getSourceType(row.source)">{{ getSourceName(row.source) }}</el-tag>
                  <span class="time">{{ formatTime(row.published_at) }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="views_count" label="播放数" width="100">
          <template #default="{ row }">
            {{ row.views_count ? formatNumber(row.views_count) : '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="likes_count" label="点赞数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.likes_count) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="comments_count" label="评论数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.comments_count) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="shares_count" label="分享数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.shares_count) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="collect_count" label="收藏数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.collect_count) }}
          </template>
        </el-table-column>
        
        <el-table-column label="监测状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.enable_monitored" type="success" size="small">已开启</el-tag>
            <el-tag v-else type="info" size="small">未开启</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewDetail(row)">
              查看详情
            </el-button>
            <el-button type="text" size="small" @click="openLink(row.post_url)">
              打开链接
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
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
import { Picture, Download } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { postsApi, type Post, type PostsQueryParams } from '@/api/posts'

const route = useRoute()

// 响应式数据
const loading = ref(false)
const exporting = ref(false)
const worksList = ref<Post[]>([])
const total = ref(0)

const searchForm = reactive({
  search: '',
  platform: '',
  source: undefined as number | undefined
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

// 方法
const fetchWorksList = async () => {
  loading.value = true
  try {
    const params: PostsQueryParams = {
      page: pagination.page,
      page_size: pagination.pageSize
    }
    
    // 添加筛选条件
    if (searchForm.search) {
      params.title = searchForm.search
    }
    if (searchForm.platform) {
      params.platform = searchForm.platform
    }
    if (searchForm.source !== undefined) {
      params.source = searchForm.source
    }
    
    const result = await postsApi.getPosts(params)
    
    worksList.value = result.data || []
    total.value = result.total || 0
    
  } catch (error: any) {
    console.error('获取作品列表失败:', error)
    ElMessage.error(error.message || '获取作品列表失败')
    worksList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchWorksList()
}

const resetSearch = () => {
  searchForm.search = ''
  searchForm.platform = ''
  searchForm.source = undefined
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
    douyin: '抖音',
    xhs: '小红书',
    weibo: '微博',
    kuaishou: '快手',
    bilibili: 'B站'
  }
  return names[platform] || platform
}

const getSourceName = (source: number) => {
  const names: Record<number, string> = {
    1: '用户导入',
    2: '达人作品列表'
  }
  return names[source] || '未知'
}

const getSourceType = (source: number): 'success' | 'warning' => {
  return source === 1 ? 'success' : 'warning'
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const viewDetail = (work: Post) => {
  ElMessage.info('查看详情功能开发中...')
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

// 导出Excel
const handleExport = async () => {
  if (worksList.value.length === 0) {
    ElMessage.warning('当前没有数据可以导出')
    return
  }

  exporting.value = true
  try {
    // 准备导出数据
    const exportData = worksList.value.map((work) => ({
      '作品标题': work.title,
      '平台': getPlatformName(work.platform),
      '来源': getSourceName(work.source),
      '播放数': work.views_count || 0,
      '点赞数': work.likes_count || 0,
      '评论数': work.comments_count || 0,
      '分享数': work.shares_count || 0,
      '收藏数': work.collect_count || 0,
      '监测状态': work.enable_monitored ? '已开启' : '未开启',
      '发布时间': formatTime(work.published_at),
      '作品链接': work.post_url
    }))

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '作品列表')

    // 生成文件名
    const fileName = `作品列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`

    // 导出文件
    XLSX.writeFile(workbook, fileName)

    ElMessage.success('导出成功')
  } catch (error: any) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败: ' + (error.message || '未知错误'))
  } finally {
    exporting.value = false
  }
}

// 生命周期
onMounted(() => {
  // 如果有platform查询参数，设置默认筛选
  if (route.query.platform) {
    searchForm.platform = route.query.platform as string
  }
  
  // 如果有source查询参数，设置默认筛选
  if (route.query.source) {
    searchForm.source = Number(route.query.source)
  }
  
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

.table-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
}

.pagination {
  margin-top: 20px;
  text-align: right;
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
