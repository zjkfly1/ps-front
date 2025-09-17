import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, List, Tag, Progress, Space, Button } from 'antd'
import {
  TeamOutlined,
  VideoCameraOutlined,
  CreditCardOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { Stats, Task, KOL } from '@/types'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({
    totalKOLs: 0,
    totalWorks: 0,
    totalCredits: 0,
    todayTasks: 0,
    monthlyGrowth: {
      kols: 0,
      works: 0,
      tasks: 0,
    },
  })
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [topKOLs, setTopKOLs] = useState<KOL[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟统计数据
      setStats({
        totalKOLs: 156,
        totalWorks: 2340,
        totalCredits: 8500,
        todayTasks: 23,
        monthlyGrowth: {
          kols: 12.5,
          works: 34.2,
          tasks: 8.9,
        },
      })

      // 模拟最近任务
      setRecentTasks([
        {
          id: '1',
          userId: '1',
          type: 'import_kol',
          status: 'completed',
          input: { url: 'https://example.com/kol1' },
          creditCost: 10,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: '1',
          type: 'import_work',
          status: 'processing',
          input: { url: 'https://example.com/work1' },
          creditCost: 5,
          createdAt: new Date().toISOString(),
        },
      ])

      // 模拟热门达人
      setTopKOLs([
        {
          id: '1',
          name: '美食博主小王',
          platform: 'xiaohongshu',
          profileUrl: 'https://example.com',
          followerCount: 125000,
          likeCount: 980000,
          totalWorks: 234,
          tags: ['美食', '生活'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTaskStatusColor = (status: string) => {
    const colors = {
      completed: 'success',
      processing: 'processing',
      pending: 'default',
      failed: 'error',
    }
    return colors[status as keyof typeof colors] || 'default'
  }

  const getTaskTypeText = (type: string) => {
    const types = {
      import_kol: '导入达人',
      import_work: '导入作品',
      export_data: '导出数据',
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>仪表盘</Title>
        <Text type="secondary">欢迎回到摘星系统，查看您的数据概览</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="总达人数"
              value={stats.totalKOLs}
              prefix={<TeamOutlined />}
              suffix={
                <Space>
                  <RiseOutlined style={{ color: '#3f8600' }} />
                  <Text type="success">{stats.monthlyGrowth.kols}%</Text>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="总作品数"
              value={stats.totalWorks}
              prefix={<VideoCameraOutlined />}
              suffix={
                <Space>
                  <RiseOutlined style={{ color: '#3f8600' }} />
                  <Text type="success">{stats.monthlyGrowth.works}%</Text>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="剩余积分"
              value={stats.totalCredits}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="今日任务"
              value={stats.todayTasks}
              prefix={<TrophyOutlined />}
              suffix={
                <Space>
                  <RiseOutlined style={{ color: '#3f8600' }} />
                  <Text type="success">{stats.monthlyGrowth.tasks}%</Text>
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近任务 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近任务"
            loading={loading}
            extra={
              <Button type="link" onClick={() => navigate('/import')}>
                <ImportOutlined /> 新建任务
              </Button>
            }
          >
            <List
              dataSource={recentTasks}
              renderItem={(task) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{getTaskTypeText(task.type)}</Text>
                        <Tag color={getTaskStatusColor(task.status)}>
                          {task.status === 'completed' && '已完成'}
                          {task.status === 'processing' && '处理中'}
                          {task.status === 'pending' && '等待中'}
                          {task.status === 'failed' && '失败'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary">消耗积分: {task.creditCost}</Text>
                        <Text type="secondary">
                          {new Date(task.createdAt).toLocaleString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 热门达人 */}
        <Col xs={24} lg={12}>
          <Card
            title="热门达人"
            loading={loading}
            extra={
              <Button type="link" onClick={() => navigate('/kol-list')}>
                <EyeOutlined /> 查看全部
              </Button>
            }
          >
            <List
              dataSource={topKOLs}
              renderItem={(kol) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{kol.name}</Text>
                        {kol.tags.map(tag => (
                          <Tag key={tag} size="small">{tag}</Tag>
                        ))}
                      </Space>
                    }
                    description={
                      <div>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Space>
                            <Text type="secondary">粉丝: {kol.followerCount.toLocaleString()}</Text>
                            <Text type="secondary">作品: {kol.totalWorks}</Text>
                          </Space>
                          <Progress
                            percent={Math.min((kol.followerCount / 1000000) * 100, 100)}
                            size="small"
                            showInfo={false}
                          />
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
