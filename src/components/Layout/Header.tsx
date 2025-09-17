import React from 'react'
import { Layout, Avatar, Dropdown, Badge, Typography, Space } from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  CreditCardOutlined,
  StarFilled,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useAuthStore } from '@/stores/authStore'

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header: React.FC = () => {
  const { user, logout } = useAuthStore()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: logout,
    },
  ]

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo区域 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StarFilled style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
        <Text strong style={{ fontSize: '20px', color: '#1890ff' }}>
          摘星系统
        </Text>
      </div>

      {/* 用户信息区域 */}
      <Space size="middle">
        {/* 积分显示 */}
        <Space>
          <CreditCardOutlined style={{ color: '#faad14' }} />
          <Text>积分: </Text>
          <Badge
            count={user?.credits || 0}
            style={{
              backgroundColor: '#52c41a',
              color: '#fff',
              fontWeight: 'bold',
            }}
            overflowCount={999999}
          />
        </Space>

        {/* 用户头像和菜单 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar
              size="small"
              src={user?.avatar}
              icon={<UserOutlined />}
              style={{ marginRight: '8px' }}
            />
            <Text>{user?.username || '用户'}</Text>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header
