import React, { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Alert,
  Progress,
  Result,
  Divider,
  Row,
  Col,
} from 'antd'
import {
  ImportOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

interface ImportForm {
  type: 'kol' | 'work'
  url: string
  batchUrls?: string
}

interface ImportTask {
  id: string
  type: 'kol' | 'work'
  url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: any
  error?: string
}

const ImportKOL: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<ImportTask[]>([])
  const { user, updateCredits } = useAuthStore()

  const handleSubmit = async (values: ImportForm) => {
    setLoading(true)
    
    try {
      // 解析URL
      const urls = values.type === 'work' && values.batchUrls 
        ? values.batchUrls.split('\n').filter(url => url.trim())
        : [values.url]

      // 计算所需积分
      const creditCost = values.type === 'kol' ? 10 : 5
      const totalCost = creditCost * urls.length

      if (!user || user.credits < totalCost) {
        throw new Error(`积分不足，需要${totalCost}积分，当前余额${user?.credits || 0}积分`)
      }

      // 创建任务
      const newTasks: ImportTask[] = urls.map((url, index) => ({
        id: `task_${Date.now()}_${index}`,
        type: values.type,
        url: url.trim(),
        status: 'pending',
        progress: 0,
      }))

      setTasks(newTasks)

      // 模拟批量处理
      for (let i = 0; i < newTasks.length; i++) {
        const task = newTasks[i]
        
        // 更新状态为处理中
        setTasks(prev => prev.map(t => 
          t.id === task.id ? { ...t, status: 'processing' } : t
        ))

        // 模拟处理进度
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, progress } : t
          ))
        }

        // 模拟处理结果
        const success = Math.random() > 0.1 // 90%成功率
        
        if (success) {
          const mockResult = values.type === 'kol' ? {
            name: '达人名称',
            platform: 'xiaohongshu',
            followerCount: 125000,
          } : {
            title: '作品标题',
            likeCount: 8500,
            commentCount: 230,
          }

          setTasks(prev => prev.map(t => 
            t.id === task.id ? { 
              ...t, 
              status: 'completed', 
              progress: 100,
              result: mockResult 
            } : t
          ))

          // 扣除积分
          updateCredits((user?.credits || 0) - creditCost)
        } else {
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { 
              ...t, 
              status: 'failed', 
              progress: 100,
              error: '解析失败，请检查链接是否有效'
            } : t
          ))
        }
      }

      form.resetFields()
    } catch (error) {
      console.error('Import failed:', error)
      // 处理错误
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'default',
      processing: 'blue',
      completed: 'green',
      failed: 'red',
    }
    return colors[status as keyof typeof colors]
  }

  const getStatusIcon = (task: ImportTask) => {
    if (task.status === 'processing') {
      return <LoadingOutlined />
    }
    if (task.status === 'completed') {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />
    }
    return null
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>导入达人数据</Title>
        <Text type="secondary">支持从各大平台导入达人信息和作品数据</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="导入配置" style={{ height: 'fit-content' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ type: 'kol' }}
            >
              <Form.Item
                label="导入类型"
                name="type"
                rules={[{ required: true, message: '请选择导入类型' }]}
              >
                <Select>
                  <Select.Option value="kol">达人主页</Select.Option>
                  <Select.Option value="work">作品链接</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const type = getFieldValue('type')
                  return (
                    <>
                      <Form.Item
                        label={type === 'kol' ? '达人主页链接' : '作品链接'}
                        name="url"
                        rules={[
                          { required: true, message: '请输入链接' },
                          { type: 'url', message: '请输入有效的URL' },
                        ]}
                      >
                        <Input
                          prefix={<LinkOutlined />}
                          placeholder={
                            type === 'kol' 
                              ? 'https://www.xiaohongshu.com/user/...' 
                              : 'https://www.xiaohongshu.com/explore/...'
                          }
                        />
                      </Form.Item>

                      {type === 'work' && (
                        <Form.Item
                          label="批量导入"
                          name="batchUrls"
                          extra="每行一个链接，支持批量导入多个作品"
                        >
                          <TextArea
                            rows={4}
                            placeholder="https://www.xiaohongshu.com/explore/...&#10;https://www.xiaohongshu.com/explore/..."
                          />
                        </Form.Item>
                      )}
                    </>
                  )
                }}
              </Form.Item>

              <Alert
                message="积分消耗说明"
                description={
                  <div>
                    <p>• 导入达人主页：10积分/次</p>
                    <p>• 导入作品数据：5积分/次</p>
                    <p>• 当前积分余额：{user?.credits || 0}</p>
                  </div>
                }
                type="info"
                style={{ marginBottom: 16 }}
              />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<ImportOutlined />}
                  block
                  size="large"
                >
                  开始导入
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="导入进度" style={{ height: 'fit-content' }}>
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">暂无导入任务</Text>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                {tasks.map((task, index) => (
                  <div key={task.id}>
                    <div style={{ marginBottom: 8 }}>
                      <Space>
                        {getStatusIcon(task)}
                        <Text strong>
                          {task.type === 'kol' ? '达人主页' : '作品'} #{index + 1}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {task.url.substring(0, 50)}...
                        </Text>
                      </Space>
                    </div>
                    
                    <Progress
                      percent={task.progress}
                      status={task.status === 'failed' ? 'exception' : undefined}
                      strokeColor={getStatusColor(task.status)}
                      size="small"
                    />
                    
                    {task.status === 'completed' && task.result && (
                      <div style={{ marginTop: 8, padding: 8, background: '#f6ffed', borderRadius: 4 }}>
                        <Text type="success" style={{ fontSize: '12px' }}>
                          {task.type === 'kol' 
                            ? `导入成功：${task.result.name} (${task.result.followerCount}粉丝)`
                            : `导入成功：${task.result.title} (${task.result.likeCount}点赞)`
                          }
                        </Text>
                      </div>
                    )}
                    
                    {task.status === 'failed' && task.error && (
                      <div style={{ marginTop: 8, padding: 8, background: '#fff2f0', borderRadius: 4 }}>
                        <Text type="danger" style={{ fontSize: '12px' }}>
                          {task.error}
                        </Text>
                      </div>
                    )}
                    
                    {index < tasks.length - 1 && <Divider style={{ margin: '16px 0' }} />}
                  </div>
                ))}
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ImportKOL
