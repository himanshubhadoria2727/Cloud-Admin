import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Card, 
  Typography, 
  Rate, 
  Button, 
  Space, 
  Spin, 
  message, 
  Input, 
  Form,
  Breadcrumb,
  Avatar,
  Descriptions,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  UserOutlined,
  StarOutlined,
  HomeOutlined,
  CommentOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import LayoutHoc from '@/HOC/LayoutHoc';
import Link from 'next/link';
import { useGetAllReviewsQuery, useUpdateReviewMutation } from '@/redux/slices/apiSlice';
import styles from './reviews.module.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReviewDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [review, setReview] = useState(null);

  // Get all reviews (we'll filter for this specific review)
  const { data: reviewsData, isLoading: isReviewsLoading } = useGetAllReviewsQuery({});
  
  // Update review mutation
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  // Find the specific review from the data
  useEffect(() => {
    if (reviewsData && id) {
      const foundReview = reviewsData.reviews.find(r => r.id === id);
      if (foundReview) {
        setReview(foundReview);
        form.setFieldsValue({
          rating: foundReview.rating,
          comment: foundReview.comment
        });
      } else {
        message.error('Review not found');
        router.push('/reviews');
      }
    }
  }, [reviewsData, id, form, router]);

  // Handle saving the edited review
  const handleSaveReview = async () => {
    try {
      const values = await form.validateFields();
      await updateReview({
        reviewId: id,
        ...values
      }).unwrap();
      
      message.success('Review updated successfully');
      setIsEditing(false);
      
      // Update local state with new values
      if (review) {
        setReview({
          ...review,
          rating: values.rating,
          comment: values.comment
        });
      }
    } catch (error) {
      console.error('Failed to update review:', error);
      message.error('Failed to update review');
    }
  };

  if (isReviewsLoading || !review) {
    return (
      <LayoutHoc>
        <div className={styles.reviewDetailContainer}>
          <Spin size="large" />
        </div>
      </LayoutHoc>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <LayoutHoc>
      <div className={styles.reviewDetailContainer}>
        <Breadcrumb 
          items={[
            { title: <Link href="/dashboard"><HomeOutlined /> Dashboard</Link> },
            { title: <Link href="/reviews"><StarOutlined /> Reviews</Link> },
            { title: 'Review Details' }
          ]}
          className={styles.breadcrumb}
        />

        <Card className={styles.reviewDetailCard}>
          <div className={styles.header}>
            <Space size={16}>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => router.push('/reviews')}
              >
                Back to Reviews
              </Button>
              <Title level={3} className={styles.title}>Review Details</Title>
            </Space>
            
            <Space>
              {isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    onClick={handleSaveReview}
                    loading={isUpdating}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button 
                  type="primary" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Review
                </Button>
              )}
            </Space>
          </div>
          
          <Divider />
          
          <div className={styles.reviewContent}>
            <div className={styles.reviewInfo}>
              <Descriptions 
                title="Review Information" 
                bordered 
                column={{ xs: 1, sm: 1, md: 1, lg: 2 }}
              >
                <Descriptions.Item label="Property">
                  <Space>
                    {review.propertyImage ? (
                      <Avatar 
                        src={review.propertyImage} 
                        shape="square" 
                        size={40} 
                      />
                    ) : (
                      <Avatar 
                        shape="square" 
                        size={40} 
                        style={{ backgroundColor: '#3861fb' }}
                      >
                        {review.propertyTitle.charAt(0)}
                      </Avatar>
                    )}
                    <Link href={`/manage-properties/edit/${review.propertyId}`}>
                      <Text strong>{review.propertyTitle}</Text>
                    </Link>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {review.propertyLocation}
                </Descriptions.Item>
                <Descriptions.Item label="User">
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Text>{review.userName}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {review.userEmail}
                </Descriptions.Item>
                <Descriptions.Item label="Date">
                  <CalendarOutlined /> {formatDate(review.createdAt)}
                </Descriptions.Item>
              </Descriptions>
            </div>
            
            <Divider />
            
            <div className={styles.reviewDetails}>
              {isEditing ? (
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
                    <TextArea rows={6} placeholder="Enter review comment" />
                  </Form.Item>
                </Form>
              ) : (
                <>
                  <Title level={4}>
                    <StarOutlined /> Rating
                  </Title>
                  <div className={styles.ratingDisplay}>
                    <Rate disabled value={review.rating} />
                    <Text strong>{review.rating}/5</Text>
                  </div>
                  
                  <Title level={4}>
                    <CommentOutlined /> Review Comment
                  </Title>
                  <Paragraph className={styles.reviewComment}>
                    {review.comment}
                  </Paragraph>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </LayoutHoc>
  );
};

export default ReviewDetail; 