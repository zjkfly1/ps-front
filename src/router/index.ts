import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RouteRecordRaw } from 'vue-router'

// 导入页面组件
const Login = () => import('@/pages/Auth/Login.vue')
const Register = () => import('@/pages/Auth/Register.vue')
const Layout = () => import('@/components/Layout/MainLayout.vue')
const Dashboard = () => import('@/pages/Dashboard/Dashboard.vue')
const ImportKOL = () => import('@/pages/Import/ImportKOL.vue')
const ImportPosts = () => import('@/pages/Import/ImportPosts.vue')
const KOLList = () => import('@/pages/KOL/KOLList.vue')
const WorksList = () => import('@/pages/Works/WorksList.vue')
const Credits = () => import('@/pages/Credits/Credits.vue')
const CreditHistory = () => import('@/pages/Credits/CreditHistory.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false,
      title: '注册'
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: '仪表板',
          icon: 'DataBoard'
        }
      },
      {
        path: 'import',
        name: 'ImportKOL',
        component: ImportKOL,
        meta: {
          title: '导入达人',
          icon: 'Upload'
        }
      },
      {
        path: 'import-posts',
        name: 'ImportPosts',
        component: ImportPosts,
        meta: {
          title: '导入作品',
          icon: 'Upload'
        }
      },
      {
        path: 'kol-list',
        name: 'KOLList',
        component: KOLList,
        meta: {
          title: '达人列表',
          icon: 'User'
        }
      },
      {
        path: 'works-list',
        name: 'WorksList',
        component: WorksList,
        meta: {
          title: '作品列表',
          icon: 'VideoPlay'
        }
      },
      {
        path: 'credits',
        name: 'Credits',
        component: Credits,
        meta: {
          title: '积分管理',
          icon: 'Coin'
        }
      },
      {
        path: 'credit-history',
        name: 'CreditHistory',
        component: CreditHistory,
        meta: {
          title: '积分记录',
          icon: 'Document'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    // 需要认证但未登录，跳转到登录页
    next('/login')
  } else if (to.meta.requiresAuth === false && authStore.isAuthenticated) {
    // 已登录用户访问登录/注册页，跳转到首页
    next('/dashboard')
  } else {
    // 其他情况正常跳转
    next()
  }
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - PluckStar`
  }
})

export default router
