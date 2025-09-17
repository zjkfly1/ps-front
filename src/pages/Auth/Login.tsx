import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined, StarFilled } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'
import type { LoginRequest } from '@/types'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (values: LoginRequest) => {
    setLoading(true)
    try {
      // 调用登录API
      const response = await authApi.login(values)
      
      // 登录成功，更新状态
      login(response.user, response.token)
      message.success('登录成功！')
      navigate('/dashboard')
    } catch (error) {
      // 错误处理已在API客户端中统一处理
      console.error('登录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <StarFilled style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            摘星系统
          </Title>
          <Text type="secondary">达人数据管理平台</Text>
        </div>

        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 44 }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
              <Link to="/register">注册账号</Link>
              <a href="#forgot">忘记密码</a>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
