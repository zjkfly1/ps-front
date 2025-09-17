import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  ImportOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  CreditCardOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems: MenuItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/import',
      icon: <ImportOutlined />,
      label: '导入达人',
    },
    {
      key: '/kol-list',
      icon: <TeamOutlined />,
      label: '达人列表',
    },
    {
      key: '/works-list',
      icon: <VideoCameraOutlined />,
      label: '作品列表',
    },
    {
      key: 'credits-group',
      label: '积分管理',
      icon: <CreditCardOutlined />,
      children: [
        {
          key: '/credits',
          icon: <CreditCardOutlined />,
          label: '积分充值',
        },
        {
          key: '/credit-history',
          icon: <HistoryOutlined />,
          label: '积分记录',
        },
      ],
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key !== 'credits-group') {
      navigate(key)
    }
  }

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname
    return [path]
  }

  // 获取默认展开的菜单项
  const getOpenKeys = () => {
    const path = location.pathname
    if (path.startsWith('/credits') || path.startsWith('/credit-history')) {
      return ['credits-group']
    }
    return []
  }

  return (
    <Sider
      width={220}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          height: '100%',
          borderRight: 0,
          paddingTop: '16px',
        }}
      />
    </Sider>
  )
}

export default Sidebar
