<template>
  <div class="dashboard">
    <el-page-header @back="false" content="仪表板" />
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-kols">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <h3>总达人数</h3>
              <p class="stat-number">{{ stats.totalKOLs }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-works">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="stat-info">
              <h3>总作品数</h3>
              <p class="stat-number">{{ stats.totalWorks }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total-credits">
              <el-icon><Coin /></el-icon>
            </div>
            <div class="stat-info">
              <h3>剩余积分</h3>
              <p class="stat-number">{{ stats.totalCredits }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon today-tasks">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <h3>今日任务</h3>
              <p class="stat-number">{{ stats.todayTasks }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <el-card class="quick-actions" header="快速操作">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button
            type="primary"
            size="large"
            :icon="Upload"
            @click="goToImport"
            style="width: 100%; height: 80px"
          >
            导入达人
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="success"
            size="large"
            :icon="User"
            @click="goToKOLList"
            style="width: 100%; height: 80px"
          >
            查看达人列表
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="warning"
            size="large"
            :icon="VideoPlay"
            @click="goToWorksList"
            style="width: 100%; height: 80px"
          >
            查看作品列表
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 趋势图表 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card header="月度增长趋势">
          <div class="growth-chart">
            <div class="growth-item">
              <span class="label">达人增长</span>
              <div class="progress-container">
                <el-progress
                  :percentage="Math.abs(stats.monthlyGrowth.kols)"
                  :status="stats.monthlyGrowth.kols >= 0 ? 'success' : 'exception'"
                  :show-text="false"
                />
                <span class="growth-text" :class="{ positive: stats.monthlyGrowth.kols >= 0, negative: stats.monthlyGrowth.kols < 0 }">
                  {{ stats.monthlyGrowth.kols >= 0 ? '+' : '' }}{{ stats.monthlyGrowth.kols }}%
                </span>
              </div>
            </div>
            
            <div class="growth-item">
              <span class="label">作品增长</span>
              <div class="progress-container">
                <el-progress
                  :percentage="Math.abs(stats.monthlyGrowth.works)"
                  :status="stats.monthlyGrowth.works >= 0 ? 'success' : 'exception'"
                  :show-text="false"
                />
                <span class="growth-text" :class="{ positive: stats.monthlyGrowth.works >= 0, negative: stats.monthlyGrowth.works < 0 }">
                  {{ stats.monthlyGrowth.works >= 0 ? '+' : '' }}{{ stats.monthlyGrowth.works }}%
                </span>
              </div>
            </div>
            
            <div class="growth-item">
              <span class="label">任务增长</span>
              <div class="progress-container">
                <el-progress
                  :percentage="Math.abs(stats.monthlyGrowth.tasks)"
                  :status="stats.monthlyGrowth.tasks >= 0 ? 'success' : 'exception'"
                  :show-text="false"
                />
                <span class="growth-text" :class="{ positive: stats.monthlyGrowth.tasks >= 0, negative: stats.monthlyGrowth.tasks < 0 }">
                  {{ stats.monthlyGrowth.tasks >= 0 ? '+' : '' }}{{ stats.monthlyGrowth.tasks }}%
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card header="使用提示">
          <div class="tips-content">
            <el-alert
              title="欢迎使用摘星系统！"
              type="info"
              :closable="false"
              show-icon
            >
              <template #default>
                <ul class="tips-list">
                  <li>点击"导入达人"开始添加达人信息</li>
                  <li>在达人列表中可以查看和管理所有达人</li>
                  <li>作品列表展示达人的创作内容</li>
                  <li>积分用于支付各种功能的使用费用</li>
                </ul>
              </template>
            </el-alert>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, VideoPlay, Coin, Document, Upload } from '@element-plus/icons-vue'
import type { Stats } from '@/types'

const router = useRouter()

// 响应式数据
const stats = ref<Stats>({
  totalKOLs: 0,
  totalWorks: 0,
  totalCredits: 0,
  todayTasks: 0,
  monthlyGrowth: {
    kols: 0,
    works: 0,
    tasks: 0
  }
})

// 方法
const fetchStats = async () => {
  // TODO: 从API获取统计数据
  // 这里暂时使用模拟数据
  stats.value = {
    totalKOLs: 128,
    totalWorks: 1840,
    totalCredits: 850,
    todayTasks: 12,
    monthlyGrowth: {
      kols: 15,
      works: 23,
      tasks: 8
    }
  }
}

const goToImport = () => {
  router.push('/import')
}

const goToKOLList = () => {
  router.push('/kol-list')
}

const goToWorksList = () => {
  router.push('/works-list')
}

// 生命周期
onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.stats-row {
  margin: 20px 0;
}

.stat-card {
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.stat-icon.total-kols {
  background: linear-gradient(135deg, #409eff, #36c6d3);
}

.stat-icon.total-works {
  background: linear-gradient(135deg, #67c23a, #85d57a);
}

.stat-icon.total-credits {
  background: linear-gradient(135deg, #e6a23c, #f1c232);
}

.stat-icon.today-tasks {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.stat-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.stat-number {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.quick-actions {
  margin: 20px 0;
}

.charts-row {
  margin: 20px 0;
}

.growth-chart {
  padding: 20px 0;
}

.growth-item {
  margin-bottom: 20px;
}

.growth-item:last-child {
  margin-bottom: 0;
}

.label {
  display: inline-block;
  width: 80px;
  font-size: 14px;
  color: #666;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.progress-container :deep(.el-progress) {
  flex: 1;
}

.growth-text {
  font-weight: bold;
  font-size: 14px;
  min-width: 40px;
}

.growth-text.positive {
  color: #67c23a;
}

.growth-text.negative {
  color: #f56c6c;
}

.tips-content {
  padding: 10px 0;
}

.tips-list {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.tips-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}
</style>
