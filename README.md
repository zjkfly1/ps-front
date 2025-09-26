# 摘星系统 - 前端页面

## 项目简介

摘星系统（PluckStar）的前端应用，为用户提供直观、现代化的交互界面。基于Vue3生态构建，提供完整的达人数据管理功能。

## 技术栈

- **前端框架**：Vue 3.4 + TypeScript
- **构建工具**：Vite 5.4
- **UI 组件库**：Element Plus 2.4
- **状态管理**：Pinia 2.1 + 持久化插件
- **路由管理**：Vue Router 4.2
- **样式方案**：CSS + Element Plus主题
- **数据处理**：Day.js + XLSX
- **HTTP客户端**：Axios
- **开发工具**：ESLint + 自动导入
- **包管理器**：npm

## 项目结构

```
ps-front/
├── public/             # 静态资源
│   └── star.svg       # 项目图标
├── src/
│   ├── components/     # 可复用组件
│   │   └── Layout/    # 布局组件
│   │       └── MainLayout.vue
│   ├── pages/         # 页面组件
│   │   ├── Auth/      # 认证页面
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── Dashboard/ # 仪表盘
│   │   │   └── Dashboard.vue
│   │   ├── Import/    # 导入功能
│   │   │   └── ImportKOL.vue
│   │   ├── KOL/       # 达人管理
│   │   │   └── KOLList.vue
│   │   ├── Works/     # 作品管理
│   │   │   └── WorksList.vue
│   │   └── Credits/   # 积分管理
│   │       ├── Credits.vue
│   │       └── CreditHistory.vue
│   ├── stores/        # Pinia状态管理
│   │   └── auth.ts    # 认证状态
│   ├── router/        # 路由配置
│   │   └── index.ts   # 路由定义
│   ├── types/         # TypeScript类型定义
│   │   └── index.ts   # 通用类型
│   ├── styles/        # 样式文件
│   │   └── index.css  # 全局样式
│   ├── api/           # API接口
│   │   ├── client.ts  # HTTP客户端
│   │   ├── auth.ts    # 认证接口
│   │   └── index.ts   # 接口导出
│   ├── App.vue        # 主应用组件
│   └── main.ts        # 应用入口
├── index.html         # HTML模板
├── package.json       # 项目配置
├── tsconfig.json      # TypeScript配置
├── vite.config.ts     # Vite配置
├── env.d.ts          # 环境类型声明
└── README.md         # 项目说明
```

## 开发环境设置

### 前置要求

- Node.js（推荐版本：18+）
- npm 或 yarn 包管理器

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

开发服务器将在 http://localhost:3000 启动

## 可用脚本

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# TypeScript类型检查
npm run type-check

# 代码格式化和检查
npm run lint
```

## 构建部署

### 生产构建

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build
```

构建产物将生成在 `dist/` 目录中。

### 预览构建结果

```bash
# 使用 npm
npm run preview

# 或使用 yarn
yarn preview
```

预览服务器将在 http://localhost:4173 启动

## 项目特性

### 🔐 用户管理
- 用户注册和登录
- JWT token认证
- 用户信息管理
- 积分系统集成
- 自动token刷新

### 📥 数据导入
- 支持多平台达人链接导入（小红书、抖音、微博、B站）
- 批量作品链接导入
- 实时导入进度显示
- 导入历史记录
- 错误处理和重试机制

### 📊 数据展示
- 达人信息详细展示
- 作品数据可视化
- 实时数据统计
- 响应式数据表格
- 数据趋势图表

### 🔍 数据管理
- 多维度筛选和搜索
- 自定义排序
- 分页查询
- 批量操作
- Excel数据导出

### 💳 积分系统
- 多种积分套餐
- 实时积分消耗
- 详细消费记录
- 充值功能模拟
- 积分使用统计

### 🎨 用户体验
- 现代化 Element Plus UI 设计
- 响应式布局适配
- 流畅的路由切换
- 直观的操作流程
- 深色/浅色主题支持

### ⚡ 开发体验
- Vue3 Composition API
- TypeScript 全面支持
- 组件和API自动导入
- 热模块替换(HMR)
- 构建优化和代码分割

## 技术亮点

### Vue3 特性
- **Composition API**：更好的逻辑复用和代码组织
- **响应式系统**：基于Proxy的高性能响应式
- **单文件组件**：模板、脚本、样式集成开发

### Element Plus 集成
- **自动按需导入**：减少打包体积
- **主题定制**：统一的设计系统
- **TypeScript支持**：完整的类型提示

### 状态管理
- **Pinia**：Vue3官方推荐的状态管理
- **持久化**：自动同步到localStorage
- **模块化**：按功能拆分store

### 构建优化
- **Vite**：快速的开发构建工具
- **代码分割**：按页面自动分包
- **资源优化**：图片、字体自动优化

## 开发规范

### 代码规范

- 使用 ESLint 进行代码质量检查
- 遵循 Vue3 最佳实践
- 使用 TypeScript 严格模式
- 组件命名采用 PascalCase
- 文件名采用 kebab-case

### 组件开发

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 使用 Composition API
import { ref, reactive, onMounted } from 'vue'
import type { SomeType } from '@/types'

// 响应式数据
const loading = ref(false)
const formData = reactive<SomeType>({})

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
/* 组件样式 */
</style>
```

### 提交规范

使用约定式提交格式：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 样式修改
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
perf: 性能优化
```

## API接口

### 基础配置

- **基础URL**: `http://localhost/api`
- **认证方式**: Bearer Token
- **请求格式**: JSON
- **响应格式**: 统一的ApiResponse格式

### 环境变量

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
```

## 常见问题

### 开发环境问题

**Q: 开发服务器启动失败？**
A: 检查Node.js版本是否为18+，删除node_modules重新安装依赖

**Q: TypeScript报错？**
A: 运行 `npm run type-check` 检查具体错误，确保所有类型定义正确

**Q: Element Plus组件样式异常？**
A: 检查是否正确导入Element Plus样式文件

### 构建部署问题

**Q: 构建后白屏？**
A: 检查路由配置是否正确，确认静态资源路径

**Q: API请求失败？**
A: 检查环境变量配置，确认API服务器地址

## 版本历史

- **v0.2.0** - Vue3重构版本，引入Element Plus和Pinia
- **v0.1.0** - React初始版本（已废弃）

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT License]

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目仓库：[GitHub链接]
- 邮箱：[联系邮箱]

---

© 2025 摘星系统团队 | Powered by Vue3 + Element Plus