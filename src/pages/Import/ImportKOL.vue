<template>
  <div class="import-kol">
    <el-page-header @back="false" content="导入达人" />
    
    <el-card class="import-card">
      <template #header>
        <div class="card-header">
          <span>导入达人信息</span>
          <el-tag type="info">消耗积分: 10</el-tag>
        </div>
      </template>
      
      <el-form
        ref="importFormRef"
        :model="importForm"
        :rules="importRules"
        label-width="120px"
      >
        <el-form-item label="平台选择" prop="platform">
          <el-select
            v-model="importForm.platform"
            placeholder="请选择平台"
            style="width: 200px"
          >
            <el-option label="抖音" value="tiktok" />
            <el-option label="小红书" value="xiaohongshu" />
            <el-option label="微博" value="weibo" />
            <el-option label="B站" value="bilibili" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="达人链接" prop="url">
          <el-input
            v-model="importForm.url"
            placeholder="请输入达人主页链接"
            style="width: 400px"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleImport"
          >
            开始导入
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 导入历史 -->
    <el-card header="导入历史" class="history-card">
      <el-table :data="importHistory" v-loading="historyLoading">
        <el-table-column prop="platform" label="平台" width="100">
          <template #default="{ row }">
            <el-tag :type="getPlatformType(row.platform)">
              {{ getPlatformName(row.platform) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creditCost" label="积分" width="80" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'completed'"
              type="text"
              size="small"
              @click="viewResult(row)"
            >
              查看结果
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import dayjs from 'dayjs'
import type { Task } from '@/types'

// 响应式数据
const importFormRef = ref<FormInstance>()
const loading = ref(false)
const historyLoading = ref(false)
const importHistory = ref<Task[]>([])

const importForm = reactive({
  platform: '',
  url: ''
})

// 表单验证规则
const importRules: FormRules = {
  platform: [
    { required: true, message: '请选择平台', trigger: 'change' }
  ],
  url: [
    { required: true, message: '请输入达人链接', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL', trigger: 'blur' }
  ]
}

// 方法
const handleImport = async () => {
  if (!importFormRef.value) return

  await importFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // TODO: 调用导入API
        await new Promise(resolve => setTimeout(resolve, 2000))
        ElMessage.success('导入任务已提交，正在处理中...')
        resetForm()
        fetchHistory()
      } catch (error) {
        console.error('导入失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  importFormRef.value?.resetFields()
}

const fetchHistory = async () => {
  historyLoading.value = true
  try {
    // TODO: 从API获取导入历史
    // 模拟数据
    importHistory.value = [
      {
        id: '1',
        userId: '1',
        type: 'import_kol',
        status: 'completed',
        input: { url: 'https://example.com/kol1', platform: 'tiktok' },
        creditCost: 10,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: '1',
        type: 'import_kol',
        status: 'processing',
        input: { url: 'https://example.com/kol2', platform: 'xiaohongshu' },
        creditCost: 10,
        createdAt: new Date().toISOString()
      }
    ]
  } catch (error) {
    console.error('获取历史记录失败:', error)
  } finally {
    historyLoading.value = false
  }
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

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '等待中',
    processing: '处理中',
    completed: '已完成',
    failed: '失败'
  }
  return texts[status] || status
}

const getStatusType = (status: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    pending: 'info',
    processing: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const viewResult = (task: Task) => {
  ElMessage.info('查看结果功能开发中...')
}

// 生命周期
onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.import-kol {
  max-width: 1000px;
}

.import-card {
  margin: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-card {
  margin: 20px 0;
}
</style>
