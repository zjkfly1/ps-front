import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Typography,
  Space,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Statistic,
  message,
} from 'antd'
import {
  ReloadOutlined,
  ExportOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { useAuthStore } from '@/stores/authStore'
import type { CreditRecord } from '@/types'

const { Text } = Typography
const { RangePicker } = DatePicker

const CreditHistory: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<CreditRecord[]>([])
  const [filteredData, setFilteredData] = useState<CreditRecord[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const { user } = useAuthStore()

  useEffect(() => {
    fetchCreditHistory()
  }, [pagination.current, pagination.pageSize])

  const fetchCreditHistory = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟数据
      const mockData: CreditRecord[] = [
        {
          id: '1',
          userId: user?.id || '1',
          type: 'charge',
          amount: 1000,
          balance: 8500,
          description: '积分充值 - 购买1000积分套餐',
          createdAt: '2024-01-20T10:30:00Z',
        },
        {
          id: '2',
          userId: user?.id || '1',
          type: 'consume',
          amount: -10,
          balance: 8490,
          description: '导入达人数据 - 美食博主小王',
          relatedTask: 'task_001',
          createdAt: '2024-01-20T11:15:00Z',
        },
        {
          id: '3',
          userId: user?.id || '1',
          type: 'consume',
          amount: -5,
          balance: 8485,
          description: '导入作品数据 - 超简单的家常菜做法',
          relatedTask: 'task_002',
          createdAt: '2024-01-20T11:20:00Z',
        },
        {
          id: '4',
          userId: user?.id || '1',
          type: 'consume',
          amount: -15,
          balance: 8470,
          description: '批量导入作品数据 - 3个作品',
          relatedTask: 'task_003',
          createdAt: '2024-01-20T14:30:00Z',
        },
        {
          id: '5',
          userId: user?.id || '1',
          type: 'charge',
          amount: 500,
          balance: 8970,
          description: '积分充值 - 购买500积分套餐',
          createdAt: '2024-01-19T16:45:00Z',
        },
        {
          id: '6',
          userId: user?.id || '1',
          type: 'consume',
          amount: -2,
          balance: 8468,
          description: '数据导出 - 达人列表导出Excel',
          relatedTask: 'export_001',
          createdAt: '2024-01-20T15:00:00Z',
        },
      ]
      
      setDataSource(mockData)
      setFilteredData(mockData)
      setPagination(prev => ({ ...prev, total: mockData.length }))
    } catch (error) {
      message.error('获取积分记录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeFilter = (type: string) => {
    if (type === 'all') {
      setFilteredData(dataSource)
    } else {
      const filtered = dataSource.filter(record => record.type === type)
      setFilteredData(filtered)
    }
  }

  const handleDateRangeFilter = (dates: any) => {
    if (!dates || dates.length !== 2) {
      setFilteredData(dataSource)
      return
    }

    const [start, end] = dates
    const filtered = dataSource.filter(record => {
      const recordDate = dayjs(record.createdAt)
      return recordDate.isAfter(start) && recordDate.isBefore(end)
    })
    setFilteredData(filtered)
  }

  const handleExport = () => {
    const exportData = filteredData.map(record => ({
      '时间': new Date(record.createdAt).toLocaleString(),
      '类型': record.type === 'charge' ? '充值' : '消费',
      '金额': record.amount,
      '余额': record.balance,
      '描述': record.description,
      '相关任务': record.relatedTask || '-',
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '积分记录')
    XLSX.writeFile(wb, `积分记录_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    message.success('导出成功')
  }

  const getTypeTag = (type: string, amount: number) => {
    if (type === 'charge') {
      return (
        <Tag icon={<ArrowUpOutlined />} color="success">
          充值
        </Tag>
      )
    } else {
      return (
        <Tag icon={<ArrowDownOutlined />} color="error">
          消费
        </Tag>
      )
    }
  }

  const formatAmount = (amount: number) => {
    return amount > 0 ? `+${amount}` : `${amount}`
  }

  const getAmountColor = (amount: number) => {
    return amount > 0 ? '#52c41a' : '#f5222d'
  }

  // 计算统计数据
  const totalCharge = filteredData
    .filter(record => record.type === 'charge')
    .reduce((sum, record) => sum + record.amount, 0)
  
  const totalConsume = Math.abs(
    filteredData
      .filter(record => record.type === 'consume')
      .reduce((sum, record) => sum + record.amount, 0)
  )

  const columns: ColumnsType<CreditRecord> = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value) => (
        <div>
          <div>{dayjs(value).format('YYYY-MM-DD')}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(value).format('HH:mm:ss')}
          </Text>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type, record) => getTypeTag(type, record.amount),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <Text style={{ color: getAmountColor(amount), fontWeight: 'bold' }}>
          {formatAmount(amount)}
        </Text>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 100,
      align: 'right',
      render: (balance) => (
        <Text style={{ fontWeight: 'bold' }}>{balance}</Text>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description, record) => (
        <div>
          <div>{description}</div>
          {record.relatedTask && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              任务ID: {record.relatedTask}
            </Text>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={2}>积分记录</Typography.Title>
        <Text type="secondary">查看您的积分充值和消费历史记录</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="当前余额"
              value={user?.credits || 0}
              valueStyle={{ color: '#1890ff' }}
              suffix="积分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总充值"
              value={totalCharge}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="积分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总消费"
              value={totalConsume}
              valueStyle={{ color: '#f5222d' }}
              prefix={<ArrowDownOutlined />}
              suffix="积分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="记录数量"
              value={filteredData.length}
              suffix="条"
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选操作栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="选择类型"
              allowClear
              style={{ width: '100%' }}
              onChange={handleTypeFilter}
              defaultValue="all"
            >
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="charge">充值记录</Select.Option>
              <Select.Option value="consume">消费记录</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
              onChange={handleDateRangeFilter}
            />
          </Col>
          <Col xs={24} md={10}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchCreditHistory}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={handleExport}
                disabled={filteredData.length === 0}
              >
                导出Excel
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => 
              setPagination(prev => ({ ...prev, current: page, pageSize })),
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  )
}

export default CreditHistory
