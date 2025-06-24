import LayoutHoc from "@/HOC/LayoutHoc";
import { useRouter } from "next/router";
import { Card, Descriptions, Button, Tag, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useGetBookingByIdQuery } from "@/redux/slices/apiSlice";
import styles from "./styles.module.css";

const BookingDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: booking, isLoading, error } = useGetBookingByIdQuery(id, {
    skip: !id, // Skip the query if id is not available
  });

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag color="orange">Pending</Tag>;
      case "confirmed":
        return <Tag color="green">Confirmed</Tag>;
      case "cancelled":
        return <Tag color="red">Cancelled</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  if (isLoading) {
    return (
      <LayoutHoc>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      </LayoutHoc>
    );
  }

  if (error) {
    message.error("Failed to load booking details");
    return (
      <LayoutHoc>
        <div style={{ padding: "40px 20px", backgroundColor: "#fff" }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/bookings')}
            style={{ marginBottom: 20 }}
          >
            Back to Bookings
          </Button>
          <Card>
            <p>Error loading booking details. Please try again later.</p>
          </Card>
        </div>
      </LayoutHoc>
    );
  }

  if (!booking) {
    return (
      <LayoutHoc>
        <div style={{ padding: "40px 20px", backgroundColor: "#fff" }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/bookings')}
            style={{ marginBottom: 20 }}
          >
            Back to Bookings
          </Button>
          <Card>
            <p>Booking not found.</p>
          </Card>
        </div>
      </LayoutHoc>
    );
  }

  return (
    <LayoutHoc>
      <div style={{ padding: "40px 20px", backgroundColor: "#fff" }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/bookings')}
          style={{ marginBottom: 20 }}
        >
          Back to Bookings
        </Button>

        <Card title="Booking Details" className={styles.bookingDetailsCard}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Status" span={2}>
              {getStatusTag(booking?.status)}
            </Descriptions.Item>
            
            <Descriptions.Item label="Name">{booking?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{booking?.email}</Descriptions.Item>
            
            <Descriptions.Item label="Phone">{booking?.phone}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {booking?.dateOfBirth ? new Date(booking.dateOfBirth).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            
            <Descriptions.Item label="Gender">{booking?.gender}</Descriptions.Item>
            <Descriptions.Item label="Nationality">{booking?.nationality}</Descriptions.Item>
            
            <Descriptions.Item label="Address" span={2}>
              {booking?.address}
              {booking?.addressLine2 && <br />}
              {booking?.addressLine2}
            </Descriptions.Item>
            
            <Descriptions.Item label="Country">{booking?.country}</Descriptions.Item>
            <Descriptions.Item label="Property">
              <a
                href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/property/${booking?.propertyId?._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {booking?.propertyId?.title}
              </a>
            </Descriptions.Item>
            
            <Descriptions.Item label="Move-in Date">
              {booking?.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Move-out Date">
              {booking?.moveOutDate ? new Date(booking.moveOutDate).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            
            <Descriptions.Item label="Rental Days">{booking?.rentalDays}</Descriptions.Item>
            <Descriptions.Item label="Move-in Month">{booking?.moveInMonth}</Descriptions.Item>
            
            <Descriptions.Item label="Lease Duration">{booking?.leaseDuration}</Descriptions.Item>
            <Descriptions.Item label="Bedroom">{booking?.bedroomName || 'N/A'}</Descriptions.Item>

            <Descriptions.Item label="University Name">{booking?.universityName || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Course Name">{booking?.courseName || 'N/A'}</Descriptions.Item>
            
            <Descriptions.Item label="Medical Conditions">
              {booking?.hasMedicalConditions ? 'Yes' : 'No'}
            </Descriptions.Item>
            {booking?.hasMedicalConditions && (
              <Descriptions.Item label="Medical Details">
                {booking?.medicalDetails}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Price" span={2}>
              {(booking?.currency || 'INR').toUpperCase()} {booking?.price}
            </Descriptions.Item>
            
            <Descriptions.Item label="Security Deposit">
              {(booking?.currency || 'INR').toUpperCase()} {booking?.securityDeposit}
              {booking?.securityDepositPaid && <Tag color="green" style={{ marginLeft: 8 }}>Paid</Tag>}
            </Descriptions.Item>
            
            <Descriptions.Item label="Last Month Payment">
              {(booking?.currency || 'INR').toUpperCase()} {booking?.lastMonthPayment}
              {booking?.lastMonthPaymentPaid && <Tag color="green" style={{ marginLeft: 8 }}>Paid</Tag>}
            </Descriptions.Item>

            <Descriptions.Item label="Payment Status" span={2}>
              <Tag color={
                booking?.paymentStatus === 'completed' ? 'green' :
                booking?.paymentStatus === 'pending' ? 'orange' :
                booking?.paymentStatus === 'failed' ? 'red' :
                booking?.paymentStatus === 'refunded' ? 'blue' : 'default'
              }>
                {booking?.paymentStatus?.toUpperCase()}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Created At" span={2}>
              {booking?.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </LayoutHoc>
  );
};

export default BookingDetails; 