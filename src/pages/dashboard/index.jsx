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
  }, []);

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
        <Row className={styles.header}>
          <Col span={24}>
            <Title level={3} style={{ color: 'black', fontWeight: 700 }}>
              Welcome back, Malay!
            </Title>
            <Text type="secondary" style={{ fontSize: '16px', color: '#6c757d' }}>
              Let's explore your dashboard and manage properties efficiently.
            </Text>
            <div className={styles.datePickerWrapper}>
              <DateRangePickerComponent value={dateRange} onChange={handleDateRangeChange} />
            </div>
          </Col>
        </Row>

        {/* Stats */}
        <Spin spinning={loading}>
          <Row gutter={[24, 24]} className={styles.statsRow}>
            {stats.map((stat) => (
              <Col xs={24} sm={12} md={6} key={stat.id}>
                <Card className={styles.statsCard}>
                  <div className={styles.cardContent}>
                    <span className={styles.cardIcon}>
                    {stat.icon}
                    </span>
                    <div className={styles.cardDetails}>
                      <Title level={4} style={{ fontWeight: 700, marginBottom: 4 }}>
                        {stat.total}
                      </Title>
                      <Text style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {stat.title}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Content */}
          <Row gutter={[24, 24]} className={styles.contentRow}>
            {/* Graph Section */}
            <Col xs={24} lg={12}>
              <Card className={styles.chartCard}>
                <Title level={4} style={{ fontWeight: 700 }}>Revenue Summary</Title>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.2} />
                      <Line type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text type="secondary">No revenue data available</Text>
                  </div>
                )}
              </Card>
            </Col>

            {/* Messages */}
            <Col xs={24} lg={12}>
              <Card className={styles.messagesCard}>
                <Title level={4} style={{ fontWeight: 700 }}>New Messages</Title>
                {recentMessages.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={recentMessages}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<>{item.name} <Text type="secondary">({item.propertyId})</Text></>}
                          description={item.message}
                        />
                        <Text>{item.time}</Text>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <Text type="secondary">No recent messages</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Transactions */}
          <Row gutter={[24, 24]} className={styles.contentRow}>
            <Col span={24}>
              <Card className={styles.transactionsCard}>
                <Title level={4} style={{ fontWeight: 700 }}>Transactions</Title>
                <Table
                  dataSource={transactions}
                  columns={transactionColumns}
                  pagination={false}
                  locale={{ emptyText: 'No recent transactions' }}
                />
                <Button type="primary" block className={styles.viewMoreBtn}>
                  View All
                </Button>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    </LayoutHoc>
  );
}
