<template>
  <div class="credits">
    <el-page-header @back="false" content="积分管理" />
    
    <!-- 积分概览 -->
    <el-card class="overview-card">
      <template #header>
        <span>积分概览</span>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stat-item">
            <div class="stat-icon current">
              <el-icon><Coin /></el-icon>
            </div>
            <div class="stat-info">
              <h3>当前积分</h3>
              <p class="stat-number">{{ stats.currentCredits }}</p>
            </div>
          </div>
        </el-col>
        
        <el-col :span="8">
          <div class="stat-item">
            <div class="stat-icon total">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <h3>总消费积分</h3>
              <p class="stat-number">{{ stats.totalConsumed }}</p>
            </div>
          </div>
        </el-col>
        
        <el-col :span="8">
          <div class="stat-item">
            <div class="stat-icon remaining">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <h3>本月消费</h3>
              <p class="stat-number">{{ stats.monthlyConsumed }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 充值套餐 -->
    <el-card class="packages-card">
      <template #header>
        <span>充值套餐</span>
      </template>
      
      <el-row :gutter="20">
        <el-col
          v-for="pkg in state.packages"
          :key="pkg.id"
          :span="6"
        >
          <div class="package-item" :class="{ popular: pkg.popular }">
            <div v-if="pkg.popular" class="popular-badge">推荐</div>
            <div class="package-header">
              <h3>{{ pkg.name }}</h3>
              <div class="price">
                <span class="currency">¥</span>
                <span class="amount">{{ pkg.price }}</span>
              </div>
            </div>
            <div class="package-content">
              <div class="credits">
                <span class="credits-amount">{{ pkg.credits }}</span>
                <span class="credits-unit">积分</span>
              </div>
              <div v-if="pkg.bonus" class="bonus">
                额外赠送 {{ pkg.bonus }} 积分
              </div>
              <ul class="features">
                <li v-for="feature in pkg.features" :key="feature">
                  <el-icon class="check-icon"><Check /></el-icon>
                  {{ feature }}
                </li>
              </ul>
            </div>
            <el-button
              type="primary"
              :disabled="state.loading"
              @click="handlePurchase(pkg)"
              style="width: 100%"
            >
              立即充值
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 积分用途说明 -->
    <el-card class="usage-card">
      <template #header>
        <span>积分用途说明</span>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="usage-section">
            <h4>功能消费</h4>
            <el-table :data="state.usageList" :show-header="false">
              <el-table-column prop="name" label="功能" />
              <el-table-column prop="cost" label="消费" width="100">
                <template #default="{ row }">
                  <span class="cost">{{ row.cost }} 积分</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        
        <el-col :span="12">
          <div class="usage-section">
            <h4>使用提示</h4>
            <ul class="tips-list">
              <li>积分永不过期，可放心充值</li>
              <li>充值后积分立即到账</li>
              <li>支持支付宝、微信支付</li>
              <li>大额充值享受更多优惠</li>
              <li>积分不足时会提示充值</li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Coin, TrendCharts, Wallet, Check } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 响应式数据
const stats = reactive({
  currentCredits: 0,
  totalConsumed: 0,
  monthlyConsumed: 0
})

const state = reactive({
  loading: false,
  packages: [
    {
      id: 1,
      name: '体验包',
      price: 10,
      credits: 100,
      bonus: 0,
      popular: false,
      features: ['基础功能使用', '导入10个达人', '查看基础数据']
    },
    {
      id: 2,
      name: '标准包',
      price: 50,
      credits: 600,
      bonus: 100,
      popular: true,
      features: ['所有功能使用', '导入60个达人', '查看详细数据', '数据导出功能']
    },
    {
      id: 3,
      name: '专业包',
      price: 100,
      credits: 1300,
      bonus: 300,
      popular: false,
      features: ['所有功能使用', '导入130个达人', '高级数据分析', 'API接口访问']
    },
    {
      id: 4,
      name: '企业包',
      price: 200,
      credits: 3000,
      bonus: 1000,
      popular: false,
      features: ['所有功能使用', '无限制导入', '定制化服务', '专属客服支持']
    }
  ],
  usageList: [
    { name: '导入达人信息', cost: 10 },
    { name: '导入作品数据', cost: 5 },
    { name: '数据分析报告', cost: 20 },
    { name: '批量导出数据', cost: 15 },
    { name: 'API接口调用', cost: 1 }
  ]
})

// 方法
const fetchCreditsInfo = async () => {
  try {
    // TODO: 从API获取积分信息
    // 模拟数据
    stats.currentCredits = authStore.userCredits
    stats.totalConsumed = 1500
    stats.monthlyConsumed = 230
  } catch (error) {
    console.error('获取积分信息失败:', error)
  }
}

const handlePurchase = async (pkg: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要充值 ${pkg.name} (¥${pkg.price}) 吗？`,
      '充值确认',
      {
        confirmButtonText: '确定充值',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    state.loading = true
    
    // TODO: 调用充值API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟充值成功
    const totalCredits = pkg.credits + (pkg.bonus || 0)
    stats.currentCredits += totalCredits
    authStore.updateCredits(stats.currentCredits)
    
    ElMessage.success(`充值成功！获得 ${totalCredits} 积分`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('充值失败:', error)
    }
  } finally {
    state.loading = false
  }
}

// 生命周期
onMounted(() => {
  fetchCreditsInfo()
})
</script>

<style scoped>
.credits {
  max-width: 1200px;
}

.overview-card {
  margin: 20px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
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

.stat-icon.current {
  background: linear-gradient(135deg, #409eff, #36c6d3);
}

.stat-icon.total {
  background: linear-gradient(135deg, #67c23a, #85d57a);
}

.stat-icon.remaining {
  background: linear-gradient(135deg, #e6a23c, #f1c232);
}

.stat-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.stat-number {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.packages-card {
  margin: 20px 0;
}

.package-item {
  position: relative;
  border: 2px solid #e6e6e6;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.package-item:hover {
  border-color: #409eff;
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.15);
}

.package-item.popular {
  border-color: #409eff;
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.15);
}

.popular-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #409eff;
  color: white;
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 12px;
}

.package-header h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.price {
  margin-bottom: 20px;
}

.currency {
  font-size: 16px;
  color: #666;
}

.amount {
  font-size: 32px;
  font-weight: bold;
  color: #409eff;
}

.package-content {
  flex: 1;
  margin-bottom: 20px;
}

.credits {
  margin-bottom: 12px;
}

.credits-amount {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.credits-unit {
  font-size: 14px;
  color: #666;
  margin-left: 4px;
}

.bonus {
  color: #67c23a;
  font-size: 14px;
  margin-bottom: 16px;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.features li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.check-icon {
  color: #67c23a;
  margin-right: 8px;
}

.usage-card {
  margin: 20px 0;
}

.usage-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.cost {
  color: #409eff;
  font-weight: 500;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
  color: #666;
  line-height: 1.5;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #409eff;
}
</style>
