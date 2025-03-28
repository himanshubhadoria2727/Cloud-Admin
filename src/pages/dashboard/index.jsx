import LayoutHoc from '@/HOC/LayoutHoc';
import { Col, Row, Card, Typography, List, Table, Badge, Button, Spin, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import {
  HeartOutlined,
  EyeOutlined,
  FileTextOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import DateRangePickerComponent from "@/components/TextFields/datepicker";
import styles from './dashboard.module.css';
import { useState, useEffect } from 'react';
import { 
  useLazyGetDashboardStatsQuery, 
  useLazyGetRevenueDataQuery, 
  useGetRecentMessagesQuery, 
  useGetRecentTransactionsQuery 
} from '@/redux/slices/apiSlice';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  // RTK Query hooks
  const [getDashboardStats, { isLoading: isStatsLoading }] = useLazyGetDashboardStatsQuery();
  const [getRevenueData, { isLoading: isRevenueLoading }] = useLazyGetRevenueDataQuery();
  const { data: recentMessages = [], isLoading: isMessagesLoading } = useGetRecentMessagesQuery();
  const { data: transactions = [], isLoading: isTransactionsLoading } = useGetRecentTransactionsQuery();
  
  const [revenueData, setRevenueData] = useState({ labels: [], data: [] });

  // Fetch dashboard data
  const fetchDashboardData = async (startDate, endDate) => {
    try {
      // Prepare date query params if dates are selected
      const dateParams = {};
      if (startDate) dateParams.startDate = startDate.toISOString();
      if (endDate) dateParams.endDate = endDate.toISOString();
      
      // Fetch dashboard stats
      const statsResponse = await getDashboardStats(dateParams).unwrap();
      
      // Format stats data
      const statsData = [
        { id: 1, total: statsResponse.totalProperties, title: 'All Properties', icon: <HomeOutlined /> },
        { id: 2, total: statsResponse.totalViews, title: 'Total Views', icon: <EyeOutlined /> },
        { id: 3, total: statsResponse.totalReviews, title: 'Visitor Reviews', icon: <FileTextOutlined /> },
        { id: 4, total: statsResponse.totalFavorites, title: 'Favorites', icon: <HeartOutlined /> },
      ];
      setStats(statsData);
      
      // Fetch revenue data for chart
      const revenueResponse = await getRevenueData(dateParams).unwrap();
      setRevenueData(revenueResponse);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    }
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      fetchDashboardData(dates[0], dates[1]);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Determine if any data is loading
  useEffect(() => {
    setLoading(isStatsLoading || isRevenueLoading || isMessagesLoading || isTransactionsLoading);
  }, [isStatsLoading, isRevenueLoading, isMessagesLoading, isTransactionsLoading]);

  // Format data for recharts
  const chartData = revenueData.labels.map((month, index) => ({
    month,
    revenue: revenueData.data[index]
  }));

  const transactionColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'completed' ? 'success' : 'processing'}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    { title: 'Payment', dataIndex: 'payment', key: 'payment' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Property', dataIndex: 'property', key: 'property' },
  ];

  return (
    <LayoutHoc>
      <div className={styles.dashboardContainer}>
        {/* Header */}
        <Row className={styles.header} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Title level={3} style={{ color: '#2D3748', fontWeight: 800, marginBottom: 8 }}>
              Welcome back, Malay! 👋
            </Title>
            <Text style={{ fontSize: '16px', color: '#4A5568', display: 'block' }}>
              Here&apos;s what&apos;s happening with your properties today.
            </Text>
          </Col>
          {/* <Col xs={24} md={8}>
            <div className={styles.datePickerWrapper}>
              <DateRangePickerComponent value={dateRange} onChange={handleDateRangeChange} />
            </div>
          </Col> */}
        </Row>

        {/* Stats */}
        <Spin spinning={loading} size="large">
          <Row gutter={[24, 24]} className={styles.statsRow}>
            {stats.map((stat) => (
              <Col xs={24} sm={12} md={6} key={stat.id}>
                <Link href={stat.id === 1 ? "/manage-properties" : "#"}>
                  <Card className={styles.statsCard} bordered={false}>
                    <div className={styles.cardContent}>
                      <span className={styles.cardIcon}>
                        {stat.icon}
                      </span>
                      <div className={styles.cardDetails}>
                        <Title level={4}>
                          {stat.total}
                        </Title>
                        <Text>{stat.title}</Text>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Content */}
          <Row gutter={[24, 24]} className={styles.contentRow}>
            {/* Graph Section */}
            <Col xs={24} lg={14}>
              <Card className={styles.chartCard} bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Title level={4} style={{ margin: 0, color: '#2D3748', fontWeight: 700 }}>Revenue Summary</Title>
                  <Badge 
                    count={`${revenueData.data.length} months`} 
                    style={{ backgroundColor: '#3861fb', fontWeight: 500 }} 
                  />
                </div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#718096"
                        tick={{ fill: '#718096' }}
                      />
                      <YAxis 
                        stroke="#718096"
                        tick={{ fill: '#718096' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3861fb" 
                        fill="#3861fb" 
                        fillOpacity={0.1} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3861fb" 
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#3861fb', strokeWidth: 3 }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text type="secondary">No revenue data available</Text>
                  </div>
                )}
              </Card>
            </Col>

            {/* Messages */}
            <Col xs={24} lg={10}>
              <Card className={styles.messagesCard} bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Title level={4} style={{ margin: 0, color: '#2D3748', fontWeight: 700 }}>New Messages</Title>
                  <Badge 
                    count={recentMessages.length} 
                    style={{ backgroundColor: '#3861fb', fontWeight: 500 }} 
                  />
                </div>
                {recentMessages.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={recentMessages}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <div style={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%', 
                              background: '#3861fb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: 600
                            }}>
                              {item.name[0].toUpperCase()}
                            </div>
                          }
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text strong>{item.name}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                            </div>
                          }
                          description={
                            <Text style={{ color: '#4A5568' }}>{item.message}</Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ padding: '40px 0', textAlign: 'center' }}>
                    <Text type="secondary">No recent messages</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Transactions */}
          <Row gutter={[24, 24]} className={styles.contentRow}>
            <Col span={24}>
              <Card className={styles.transactionsCard} bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Title level={4} style={{ margin: 0, color: '#2D3748', fontWeight: 700 }}>Recent Transactions</Title>
                  <Badge 
                    count={`${transactions.length} total`} 
                    style={{ backgroundColor: '#3861fb', fontWeight: 500 }} 
                  />
                </div>
                <Table
                  dataSource={transactions}
                  columns={transactionColumns}
                  pagination={false}
                  locale={{ emptyText: 'No recent transactions' }}
                />
                <Button type="primary" block className={styles.viewMoreBtn}>
                  View All Transactions
                </Button>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    </LayoutHoc>
  );
}
