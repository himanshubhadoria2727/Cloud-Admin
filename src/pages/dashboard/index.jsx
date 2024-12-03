import LayoutHoc from '@/HOC/LayoutHoc';
import { Col, Row, Card, Typography, List, Table, Badge, Button } from 'antd';
// import { Line } from 'react-chartjs-2';
import {
  HeartOutlined,
  EyeOutlined,
  FileTextOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import DateRangePickerComponent from "@/components/TextFields/datepicker";
import styles from './dashboard.module.css';

const { Title, Text } = Typography;

export default function Dashboard() {
  const stats = [
    { id: 1, total: 583, title: 'All Properties', icon: <HomeOutlined /> },
    { id: 2, total: 192, title: 'Total Views', icon: <EyeOutlined /> },
    { id: 3, total: 438, title: 'Visitor Reviews', icon: <FileTextOutlined /> },
    { id: 4, total: 67, title: 'Favorites', icon: <HeartOutlined /> },
  ];

  const recentMessages = [
    { name: 'Marvin McKinney', propertyId: 'Milla-102', message: 'Hello, my kitchen tap is not working...', time: '12:00' },
    { name: 'Jacob Jones', propertyId: 'Jieks-203', message: 'Need to repair the washroom...', time: '11:20' },
    { name: 'Guy Hawkins', propertyId: 'Nelse-403', message: 'Emergency change to electronic lock...', time: '11:00' },
  ];

  const transactions = [
    { key: 1, id: 'Nelson Mend', status: 'Pending', payment: '7563-4546-****', date: '13 Jun, 2024', amount: '$1280', property: 'Milla-102' },
    { key: 2, id: 'Himaad Riaz', status: 'Completed', payment: '7563-4546-****', date: '13 Jun, 2024', amount: '$1280', property: 'Nelse-403' },
  ];

  const transactionColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'Completed' ? 'success' : 'processing'}
          text={status}
        />
      ),
    },
    { title: 'Payment', dataIndex: 'payment', key: 'payment' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Property', dataIndex: 'property', key: 'property' },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [10000, 20000, 75000, 40000, 50000, 60000],
        borderColor: '#6c63ff',
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <LayoutHoc>
  <div className={styles.dashboardContainer}>
    {/* Header */}
    <Row className={styles.header}>
      <Col span={24}>
        <Title level={3} style={{ color: '#1f3a93', fontWeight: 700 }}>
          Welcome back, Malay!
        </Title>
        <Text type="secondary" style={{ fontSize: '16px', color: '#6c757d' }}>
          Let’s explore your dashboard and manage properties efficiently.
        </Text>
        <div className={styles.datePickerWrapper}>
          <DateRangePickerComponent />
        </div>
      </Col>
    </Row>

    {/* Stats */}
    <Row gutter={[16, 16]} className={styles.statsRow}>
      {stats.map((stat) => (
        <Col xs={24} sm={12} md={6} key={stat.id}>
          <Card className={styles.statsCard}>
            <div className={styles.cardIcon}>{stat.icon}</div>
            <Title level={4} style={{ fontWeight: 700,color: 'white' }}>{stat.total}</Title>
            <Text style={{ fontSize: '16px',color: 'white' }}>{stat.title}</Text>
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
          {/* <Line data={chartData} /> */}
        </Card>
      </Col>

      {/* Messages */}
      <Col xs={24} lg={12}>
        <Card className={styles.messagesCard}>
          <Title level={4} style={{ fontWeight: 700 }}>New Messages</Title>
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
          />
          <Button type="primary" block className={styles.viewMoreBtn}>
            View All
          </Button>
        </Card>
      </Col>
    </Row>
  </div>
</LayoutHoc>

  );
}
