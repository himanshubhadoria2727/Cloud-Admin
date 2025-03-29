import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Rate, 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Input, 
  Select, 
  Row, 
  Col,
  Badge,
  Avatar,
  Tag,
  Modal,
  Form
} from 'antd';
import { 
  DeleteOutlined, 
  SearchOutlined, 
  FilterOutlined,
  EyeOutlined,
  StarOutlined,
  EditOutlined 
} from '@ant-design/icons';
import LayoutHoc from '@/HOC/LayoutHoc';
import { useGetAllReviewsQuery, useDeleteReviewMutation, useUpdateReviewMutation, useGetPropertiesQuery } from '@/redux/slices/apiSlice';
import styles from './reviews.module.css';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ReviewsPage = () => {
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // State for editing modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [form] = Form.useForm();

  // Fetch reviews data with RTK Query
  const { 
    data: reviewsData, 
    isLoading: isReviewsLoading, 
    refetch: refetchReviews
  } = useGetAllReviewsQuery({
    page,
    limit: pageSize,
    sortBy,
    order: sortOrder,
    propertyId: propertyFilter || undefined,
    rating: ratingFilter !== null ? ratingFilter : undefined,
  });

  // Fetch properties for filter dropdown
  const { 
    data: propertiesData, 
    isLoading: isPropertiesLoading 
  } = useGetPropertiesQuery({});

  // Delete review mutation
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  
  // Update review mutation
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      message.success('Review deleted successfully');
      refetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      message.error('Failed to delete review');
    }
  };
  
  // Handle editing a review
  const handleEditReview = (review) => {
    setCurrentReview(review);
    form.setFieldsValue({
      rating: review.rating,
      comment: review.comment
    });
    setIsEditModalVisible(true);
  };
  
  // Handle saving edited review
  const handleSaveReview = async () => {
    try {
      const values = await form.validateFields();
      await updateReview({
        reviewId: currentReview.id,
        ...values
      }).unwrap();
      message.success('Review updated successfully');
      setIsEditModalVisible(false);
      refetchReviews();
    } catch (error) {
      console.error('Failed to update review:', error);
      message.error('Failed to update review');
    }
  };

  // Handle property filter change
  const handlePropertyFilterChange = (value) => {
    setPropertyFilter(value);
    setPage(1);
  };

  // Handle rating filter change
  const handleRatingFilterChange = (value) => {
    // Ensure value is a valid number or null
    const ratingValue = value !== undefined && value !== null ? parseInt(value) : null;
    setRatingFilter(ratingValue);
    setPage(1);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setPropertyFilter(null);
    setRatingFilter(null);
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  // Filtered reviews based on search query
  const filteredReviews = reviewsData?.reviews?.filter(review => 
    review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Table columns
  const columns = [
    {
      title: 'Property',
      dataIndex: 'propertyTitle',
      key: 'propertyTitle',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            {record.propertyImage ? (
              <Avatar 
                src={record.propertyImage} 
                shape="square" 
                size={40} 
                alt={text} 
              />
            ) : (
              <Avatar 
                shape="square" 
                size={40} 
                style={{ backgroundColor: '#3861fb' }}
              >
                {text.charAt(0)}
              </Avatar>
            )}
            <Link href={`/manage-properties/edit/${record.propertyId}`}>
              <Text strong>{text}</Text>
            </Link>
          </Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.propertyLocation}</Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.userEmail}</Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: true,
      width: 170,
    },
    {
      title: 'Review',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (text) => (
        <div className={styles.reviewText}>
          {text}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      sorter: true,
      width: 130,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Link href={`/reviews/${record.id}`}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              title="View details"
            />
          </Link>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditReview(record)}
          />
          <Popconfirm
            title="Delete this review?"
            description="Are you sure you want to delete this review? This action cannot be undone."
            onConfirm={() => handleDeleteReview(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: isDeleting }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
      width: 140,
    },
  ];

  // Handle table change (pagination, sorting)
  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
    
    if (sorter.order) {
      setSortOrder(sorter.order === 'descend' ? 'desc' : 'asc');
      setSortBy(sorter.field);
    } else {
      setSortOrder('desc');
      setSortBy('createdAt');
    }
  };

  return (
    <LayoutHoc>
      <div className={styles.reviewsContainer}>
        <Card className={styles.reviewsCard}>
          <div className={styles.header}>
            <Title level={3} className={styles.title}>
              <StarOutlined /> Reviews Management
            </Title>
            <Badge 
              count={reviewsData?.pagination?.total || 0} 
              style={{ backgroundColor: '#3861fb' }} 
              overflowCount={9999}
            />
          </div>

          {/* Filters section */}
          <div className={styles.filtersSection}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={24} md={8} lg={6}>
                <Input
                  placeholder="Search by keyword"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  prefix={<SearchOutlined />}
                  className={styles.searchInput}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Filter by property"
                  value={propertyFilter}
                  onChange={handlePropertyFilterChange}
                  loading={isPropertiesLoading}
                  allowClear
                  className={styles.selectFilter}
                >
                  {propertiesData?.map(property => (
                    <Option key={property._id} value={property._id}>
                      {property.title}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="Filter by rating"
                  value={ratingFilter}
                  onChange={handleRatingFilterChange}
                  allowClear
                  className={styles.selectFilter}
                >
                  <Option value={5}>5 Stars</Option>
                  <Option value={4}>4 Stars</Option>
                  <Option value={3}>3 Stars</Option>
                  <Option value={2}>2 Stars</Option>
                  <Option value={1}>1 Star</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} className={styles.filterActions}>
                <Button 
                  onClick={handleClearFilters}
                  icon={<FilterOutlined />}
                >
                  Clear Filters
                </Button>
              </Col>
            </Row>
          </div>

          {/* Reviews table */}
          <Table
            dataSource={filteredReviews}
            columns={columns}
            rowKey="id"
            loading={isReviewsLoading}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: reviewsData?.pagination?.total || 0,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} reviews`,
            }}
            onChange={handleTableChange}
            className={styles.reviewsTable}
          />
        </Card>
        
        {/* Edit Review Modal */}
        <Modal
          title="Edit Review"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              loading={isUpdating} 
              onClick={handleSaveReview}
            >
              Save Changes
            </Button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
            name="edit_review_form"
          >
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please rate the property' }]}
            >
              <Rate allowHalf />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Review Comment"
              rules={[{ required: true, message: 'Please enter a comment' }]}
            >
              <TextArea rows={4} placeholder="Enter your review" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </LayoutHoc>
  );
};

export default ReviewsPage; 