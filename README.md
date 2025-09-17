# 摘星系统 - 前端页面

## 项目简介

摘星系统（PluckStar）的前端应用，为用户提供直观、现代化的交互界面。

## 技术栈

- 前端框架：React 18 + TypeScript
- 构建工具：Vite 4
- UI 组件库：Ant Design 5
- 状态管理：Zustand
- 路由管理：React Router DOM 6
- 样式方案：CSS + Ant Design主题
- 数据处理：Day.js + XLSX
- HTTP客户端：Axios
- 包管理器：npm

## 项目结构

```
ps-front/
├── public/            # 静态资源
│   └── star.svg      # 项目图标
├── src/
│   ├── components/    # 可复用组件
│   │   └── Layout/   # 布局组件
│   ├── pages/        # 页面组件
│   │   ├── Auth/     # 认证页面
│   │   ├── Dashboard/# 仪表盘
│   │   ├── Import/   # 导入功能
│   │   ├── KOL/      # 达人管理
│   │   ├── Works/    # 作品管理
│   │   └── Credits/  # 积分管理
│   ├── stores/       # 状态管理
│   ├── types/        # TypeScript类型定义
│   ├── styles/       # 样式文件
│   ├── utils/        # 工具函数
│   ├── hooks/        # 自定义hooks
│   ├── api/          # API接口
│   ├── App.tsx       # 主应用组件
│   └── main.tsx      # 应用入口
├── index.html        # HTML模板
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript配置
├── vite.config.ts    # Vite配置
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

## 构建部署

### 生产构建

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build
```

### 预览构建结果

```bash
# 使用 npm
npm run preview

# 或使用 yarn
yarn preview
```

## 项目特性

### 🔐 用户管理
- 用户注册和登录
- 用户信息管理
- 积分系统集成

### 📥 数据导入
- 支持多平台达人链接导入（小红书、抖音、微博、B站）
- 批量作品链接导入
- 实时导入进度显示
- 导入结果预览

### 📊 数据展示
- 达人信息详细展示
- 作品数据可视化
- 实时数据统计
- 响应式数据表格

### 🔍 数据管理
- 多维度筛选和搜索
- 自定义排序
- 批量操作
- Excel数据导出

### 💳 积分系统
- 多种积分套餐
- 实时积分消耗
- 详细消费记录
- 支付宝/微信支付集成

### 🎨 用户体验
- 现代化 UI 设计
- 响应式布局适配
- 流畅的交互动画
- 直观的操作流程

## 开发规范

### 代码规范

- 使用 ESLint 进行代码质量检查
- 使用 Prettier 进行代码格式化
- 遵循组件化开发原则

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
```

## 目录说明

```
src/
├── components/        # 可复用组件
├── pages/            # 页面组件
├── utils/            # 工具函数
├── hooks/            # 自定义 hooks
├── styles/           # 样式文件
├── assets/           # 静态资源
└── api/              # API 接口
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 版本历史

- v0.1.0 - 项目初始化

## 许可证

[待定]

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目仓库：[GitHub链接]
- 邮箱：[联系邮箱]

---

© 2025 摘星系统团队
