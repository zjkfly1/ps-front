import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Image,
  Typography,
  Tooltip,
  message,
  Row,
  Col,
  Statistic,
  DatePicker,
} from 'antd'
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import type { ColumnsType, TableProps } from 'antd/es/table'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import type { Work, QueryParams } from '@/types'

const { Text } = Typography
const { RangePicker } = DatePicker

const WorksList: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<Work[]>([])
  const [filteredData, setFilteredData] = useState<Work[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'publishTime',
    sortOrder: 'desc',
  })

  useEffect(() => {
    fetchWorksList()
  }, [queryParams])

  const fetchWorksList = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟数据
      const mockData: Work[] = [
        {
          id: '1',
          kolId: '1',
          title: '超简单的家常菜做法，新手也能学会！',
          url: 'https://example.com/work1',
          platform: 'xiaohongshu',
          publishTime: '2024-01-20T14:30:00Z',
          likeCount: 8500,
          commentCount: 230,
          shareCount: 156,
          viewCount: 45000,
          description: '今天分享一道超简单的家常菜，用料简单，做法容易...',
          tags: ['美食', '家常菜', '简单'],
          thumbnail: 'https://example.com/thumb1.jpg',
          duration: 120,
          createdAt: '2024-01-20T14:35:00Z',
        },
        {
          id: '2',
          kolId: '2',
          title: '巴厘岛旅行攻略 | 必去景点推荐',
          url: 'https://example.com/work2',
          platform: 'tiktok',
          publishTime: '2024-01-19T10:15:00Z',
          likeCount: 12300,
          commentCount: 445,
          shareCount: 289,
          viewCount: 67000,
          description: '巴厘岛旅行完整攻略，包含住宿、交通、美食推荐...',
          tags: ['旅行', '巴厘岛', '攻略'],
          thumbnail: 'https://example.com/thumb2.jpg',
          duration: 180,
          createdAt: '2024-01-19T10:20:00Z',
        },
        {
          id: '3',
          kolId: '3',
          title: '秋季穿搭指南，让你时髦又保暖',
          url: 'https://example.com/work3',
          platform: 'weibo',
          publishTime: '2024-01-18T16:45:00Z',
          likeCount: 6800,
          commentCount: 189,
          shareCount: 134,
          viewCount: 32000,
          description: '秋季来临，如何穿得既时髦又保暖？这里有最全的搭配技巧...',
          tags: ['时尚', '穿搭', '秋季'],
          thumbnail: 'https://example.com/thumb3.jpg',
          createdAt: '2024-01-18T16:50:00Z',
        },
      ]
      
      setDataSource(mockData)
      setFilteredData(mockData)
    } catch (error) {
      message.error('获取作品列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    const filtered = dataSource.filter(work =>
      work.title.toLowerCase().includes(value.toLowerCase()) ||
      work.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    )
    setFilteredData(filtered)
  }

  const handlePlatformFilter = (platform: string) => {
    if (platform === 'all') {
      setFilteredData(dataSource)
    } else {
      const filtered = dataSource.filter(work => work.platform === platform)
      setFilteredData(filtered)
    }
  }

  const handleDateRangeFilter = (dates: any) => {
    if (!dates || dates.length !== 2) {
      setFilteredData(dataSource)
      return
    }

    const [start, end] = dates
    const filtered = dataSource.filter(work => {
      const publishDate = dayjs(work.publishTime)
      return publishDate.isAfter(start) && publishDate.isBefore(end)
    })
    setFilteredData(filtered)
  }

  const handleExport = () => {
    const exportData = (selectedRowKeys.length > 0 
      ? filteredData.filter(work => selectedRowKeys.includes(work.id))
      : filteredData
    ).map(work => ({
      '作品标题': work.title,
      '平台': getPlatformText(work.platform),
      '发布时间': new Date(work.publishTime).toLocaleString(),
      '点赞数': work.likeCount,
      '评论数': work.commentCount,
      '分享数': work.shareCount,
      '播放数': work.viewCount || 0,
      '时长(秒)': work.duration || 0,
      '标签': work.tags.join(', '),
      '作品链接': work.url,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '作品列表')
    XLSX.writeFile(wb, `作品列表_${new Date().toISOString().split('T')[0]}.xlsx`)
    
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

  const formatDuration = (seconds: number) => {
    if (!seconds) return '-'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const columns: ColumnsType<Work> = [
    {
      title: '作品信息',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ marginRight: 12, flexShrink: 0 }}>
            {record.thumbnail ? (
              <Image
                src={record.thumbnail}
                width={60}
                height={60}
                style={{ borderRadius: 4, objectFit: 'cover' }}
                preview={false}
              />
            ) : (
              <div 
                style={{ 
                  width: 60, 
                  height: 60, 
                  backgroundColor: '#f0f0f0',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PlayCircleOutlined style={{ fontSize: 20, color: '#666' }} />
              </div>
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div 
              style={{ 
                fontWeight: 'bold', 
                marginBottom: 4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {record.title}
            </div>
            <Space size={4} style={{ marginBottom: 4 }}>
              <Tag color={getPlatformColor(record.platform)} size="small">
                {getPlatformText(record.platform)}
              </Tag>
              {record.duration && (
                <Tag size="small">{formatDuration(record.duration)}</Tag>
              )}
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(record.publishTime).format('YYYY-MM-DD HH:mm')}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 100,
      sorter: (a, b) => a.likeCount - b.likeCount,
      render: (value) => formatNumber(value),
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 100,
      sorter: (a, b) => a.commentCount - b.commentCount,
      render: (value) => formatNumber(value),
    },
    {
      title: '分享数',
      dataIndex: 'shareCount',
      key: 'shareCount',
      width: 100,
      sorter: (a, b) => a.shareCount - b.shareCount,
      render: (value) => formatNumber(value),
    },
    {
      title: '播放数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      sorter: (a, b) => (a.viewCount || 0) - (b.viewCount || 0),
      render: (value) => value ? formatNumber(value) : '-',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
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
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Tooltip title="查看作品">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(record.url, '_blank')}
          />
        </Tooltip>
      ),
    },
  ]

  const rowSelection: TableProps<Work>['rowSelection'] = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={2}>作品列表</Typography.Title>
        <Text type="secondary">管理和查看所有导入的作品数据</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总作品数" value={dataSource.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总点赞数" 
              value={dataSource.reduce((sum, work) => sum + work.likeCount, 0)}
              formatter={(value) => formatNumber(Number(value))}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总播放数" 
              value={dataSource.reduce((sum, work) => sum + (work.viewCount || 0), 0)}
              formatter={(value) => formatNumber(Number(value))}
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
          <Col xs={24} sm={12} md={6}>
            <Input.Search
              placeholder="搜索作品标题或标签"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
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
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
              onChange={handleDateRangeFilter}
            />
          </Col>
          <Col xs={24} md={7}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchWorksList}
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

export default WorksList
