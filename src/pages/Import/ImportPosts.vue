<template>
  <div class="import-posts">
    <el-page-header @back="false" content="导入作品" />
    
    <el-card class="import-card">
      <template #header>
        <div class="card-header">
          <span>导入作品信息</span>
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
            <el-option label="小红书" value="xhs" />
            <el-option label="微博" value="weibo" />
            <el-option label="快手" value="kuaishou" />
            <el-option label="B站" value="bilibili" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="导入方式" prop="importType">
          <el-radio-group v-model="importForm.importType">
            <el-radio value="url">作品链接</el-radio>
            <el-radio value="id">作品ID</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item 
          :label="importForm.importType === 'url' ? '作品链接' : '作品ID'" 
          prop="content"
        >
          <el-input
            v-model="importForm.content"
            type="textarea"
            :placeholder="importForm.importType === 'url' ? '请输入作品链接，每行一个' : '请输入作品ID，每行一个'"
            :rows="6"
            style="width: 500px"
          />
          <div class="input-help">
            <span v-if="importForm.importType === 'url'">
              支持批量导入，每行输入一个作品链接
            </span>
            <span v-else>
              支持批量导入，每行输入一个平台作品ID
            </span>
          </div>
        </el-form-item>
        
        <el-form-item label="高级选项">
          <div class="advanced-options">
            <el-checkbox v-model="importForm.enableMonitored">
              启用作品监测功能 (+10积分/作品)
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

        <!-- 任务组ID -->
        <!-- <el-form-item label="任务组ID" prop="groupId">
          <el-input-number
            v-model="importForm.groupId"
            :min="1"
            :max="999"
            style="width: 200px"
          />
          <el-text type="info" size="small" style="margin-left: 8px">
            爬虫任务组ID，默认300
          </el-text>
        </el-form-item> -->

        <!-- 作品来源 -->
        <el-form-item label="作品来源" prop="source">
          <el-radio-group v-model="importForm.source">
            <el-radio :value="1">用户导入</el-radio>
            <!-- 页面不展示用户作品列表导入 -->
            <!-- <el-radio :value="2">用户作品列表导入</el-radio> -->
          </el-radio-group>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { postsApi, type ImportPostsRequest } from '@/api/posts'
import { useAuthStore } from '@/stores/auth'

// 响应式数据
const authStore = useAuthStore()
const importFormRef = ref<FormInstance>()
const loading = ref(false)

const importForm = reactive({
  platform: '',
  importType: 'url' as 'url' | 'id',
  content: '',
  
  // 监测功能选项
  enableMonitored: false,
  
  // 时间设置
  monitoredExpireAt: '',
  
  // 任务组ID
  groupId: 300,
  
  // 作品来源：1-用户导入，2-用户作品列表导入
  source: 1
})

// 计算属性
const contentLines = computed(() => {
  return importForm.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
})

const estimatedCost = computed(() => {
  const count = contentLines.value.length
  if (count === 0) return 0
  
  let baseCost = 5 * count // 基础导入费用：5积分/作品
  if (importForm.enableMonitored) {
    baseCost += 10 * count // 启用监测额外费用：10积分/作品
  }
  return baseCost
})

const canAfford = computed(() => {
  return authStore.userCredits >= estimatedCost.value && contentLines.value.length > 0
})

// 表单验证规则
const importRules: FormRules = {
  platform: [
    { required: true, message: '请选择平台', trigger: 'change' }
  ],
  importType: [
    { required: true, message: '请选择导入方式', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入作品链接或ID', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const lines = value.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0)
        
        if (lines.length === 0) {
          callback(new Error('请至少输入一个作品链接或ID'))
          return
        }
        
        if (importForm.importType === 'url') {
          // URL格式验证
          const urlPattern = /^https?:\/\/.+/
          const invalidLines = lines.filter((line: string) => !urlPattern.test(line))
          if (invalidLines.length > 0) {
            callback(new Error(`存在无效的URL链接，请检查格式`))
          } else {
            callback()
          }
        } else {
          // ID格式验证（至少2个字符）
          const invalidLines = lines.filter((line: string) => line.length < 2)
          if (invalidLines.length > 0) {
            callback(new Error('作品ID至少需要2个字符'))
          } else {
            callback()
          }
        }
      },
      trigger: 'blur'
    }
  ],
  groupId: [
    { required: true, message: '请输入任务组ID', trigger: 'blur' },
    { type: 'number', min: 1, message: '任务组ID必须大于0', trigger: 'blur' }
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
        // 构建请求参数
        const importData: ImportPostsRequest = {
          platform: importForm.platform,
          enable_monitored: importForm.enableMonitored,
          group_id: importForm.groupId,
          source: importForm.source
        }

        // 设置链接或ID
        const lines = contentLines.value
        if (importForm.importType === 'url') {
          importData.urls = lines
        } else {
          importData.platform_ids = lines
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

        console.log('导入参数:', importData)

        // 调用导入API
        const result = await postsApi.importPosts(importData)
        
        const estimatedMsg = result.estimatedTime 
          ? `，预计处理时间：${result.estimatedTime}秒` 
          : ''
        ElMessage.success(`${result.message}${estimatedMsg}`)
        
        // 重置表单
        resetForm()
        
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
</script>

<style scoped>
.import-posts {
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

.insufficient-credits {
  margin-top: 8px;
}
</style>

