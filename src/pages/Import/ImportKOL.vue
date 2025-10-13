<template>
  <div class="import-kol">
    <el-page-header @back="false" content="导入达人" />
    
    <el-card class="import-card">
      <template #header>
        <div class="card-header">
          <span>导入达人信息</span>
          <div class="cost-info">
            <el-tag type="info">
              消耗积分: {{ estimatedCost }}
            </el-tag>
            <el-tag :type="canAfford ? 'success' : 'warning'" style="margin-left: 8px">
              当前积分: {{ authStore.userCredits }}
            </el-tag>
          </div>
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
            <el-option label="抖音" value="douyin" />
            <el-option label="小红书" value="xiaohongshu" />
            <el-option label="微博" value="weibo" />
            <el-option label="B站" value="bilibili" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="导入方式" prop="importType">
          <el-radio-group v-model="importForm.importType">
            <el-radio value="url">达人链接</el-radio>
            <el-radio value="id">达人ID</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item 
          :label="importForm.importType === 'url' ? '达人链接' : '达人ID'" 
          prop="urlOrId"
        >
          <el-input
            v-model="importForm.urlOrId"
            :placeholder="importForm.importType === 'url' ? '请输入达人主页链接' : '请输入达人ID'"
            style="width: 400px"
          />
          <div class="input-help">
            <span v-if="importForm.importType === 'url'">
              支持完整的达人主页URL链接
            </span>
            <span v-else>
              输入平台内的达人唯一ID标识
            </span>
          </div>
        </el-form-item>
        
        <el-form-item label="高级选项">
          <div class="advanced-options">
            <el-checkbox v-model="importForm.includeWorks">
              同时导入达人的作品信息 (+5积分)
            </el-checkbox>
            
            <el-checkbox v-model="importForm.enableMonitored">
              启用达人监测功能 (+10积分)
            </el-checkbox>
            
            <el-checkbox 
              v-model="importForm.contentListMonitored" 
              :disabled="!importForm.includeWorks"
            >
              启用作品列表监测 (+5积分)
            </el-checkbox>
          </div>
        </el-form-item>

        <!-- 监测时间设置 -->
        <el-form-item 
          v-if="importForm.enableMonitored" 
          label="监测过期时间" 
          prop="monitoredExpireAt"
        >
          <el-date-picker
            v-model="importForm.monitoredExpireAt"
            type="date"
            placeholder="选择监测过期日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="(time) => time.getTime() < Date.now() - 86400000"
            style="width: 200px"
          />
          <el-text type="info" size="small" style="margin-left: 8px">
            监测将在此日期后自动停止
          </el-text>
        </el-form-item>

        <!-- 作品监测时间设置 -->
        <el-form-item 
          v-if="importForm.contentListMonitored && importForm.includeWorks" 
          label="作品监测过期" 
          prop="contentListExpireAt"
        >
          <el-date-picker
            v-model="importForm.contentListExpireAt"
            type="date"
            placeholder="选择作品监测过期日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="(time) => time.getTime() < Date.now() - 86400000"
            style="width: 200px"
          />
          <el-text type="info" size="small" style="margin-left: 8px">
            作品监测将在此日期后自动停止
          </el-text>
        </el-form-item>

        <!-- 作品更新时间 -->
        <el-form-item 
          v-if="importForm.includeWorks" 
          label="作品更新时间" 
          prop="postsUpdatedSince"
        >
          <el-date-picker
            v-model="importForm.postsUpdatedSince"
            type="date"
            placeholder="选择作品更新起始日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="(time) => time.getTime() > Date.now()"
            style="width: 200px"
          />
          <el-text type="info" size="small" style="margin-left: 8px">
            只导入此日期之后更新的作品
          </el-text>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!canAfford"
            @click="handleImport"
          >
            <span v-if="canAfford">开始导入</span>
            <span v-else>积分不足</span>
          </el-button>
          <el-button @click="resetForm">重置</el-button>
          
          <div v-if="!canAfford" class="insufficient-credits">
            <el-text type="warning" size="small">
              导入需要 {{ estimatedCost }} 积分，您当前仅有 {{ authStore.userCredits }} 积分
            </el-text>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 导入历史 -->
    <el-card header="导入历史" class="history-card">
      <el-table :data="importHistory" v-loading="historyLoading">
        <el-table-column prop="input.platform" label="平台" width="100">
          <template #default="{ row }">
            <el-tag :type="getPlatformType(row.input.platform)">
              {{ getPlatformName(row.input.platform) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="input.url" label="链接" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link 
              v-if="row.input.url" 
              :href="row.input.url" 
              type="primary" 
              target="_blank"
              :underline="false"
            >
              {{ row.input.url }}
            </el-link>
            <span v-else-if="row.input.platform_id" class="platform-id">
              ID: {{ row.input.platform_id }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import dayjs from 'dayjs'
import { kolApi, type ImportInfluencersRequest } from '@/api/kol'
import { useAuthStore } from '@/stores/auth'
import type { Task } from '@/types'

// 响应式数据
const authStore = useAuthStore()
const importFormRef = ref<FormInstance>()
const loading = ref(false)
const historyLoading = ref(false)
const importHistory = ref<Task[]>([])

const importForm = reactive({
  platform: '',
  importType: 'url' as 'url' | 'id',
  urlOrId: '',
  
  // 基础功能选项
  includeWorks: false,
  
  // 监测功能选项
  enableMonitored: false,
  contentListMonitored: false,
  
  // 时间设置
  monitoredExpireAt: '',
  contentListExpireAt: '',
  postsUpdatedSince: ''
})

// 计算属性
const estimatedCost = computed(() => {
  let baseCost = 10 // 基础导入费用
  if (importForm.includeWorks) {
    baseCost += 5 // 导入作品额外费用
  }
  if (importForm.enableMonitored) {
    baseCost += 10 // 启用监测额外费用
  }
  if (importForm.contentListMonitored) {
    baseCost += 5 // 作品监测额外费用
  }
  return baseCost
})

const canAfford = computed(() => {
  return authStore.userCredits >= estimatedCost.value
})

// 表单验证规则
const importRules: FormRules = {
  platform: [
    { required: true, message: '请选择平台', trigger: 'change' }
  ],
  importType: [
    { required: true, message: '请选择导入方式', trigger: 'change' }
  ],
  urlOrId: [
    { required: true, message: '请输入达人链接或ID', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (importForm.importType === 'url') {
          // URL格式验证
          const urlPattern = /^https?:\/\/.+/
          if (!urlPattern.test(value)) {
            callback(new Error('请输入有效的URL链接'))
          } else {
            callback()
          }
        } else {
          // ID格式验证（至少2个字符）
          if (value.length < 2) {
            callback(new Error('达人ID至少需要2个字符'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const handleImport = async () => {
  if (!importFormRef.value) return

  // 检查积分是否足够
  if (!canAfford.value) {
    ElMessageBox.confirm(
      `导入需要消耗 ${estimatedCost.value} 积分，您当前积分不足。是否前往充值？`,
      '积分不足',
      {
        confirmButtonText: '前往充值',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 跳转到充值页面
      // router.push('/credits')
      ElMessage.info('充值功能开发中...')
    }).catch(() => {
      // 用户取消
    })
    return
  }

  await importFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 构建请求参数 - 匹配后端API结构
        const importData: ImportInfluencersRequest = {
          platform: importForm.platform,
          
          // 基础功能配置
          include_posts: importForm.includeWorks,
          
          // 监测功能配置
          enable_monitored: importForm.enableMonitored,
          content_list_monitored: importForm.contentListMonitored
        }

        // 设置链接或ID
        if (importForm.importType === 'url') {
          importData.urls = [importForm.urlOrId]
        } else {
          importData.platform_ids = [importForm.urlOrId]
        }

        // 设置监测过期时间
        if (importForm.enableMonitored && importForm.monitoredExpireAt) {
          importData.monitored_expire_at = importForm.monitoredExpireAt
        } else if (importForm.enableMonitored) {
          // 默认监测时间为一年后
          const nextYear = new Date()
          nextYear.setFullYear(nextYear.getFullYear() + 1)
          importData.monitored_expire_at = nextYear.toISOString().split('T')[0]
        }

        // 设置作品监测过期时间
        if (importForm.contentListMonitored && importForm.contentListExpireAt) {
          importData.content_list_expire_at = importForm.contentListExpireAt
        } else if (importForm.contentListMonitored) {
          // 默认作品监测时间为一年后
          const nextYear = new Date()
          nextYear.setFullYear(nextYear.getFullYear() + 1)
          importData.content_list_expire_at = nextYear.toISOString().split('T')[0]
        }

        // 设置作品更新时间
        if (importForm.includeWorks && importForm.postsUpdatedSince) {
          importData.posts_updated_since = importForm.postsUpdatedSince
        }

        console.log('导入参数:', importData)

        // 调用导入API
        const result = await kolApi.importInfluencers(importData)
        
        const estimatedMsg = result.estimatedTime 
          ? `，预计处理时间：${result.estimatedTime}秒` 
          : ''
        ElMessage.success(`${result.message}${estimatedMsg}`)
        
        // 重置表单并刷新历史
        resetForm()
        fetchHistory()
        
        // 刷新用户积分
        authStore.fetchUserProfile()
        
      } catch (error: any) {
        console.error('导入失败:', error)
        ElMessage.error(error.message || '导入失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const resetForm = () => {
  importFormRef.value?.resetFields()
}

const platformMap: Record<string, string> = {
  douyin: 'douyin',
  抖音: 'douyin',
  xiaohongshu: 'xiaohongshu',
  小红书: 'xiaohongshu',
  weibo: 'weibo',
  微博: 'weibo',
  bilibili: 'bilibili',
  B站: 'bilibili',
  other: 'other',
  其他: 'other'
}

const fetchHistory = async () => {
  historyLoading.value = true
  try {
    const result = await kolApi.getImportHistory({
      page: 1,
      page_size: 20
    });

    // 兼容 result 为后端原始响应格式 { code, message, data, ... }
    // 或为统一封装过的 data/data.data 格式
    let historyList: any[] = [];
    if (Array.isArray(result)) {
      // 如果 result 已经是数组
      historyList = result;
    } else if (result && Array.isArray(result.data)) {
      // 后端原始响应格式
      historyList = result.data;
    } else if (result && Array.isArray(result.data)) {
      // 某些 API 封装格式
      historyList = result.data;
    } else if (result && Array.isArray((result as any))) {
      // unlikely, catch all
      historyList = result as any;
    } else {
      historyList = [];
    }

     importHistory.value = historyList.map(item => {
       // 平台映射
       const rawPlatform = item.platform;
       const mappedPlatform = platformMap[rawPlatform] || rawPlatform;
       
       console.log('平台映射:', {
         rawPlatform,
         mappedPlatform,
         item: item
       });

       return {
        id: item.id != null ? item.id.toString() : '',
        userId: '1', // 暂时硬编码
        type: 'import_kol' as const,
        status:
          item.status === 1
            ? 'completed'
            : item.status === 0
              ? 'processing'
              : item.status === 2
                ? 'failed'
                : 'pending',
        input: { 
          url: item.source_url || '', 
          platform: mappedPlatform,
          platform_id: item.platform_id
        },
        creditCost: 10, // 暂时硬编码
        createdAt: item.created_at || '',
        result: item.status === 1
          ? {
              kol: undefined,
              worksCount: 0,
              errorMessage: undefined
            }
          : {
              kol: undefined,
              worksCount: 0,
              errorMessage: item.message
            }
      }
    });
  } catch (error: any) {
    console.error('获取历史记录失败:', error)
    ElMessage.error(error.message || '获取历史记录失败')

    // 如果API失败，使用模拟数据
    importHistory.value = [
      {
        id: '1',
        userId: '1',
        type: 'import_kol',
        status: 'completed',
        input: { url: 'https://example.com/kol1', platform: 'douyin' },
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
  } finally {
    historyLoading.value = false
  }
}

const getPlatformName = (platform: string) => {
  const names: Record<string, string> = {
    douyin: '抖音',
    xiaohongshu: '小红书',
    weibo: '微博',
    bilibili: 'B站',
    other: '其他'
  }
  return names[platform] || platform
}

const getPlatformType = (platform: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    douyin: 'primary',
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

const viewResult = async (task: Task) => {
  try {
    // 直接展示任务结果信息
    if (task.result) {
      ElMessageBox.alert(
        `<div>
          <p><strong>导入状态：</strong>${task.status === 'completed' ? '成功' : '失败'}</p>
          ${task.result.worksCount ? `<p><strong>作品数量：</strong>${task.result.worksCount}</p>` : ''}
          ${task.result.errorMessage ? `<p><strong>错误信息：</strong>${task.result.errorMessage}</p>` : ''}
          <p><strong>导入时间：</strong>${formatTime(task.createdAt)}</p>
        </div>`,
        '导入结果',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定'
        }
      )
    } else {
      ElMessage.error('暂无结果数据')
    }
  } catch (error: any) {
    console.error('查看结果失败:', error)
    ElMessage.error('查看结果失败')
  }
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

.cost-info {
  display: flex;
  align-items: center;
}

.input-help {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.advanced-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advanced-options .el-checkbox {
  margin-right: 0;
}

.platform-id {
  color: #606266;
  font-family: monospace;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.insufficient-credits {
  margin-top: 8px;
}

.history-card {
  margin: 20px 0;
}
</style>
