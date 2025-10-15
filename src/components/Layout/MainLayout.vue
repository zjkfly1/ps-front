<template>
  <el-container class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="layout-header">
      <div class="header-left">
        <el-icon class="menu-icon" @click="toggleSidebar">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
        <h2 class="logo">PluckStar</h2>
      </div>
      
      <div class="header-right">
        <!-- 用户积分 -->
        <div class="credits-info">
          <el-icon><Coin /></el-icon>
          <span>{{ userCredits }} 积分</span>
        </div>
        
        <!-- 用户菜单 -->
        <el-dropdown @command="handleUserCommand">
          <span class="user-info">
            <el-avatar :src="currentUser?.avatar" :size="32">
              {{ currentUser?.username?.charAt(0).toUpperCase() }}
            </el-avatar>
            <span class="username">{{ currentUser?.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '256px'" class="layout-sidebar">
        <el-menu
          :default-active="$route.path"
          :collapse="isCollapse"
          :unique-opened="true"
          router
          class="sidebar-menu"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <template #title>仪表板</template>
          </el-menu-item>
          
          <el-menu-item index="/import">
            <el-icon><Upload /></el-icon>
            <template #title>导入达人</template>
          </el-menu-item>
          
          <el-menu-item index="/import-posts">
            <el-icon><Upload /></el-icon>
            <template #title>导入作品</template>
          </el-menu-item>
          
          <el-menu-item index="/kol-list">
            <el-icon><User /></el-icon>
            <template #title>达人列表</template>
          </el-menu-item>
          
          <el-menu-item index="/works-list">
            <el-icon><VideoPlay /></el-icon>
            <template #title>作品列表</template>
          </el-menu-item>
          
          <el-sub-menu index="/credits">
            <template #title>
              <el-icon><Coin /></el-icon>
              <span>积分管理</span>
            </template>
            <el-menu-item index="/credits">积分充值</el-menu-item>
            <el-menu-item index="/credit-history">积分记录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="layout-main">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import {
  DataBoard,
  Upload,
  User,
  VideoPlay,
  Coin,
  ArrowDown,
  SwitchButton,
  Expand,
  Fold
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const isCollapse = ref(false)

// 计算属性
const currentUser = computed(() => authStore.currentUser)
const userCredits = computed(() => authStore.userCredits)

// 方法
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleUserCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人信息功能开发中...')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '退出确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        await authStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        // 用户取消操作
      }
      break
  }
}

// 生命周期
onMounted(() => {
  // 初始化时获取用户信息
  if (authStore.isAuthenticated && !authStore.currentUser) {
    authStore.fetchUserProfile().catch(() => {
      // 获取用户信息失败，跳转到登录页
      router.push('/login')
    })
  }
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-icon {
  font-size: 18px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.menu-icon:hover {
  color: #409eff;
}

.logo {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.credits-info {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #409eff;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-weight: 500;
}

.layout-sidebar {
  background: #fff;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.layout-main {
  background: #f5f7fa;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.content-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 100%;
  overflow-y: auto;
}
</style>
