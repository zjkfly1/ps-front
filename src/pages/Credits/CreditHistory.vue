<template>
  <div class="credit-history">
    <el-page-header @back="false" content="积分记录" />
    
    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="类型">
          <el-select
            v-model="searchForm.type"
            placeholder="选择类型"
            clearable
            style="width: 120px"
          >
            <el-option label="充值" value="charge" />
            <el-option label="消费" value="consume" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 积分记录列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>积分记录 ({{ total }})</span>
          <div class="summary">
            <span class="summary-item">
              总充值: <strong class="charge">+{{ totalCharge }}</strong>
            </span>
            <span class="summary-item">
              总消费: <strong class="consume">-{{ totalConsume }}</strong>
            </span>
          </div>
        </div>
      </template>
      
      <el-table
        :data="recordsList"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'charge' ? 'success' : 'warning'">
              {{ row.type === 'charge' ? '充值' : '消费' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="amount" label="积分变动" width="120">
          <template #default="{ row }">
            <span :class="`amount ${row.type}`">
              {{ row.type === 'charge' ? '+' : '-' }}{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column prop="balance" label="余额" width="100">
          <template #default="{ row }">
            <span class="balance">{{ row.balance }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="说明" min-width="200" />
        
        <el-table-column prop="relatedTask" label="关联任务" width="120">
          <template #default="{ row }">
            <el-button
              v-if="row.relatedTask"
              type="text"
              size="small"
              @click="viewTask(row.relatedTask)"
            >
              查看任务
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
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
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import type { CreditRecord } from '@/types'

// 响应式数据
const loading = ref(false)
const recordsList = ref<CreditRecord[]>([])
const total = ref(0)
const totalCharge = ref(0)
const totalConsume = ref(0)

const searchForm = reactive({
  type: '',
  dateRange: null as [Date, Date] | null
})

const pagination = reactive({
  page: 1,
  pageSize: 20
})

// 方法
const fetchRecords = async () => {
  loading.value = true
  try {
    // TODO: 从API获取积分记录
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    recordsList.value = [
      {
        id: '1',
        userId: '1',
        type: 'charge',
        amount: 600,
        balance: 850,
        description: '充值标准包',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: '1',
        type: 'consume',
        amount: 10,
        balance: 240,
        description: '导入达人信息',
        relatedTask: 'task_001',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        userId: '1',
        type: 'consume',
        amount: 5,
        balance: 235,
        description: '导入作品数据',
        relatedTask: 'task_002',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '4',
        userId: '1',
        type: 'charge',
        amount: 100,
        balance: 340,
        description: '充值体验包',
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ]
    
    total.value = 4
    
    // 计算总充值和总消费
    totalCharge.value = recordsList.value
      .filter(record => record.type === 'charge')
      .reduce((sum, record) => sum + record.amount, 0)
      
    totalConsume.value = recordsList.value
      .filter(record => record.type === 'consume')
      .reduce((sum, record) => sum + record.amount, 0)
      
  } catch (error) {
    console.error('获取积分记录失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchRecords()
}

const resetSearch = () => {
  searchForm.type = ''
  searchForm.dateRange = null
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchRecords()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchRecords()
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const viewTask = (taskId: string) => {
  ElMessage.info(`查看任务 ${taskId} 功能开发中...`)
}

// 生命周期
onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.credit-history {
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

.summary {
  display: flex;
  gap: 20px;
}

.summary-item {
  font-size: 14px;
  color: #666;
}

.summary-item .charge {
  color: #67c23a;
}

.summary-item .consume {
  color: #f56c6c;
}

.amount {
  font-weight: 500;
  font-size: 16px;
}

.amount.charge {
  color: #67c23a;
}

.amount.consume {
  color: #f56c6c;
}

.balance {
  font-weight: 500;
  color: #409eff;
}
</style>
