<template>
  <div class="kol-list">
    <el-page-header @back="false" content="达人列表" />
    
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.nickname"
            placeholder="搜索达人昵称"
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

    <!-- 达人列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>达人列表 ({{ total }})</span>
          <div class="header-actions">
            <el-button type="success" @click="handleExport" :loading="exporting">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
            <el-button type="primary" @click="handleImport">
              <el-icon><Plus /></el-icon>
              导入达人
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="table-container">
        <el-table
          :data="influencerList"
          v-loading="loading"
          style="width: 100%"
        >
        <el-table-column label="达人信息" min-width="200">
          <template #default="{ row }">
            <div class="kol-info">
              <el-avatar
                :src="row.avatar"
                :size="40"
                class="avatar"
              >
                {{ row.nickname ? row.nickname.charAt(0) : 'U' }}
              </el-avatar>
              <div class="info">
                <div class="name">{{ row.nickname || row.username || '未命名' }}</div>
                <div class="tags" v-if="row.tags && row.tags.length > 0">
                  <el-tag
                    v-for="tag in row.tags"
                    :key="tag"
                    size="small"
                    type="info"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="platform" label="平台" width="100">
          <template #default="{ row }">
            <el-tag :type="getPlatformType(row.platform)">
              {{ getPlatformName(row.platform) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="followers_count" label="粉丝数" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.followers_count) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="likes_count" label="点赞数" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.likes_count) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="posts_count" label="作品数" width="100" />
        
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewDetail(row)">
              查看详情
            </el-button>
            <el-button type="text" size="small" @click="viewWorks(row)">
              查看作品
            </el-button>
            <el-button type="text" size="small" @click="editInfluencer(row)">
              编辑
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import type { Influencer, InfluencerQueryParams } from '@/types'
import { kolApi } from '@/api/kol'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const exporting = ref(false)
const influencerList = ref<Influencer[]>([])
const total = ref(0)

const searchForm = reactive({
  nickname: '',
  platform: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

// 方法
const fetchInfluencerList = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: InfluencerQueryParams = {
      page: pagination.page,
      page_size: pagination.pageSize,
    }

    // 添加搜索条件
    if (searchForm.platform) {
      params.platform = searchForm.platform
    }
    if (searchForm.nickname) {
      params.nickname = searchForm.nickname
    }

    // 调用API获取达人列表
    const response = await kolApi.getInfluencers(params)
    
    influencerList.value = response.data || []
    total.value = response.total || 0
    
    console.log('获取达人列表成功:', response)
  } catch (error: any) {
    console.error('获取达人列表失败:', error)
    ElMessage.error(error.message || '获取达人列表失败')
    influencerList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchInfluencerList()
}

const resetSearch = () => {
  searchForm.nickname = ''
  searchForm.platform = ''
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchInfluencerList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchInfluencerList()
}

const handleImport = () => {
  router.push('/import')
}

const getPlatformName = (platform: string) => {
  const names: Record<string, string> = {
    douyin: '抖音',
    xiaohongshu: '小红书',
    weibo: '微博',
    bilibili: 'B站',
    tiktok: '抖音',
    other: '其他'
  }
  return names[platform] || platform
}

const getPlatformType = (platform: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    douyin: 'primary',
    tiktok: 'primary',
    xiaohongshu: 'danger',
    weibo: 'warning',
    bilibili: 'info',
    other: 'info'
  }
  return types[platform] || 'info'
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

const formatTime = (time: string) => {
  if (!time) return '-'
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const viewDetail = (influencer: Influencer) => {
  ElMessage.info('查看详情功能开发中...')
}

const viewWorks = (influencer: Influencer) => {
  router.push({ path: '/works-list', query: { kolId: influencer.id.toString() } })
}

const editInfluencer = (influencer: Influencer) => {
  ElMessage.info('编辑功能开发中...')
}

// 导出Excel
const handleExport = async () => {
  if (influencerList.value.length === 0) {
    ElMessage.warning('当前没有数据可以导出')
    return
  }

  exporting.value = true
  try {
    // 准备导出数据
    const exportData = influencerList.value.map((influencer) => ({
      '达人昵称': influencer.nickname || influencer.username || '未命名',
      '平台': getPlatformName(influencer.platform),
      '粉丝数': influencer.followers_count || 0,
      '点赞数': influencer.likes_count || 0,
      '作品数': influencer.posts_count || 0,
      '标签': influencer.tags && influencer.tags.length > 0 ? influencer.tags.join(', ') : '',
      '创建时间': formatTime(influencer.created_at)
    }))

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '达人列表')

    // 生成文件名
    const fileName = `达人列表_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`

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
  fetchInfluencerList()
})
</script>

<style scoped>
.kol-list {
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

.header-actions {
  display: flex;
  gap: 10px;
}

.kol-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info .name {
  font-weight: 500;
  margin-bottom: 4px;
}

.info .tags {
  display: flex;
  gap: 4px;
}
</style>
