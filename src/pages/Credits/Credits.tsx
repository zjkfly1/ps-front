import React, { useState } from 'react'
import {
  Card,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Badge,
  message,
  Modal,
  Radio,
  Divider,
} from 'antd'
import {
  CreditCardOutlined,
  WalletOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  PayCircleOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'

const { Title, Text, Paragraph } = Typography

interface CreditPackage {
  id: string
  credits: number
  price: number
  bonus: number
  popular?: boolean
  discount?: string
}

const Credits: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [paymentVisible, setPaymentVisible] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'alipay' | 'wechat' | 'card'>('alipay')
  const { user, updateCredits } = useAuthStore()

  const creditPackages: CreditPackage[] = [
    {
      id: 'basic',
      credits: 100,
      price: 10,
      bonus: 0,
    },
    {
      id: 'standard',
      credits: 500,
      price: 45,
      bonus: 50,
      discount: '优惠5元',
    },
    {
      id: 'premium',
      credits: 1000,
      price: 80,
      bonus: 200,
      popular: true,
      discount: '优惠20元',
    },
    {
      id: 'vip',
      credits: 2000,
      price: 150,
      bonus: 500,
      discount: '优惠50元',
    },
  ]

  const handlePurchase = (pkg: CreditPackage) => {
    setSelectedPackage(pkg)
    setPaymentVisible(true)
  }

  const handlePayment = async () => {
    if (!selectedPackage) return

    setLoading(true)
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 更新积分
      const newCredits = (user?.credits || 0) + selectedPackage.credits + selectedPackage.bonus
      updateCredits(newCredits)
      
      message.success(`充值成功！获得${selectedPackage.credits + selectedPackage.bonus}积分`)
      setPaymentVisible(false)
      setSelectedPackage(null)
    } catch (error) {
      message.error('支付失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const creditUsage = [
    {
      action: '导入达人主页',
      cost: 10,
      description: '获取达人基本信息、粉丝数据和作品列表',
    },
    {
      action: '导入单个作品',
      cost: 5,
      description: '获取作品详细数据，包括点赞、评论、分享等',
    },
    {
      action: '数据导出',
      cost: 2,
      description: '导出Excel表格，支持自定义字段',
    },
    {
      action: '批量操作',
      cost: '按量计算',
      description: '批量导入多个达人或作品，享受批量优惠',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>积分充值</Title>
        <Text type="secondary">选择合适的积分套餐，开始使用摘星系统的强大功能</Text>
      </div>

      {/* 当前积分状态 */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="当前积分"
              value={user?.credits || 0}
              prefix={<CreditCardOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="今日消耗"
              value={23}
              prefix={<PayCircleOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="可导入达人"
              value={Math.floor((user?.credits || 0) / 10)}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 积分套餐 */}
      <Card title="积分套餐" style={{ marginBottom: 32 }}>
        <Row gutter={[24, 24]}>
          {creditPackages.map((pkg) => (
            <Col key={pkg.id} xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{
                  position: 'relative',
                  border: pkg.popular ? '2px solid #1890ff' : '1px solid #d9d9d9',
                }}
                actions={[
                  <Button
                    type={pkg.popular ? 'primary' : 'default'}
                    size="large"
                    onClick={() => handlePurchase(pkg)}
                    style={{ width: '80%' }}
                  >
                    立即购买
                  </Button>,
                ]}
              >
                {pkg.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -1,
                      right: 24,
                      background: '#1890ff',
                      color: 'white',
                      padding: '4px 12px',
                      fontSize: '12px',
                      borderRadius: '0 0 8px 8px',
                    }}
                  >
                    最受欢迎
                  </div>
                )}
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                    {pkg.credits}
                  </div>
                  <div style={{ color: '#666', marginBottom: 8 }}>积分</div>
                  
                  {pkg.bonus > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <Badge.Ribbon text={`+${pkg.bonus}积分`} color="gold">
                        <div style={{ height: 20 }} />
                      </Badge.Ribbon>
                    </div>
                  )}
                  
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    ¥{pkg.price}
                  </div>
                  
                  {pkg.discount && (
                    <div style={{ color: '#f5222d', fontSize: '12px', marginTop: 4 }}>
                      {pkg.discount}
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 积分用途说明 */}
      <Card title="积分用途" style={{ marginBottom: 32 }}>
        <Row gutter={[24, 16]}>
          {creditUsage.map((item, index) => (
            <Col key={index} xs={24} md={12}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 60,
                    height: 40,
                    background: '#f0f0f0',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                    flexShrink: 0,
                  }}
                >
                  <Text strong style={{ color: '#1890ff' }}>
                    {typeof item.cost === 'number' ? `${item.cost}积分` : item.cost}
                  </Text>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {item.action}
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.description}
                  </Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 充值说明 */}
      <Card title="充值说明">
        <Row gutter={32}>
          <Col xs={24} md={12}>
            <Space direction="vertical">
              <Text strong>💳 支付方式</Text>
              <Text>• 支持支付宝、微信支付、银行卡支付</Text>
              <Text>• 支付完成后积分立即到账</Text>
              <Text>• 7×24小时客服支持</Text>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical">
              <Text strong>🎁 优惠政策</Text>
              <Text>• 首次充值享受额外10%积分奖励</Text>
              <Text>• 大额充值享受更多积分赠送</Text>
              <Text>• 积分永久有效，无过期时间</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 支付模态框 */}
      <Modal
        title="完成支付"
        open={paymentVisible}
        onCancel={() => setPaymentVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPaymentVisible(false)}>
            取消
          </Button>,
          <Button key="pay" type="primary" loading={loading} onClick={handlePayment}>
            确认支付 ¥{selectedPackage?.price}
          </Button>,
        ]}
      >
        {selectedPackage && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Text strong>订单详情</Text>
              <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>积分数量:</Text>
                  <Text>{selectedPackage.credits}积分</Text>
                </div>
                {selectedPackage.bonus > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>赠送积分:</Text>
                    <Text style={{ color: '#faad14' }}>+{selectedPackage.bonus}积分</Text>
                  </div>
                )}
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>总计:</Text>
                  <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                    ¥{selectedPackage.price}
                  </Text>
                </div>
              </div>
            </div>

            <div>
              <Text strong>选择支付方式</Text>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', marginTop: 12 }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value="alipay">
                    <Space>
                      <WalletOutlined style={{ color: '#1677ff' }} />
                      支付宝
                    </Space>
                  </Radio>
                  <Radio value="wechat">
                    <Space>
                      <WalletOutlined style={{ color: '#07c160' }} />
                      微信支付
                    </Space>
                  </Radio>
                  <Radio value="card">
                    <Space>
                      <CreditCardOutlined />
                      银行卡支付
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Credits
