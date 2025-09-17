import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Typography,
  Tooltip,
  message,
  Row,
  Col,
  Statistic,
} from 'antd'
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType, TableProps } from 'antd/es/table'
import * as XLSX from 'xlsx'
import type { KOL, QueryParams } from '@/types'

const { Text } = Typography

const KOLList: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<KOL[]>([])
  const [filteredData, setFilteredData] = useState<KOL[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  useEffect(() => {
    fetchKOLList()
  }, [queryParams])

  const fetchKOLList = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟数据
      const mockData: KOL[] = [
        {
          id: '1',
          name: '美食博主小王',
          platform: 'xiaohongshu',
          profileUrl: 'https://example.com/user1',
          avatar: 'https://example.com/avatar1.jpg',
          description: '专注分享美食制作技巧和生活美学',
          followerCount: 125000,
          likeCount: 980000,
          totalWorks: 234,
          tags: ['美食', '生活', '烘焙'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-20T14:20:00Z',
        },
        {
          id: '2',
          name: '旅行达人Lisa',
          platform: 'tiktok',
          profileUrl: 'https://example.com/user2',
          followerCount: 89000,
          likeCount: 650000,
          totalWorks: 156,
          tags: ['旅行', '摄影'],
          createdAt: '2024-01-12T09:15:00Z',
          updatedAt: '2024-01-18T16:45:00Z',
        },
        {
          id: '3',
          name: '时尚穿搭师',
          platform: 'weibo',
          profileUrl: 'https://example.com/user3',
          followerCount: 203000,
          likeCount: 1250000,
          totalWorks: 445,
          tags: ['时尚', '穿搭', '美妆'],
          createdAt: '2024-01-10T15:22:00Z',
          updatedAt: '2024-01-19T11:30:00Z',
        },
      ]
      
      setDataSource(mockData)
      setFilteredData(mockData)
    } catch (error) {
      message.error('获取达人列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const filtered = dataSource.filter(kol =>
      kol.name.toLowerCase().includes(value.toLowerCase()) ||
      kol.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    )
    setFilteredData(filtered)
  }

  const handlePlatformFilter = (platform: string) => {
    if (platform === 'all') {
      setFilteredData(dataSource)
    } else {
      const filtered = dataSource.filter(kol => kol.platform === platform)
      setFilteredData(filtered)
    }
  }

  const handleExport = () => {
    const exportData = (selectedRowKeys.length > 0 
      ? filteredData.filter(kol => selectedRowKeys.includes(kol.id))
      : filteredData
    ).map(kol => ({
      '达人名称': kol.name,
      '平台': getPlatformText(kol.platform),
      '粉丝数': kol.followerCount,
      '点赞数': kol.likeCount,
      '作品数': kol.totalWorks,
      '标签': kol.tags.join(', '),
      '主页链接': kol.profileUrl,
      '创建时间': new Date(kol.createdAt).toLocaleString(),
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '达人列表')
    XLSX.writeFile(wb, `达人列表_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    message.success('导出成功')
  }

  const getPlatformText = (platform: string) => {
    const platformMap = {
      xiaohongshu: '小红书',
      tiktok: '抖音',
      weibo: '微博',
      bilibili: 'B站',
      other: '其他',
    }
    return platformMap[platform as keyof typeof platformMap] || platform
  }

  const getPlatformColor = (platform: string) => {
    const colorMap = {
      xiaohongshu: '#ff2442',
      tiktok: '#000000',
      weibo: '#e6162d',
      bilibili: '#00a1d6',
      other: '#666666',
    }
    return colorMap[platform as keyof typeof colorMap] || '#666666'
  }

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toLocaleString()
  }

  const columns: ColumnsType<KOL> = [
    {
      title: '达人信息',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={record.avatar}
            size={40}
            style={{ marginRight: 12, flexShrink: 0 }}
          >
            {record.name.charAt(0)}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
              {record.name}
            </div>
            <Tag color={getPlatformColor(record.platform)} size="small">
              {getPlatformText(record.platform)}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: '粉丝数',
      dataIndex: 'followerCount',
      key: 'followerCount',
      width: 120,
      sorter: (a, b) => a.followerCount - b.followerCount,
      render: (value) => formatNumber(value),
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 120,
      sorter: (a, b) => a.likeCount - b.likeCount,
      render: (value) => formatNumber(value),
    },
    {
      title: '作品数',
      dataIndex: 'totalWorks',
      key: 'totalWorks',
      width: 100,
      sorter: (a, b) => a.totalWorks - b.totalWorks,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <div>
          {tags.slice(0, 2).map(tag => (
            <Tag key={tag} size="small" style={{ marginBottom: 2 }}>
              {tag}
            </Tag>
          ))}
          {tags.length > 2 && (
            <Tooltip title={tags.slice(2).join(', ')}>
              <Tag size="small" style={{ marginBottom: 2 }}>
                +{tags.length - 2}
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => window.open(record.profileUrl, '_blank')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const rowSelection: TableProps<KOL>['rowSelection'] = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={2}>达人列表</Typography.Title>
        <Text type="secondary">管理和查看所有导入的达人数据</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总达人数" value={dataSource.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="平均粉丝数" 
              value={dataSource.length > 0 
                ? Math.round(dataSource.reduce((sum, kol) => sum + kol.followerCount, 0) / dataSource.length)
                : 0
              }
              formatter={(value) => formatNumber(Number(value))}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总作品数" 
              value={dataSource.reduce((sum, kol) => sum + kol.totalWorks, 0)}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="选中数量" value={selectedRowKeys.length} />
          </Card>
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="搜索达人名称或标签"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="选择平台"
              allowClear
              style={{ width: '100%' }}
              onChange={handlePlatformFilter}
            >
              <Select.Option value="all">全部平台</Select.Option>
              <Select.Option value="xiaohongshu">小红书</Select.Option>
              <Select.Option value="tiktok">抖音</Select.Option>
              <Select.Option value="weibo">微博</Select.Option>
              <Select.Option value="bilibili">B站</Select.Option>
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchKOLList}
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
          rowSelection={rowSelection}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => 
              setQueryParams(prev => ({ ...prev, page, pageSize })),
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  )
}

export default KOLList
