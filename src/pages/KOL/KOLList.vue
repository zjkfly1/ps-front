<template>
  <div class="kol-list">
    <el-page-header @back="false" content="达人列表" />
    
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.search"
            placeholder="搜索达人名称"
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
            <el-option label="抖音" value="tiktok" />
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
          <el-button type="primary" @click="handleImport">
            <el-icon><Plus /></el-icon>
            导入达人
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="kolList"
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
                {{ row.name.charAt(0) }}
              </el-avatar>
              <div class="info">
                <div class="name">{{ row.name }}</div>
                <div class="tags">
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
        
        <el-table-column prop="followerCount" label="粉丝数" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.followerCount) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="likeCount" label="点赞数" width="120">
          <template #default="{ row }">
            {{ formatNumber(row.likeCount) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="totalWorks" label="作品数" width="100" />
        
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
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
            <el-button type="text" size="small" @click="editKOL(row)">
              编辑
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { KOL } from '@/types'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const kolList = ref<KOL[]>([])
const total = ref(0)

const searchForm = reactive({
  search: '',
  platform: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20
})

// 方法
const fetchKOLList = async () => {
  loading.value = true
  try {
    // TODO: 从API获取达人列表
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    kolList.value = [
      {
        id: '1',
        name: '美食博主小王',
        platform: 'xiaohongshu',
        profileUrl: 'https://example.com',
        avatar: 'https://example.com/avatar1.jpg',
        description: '专注美食分享',
        followerCount: 125000,
        likeCount: 980000,
        totalWorks: 234,
        tags: ['美食', '生活'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: '科技达人小李',
        platform: 'tiktok',
        profileUrl: 'https://example.com',
        followerCount: 89000,
        likeCount: 567000,
        totalWorks: 156,
        tags: ['科技', '数码'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    total.value = 2
  } catch (error) {
    console.error('获取达人列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchKOLList()
}

const resetSearch = () => {
  searchForm.search = ''
  searchForm.platform = ''
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchKOLList()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchKOLList()
}

const handleImport = () => {
  router.push('/import')
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

const getPlatformType = (platform: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
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
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const viewDetail = (kol: KOL) => {
  ElMessage.info('查看详情功能开发中...')
}

const viewWorks = (kol: KOL) => {
  router.push({ path: '/works-list', query: { kolId: kol.id } })
}

const editKOL = (kol: KOL) => {
  ElMessage.info('编辑功能开发中...')
}

// 生命周期
onMounted(() => {
  fetchKOLList()
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
