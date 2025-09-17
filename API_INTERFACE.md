# API 接口文档

## 基础配置

- **基础URL**: `http://localhost/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token

## 通用响应格式

所有API响应都应遵循以下格式：

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}
```

## 认证接口

### 1. 用户注册

**POST** `/user/register`

#### 请求参数
```typescript
{
  username: string    // 用户名，3-20个字符
  email: string      // 邮箱地址
  password: string   // 密码，至少6个字符
  confirmPassword: string // 确认密码
}
```

#### 响应示例
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "username": "testuser",
      "email": "test@example.com",
      "credits": 100,
      "avatar": null,
      "createdAt": "2024-01-20T10:30:00Z"
    },
    "message": "注册成功"
  }
}
```

#### 错误响应
```json
{
  "success": false,
  "message": "用户名已存在",
  "code": 422
}
```

### 2. 用户登录

**POST** `/user/login`

#### 请求参数
```typescript
{
  username: string  // 用户名
  password: string  // 密码
}
```

#### 响应示例
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "username": "testuser",
      "email": "test@example.com",
      "credits": 850,
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-20T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### 错误响应
```json
{
  "success": false,
  "message": "用户名或密码错误",
  "code": 401
}
```

### 3. 退出登录

**POST** `/user/logout`

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应示例
```json
{
  "success": true,
  "message": "退出登录成功"
}
```

### 4. 获取用户信息

**GET** `/user/profile`

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应示例
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "username": "testuser",
      "email": "test@example.com",
      "credits": 850,
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

### 5. 刷新Token

**POST** `/user/refresh-token`

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应示例
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 6. 验证Token

**GET** `/user/validate-token`

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应示例
```json
{
  "success": true,
  "data": {
    "valid": true
  }
}
```

## 错误处理

### HTTP状态码

- `200`: 成功
- `401`: 未授权（token无效或过期）
- `403`: 权限不足
- `404`: 资源不存在
- `422`: 请求参数错误
- `500`: 服务器内部错误

### 错误响应格式

```json
{
  "success": false,
  "message": "错误信息",
  "code": 422,
  "errors": {
    "username": ["用户名已存在"],
    "email": ["邮箱格式不正确"]
  }
}
```

## 前端实现说明

### 1. 自动Token管理

前端会自动处理token的存储和发送：
- 登录成功后自动存储token到localStorage
- 每次请求自动在请求头中添加token
- token过期时自动清除本地存储并跳转到登录页

### 2. 统一错误处理

前端已实现统一的错误处理：
- 网络错误自动提示
- 401错误自动跳转登录页
- 表单验证错误自动显示

### 3. 请求日志

所有API请求和响应都会在控制台输出日志，便于调试。

## 测试建议

1. 可以使用Postman或类似工具测试API
2. 确保响应格式严格按照文档要求
3. 测试各种错误场景，如无效token、参数错误等
4. 注意CORS配置，允许前端域名访问

## 环境变量配置

可以通过环境变量配置API基础URL：

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

如果不设置此环境变量，默认使用 `http://localhost/api`
