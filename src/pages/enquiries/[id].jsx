import LayoutHoc from "@/HOC/LayoutHoc";
import { useRouter } from "next/router";
import { useGetEnquiriesQuery } from "@/redux/slices/apiSlice";
import { Card, Descriptions, Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

const EnquiryDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: response, isLoading, error } = useGetEnquiriesQuery();

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
    message.error('Failed to load enquiry details');
    return null;
  }

  const enquiry = response?.enquiries?.find(e => e._id === id);

  if (!enquiry) {
    message.error('Enquiry not found');
    return null;
  }

  return (
    <LayoutHoc>
      <div className={styles.container}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: '20px' }}
        >
          Back to Enquiries
        </Button>

        <Card title="Enquiry Details" className={styles.card}>
          <Descriptions bordered column={2} className={styles.descriptions}>
            <Descriptions.Item label="Name" span={2}>{enquiry.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{enquiry.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{enquiry.phone}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{new Date(enquiry.dateOfBirth).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Gender">{enquiry.gender}</Descriptions.Item>
            <Descriptions.Item label="Nationality">{enquiry.nationality}</Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>{enquiry.address}</Descriptions.Item>
            {enquiry.addressLine2 && (
              <Descriptions.Item label="Address Line 2" span={2}>{enquiry.addressLine2}</Descriptions.Item>
            )}
            <Descriptions.Item label="Country">{enquiry.country}</Descriptions.Item>
            <Descriptions.Item label="State/Province">{enquiry.stateProvince}</Descriptions.Item>
            
            <Descriptions.Item label="Lease Duration">{enquiry.leaseDuration}</Descriptions.Item>
            <Descriptions.Item label="Move In Date">{new Date(enquiry.moveInDate).toLocaleDateString()}</Descriptions.Item>
            {enquiry.moveOutDate && (
              <Descriptions.Item label="Move Out Date">{new Date(enquiry.moveOutDate).toLocaleDateString()}</Descriptions.Item>
            )}
            
            <Descriptions.Item label="University Name" span={2}>{enquiry.universityName}</Descriptions.Item>
            <Descriptions.Item label="Course Name">{enquiry.courseName}</Descriptions.Item>
            <Descriptions.Item label="Enrollment Status">{enquiry.enrollmentStatus}</Descriptions.Item>
            <Descriptions.Item label="University Address" span={2}>{enquiry.universityAddress}</Descriptions.Item>
            
            <Descriptions.Item label="Medical Conditions">{enquiry.hasMedicalConditions ? 'Yes' : 'No'}</Descriptions.Item>
            {enquiry.medicalDetails && (
              <Descriptions.Item label="Medical Details" span={2}>{enquiry.medicalDetails}</Descriptions.Item>
            )}
            
            <Descriptions.Item label="Property ID">{enquiry.propertyId}</Descriptions.Item>
            {enquiry.bedroomId && (
              <Descriptions.Item label="Bedroom ID">{enquiry.bedroomId}</Descriptions.Item>
            )}
            {enquiry.bedroomName && (
              <Descriptions.Item label="Bedroom Name">{enquiry.bedroomName}</Descriptions.Item>
            )}
            {enquiry.price && (
              <Descriptions.Item label="Price">{enquiry.price} {enquiry.currency}</Descriptions.Item>
            )}
            
            <Descriptions.Item label="Status" span={2}>
              <span style={{ 
                color: enquiry.status === 'approved' ? 'green' : 
                       enquiry.status === 'rejected' ? 'red' : 'orange'
              }}>
                {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item label="Created At" span={2}>
              {new Date(enquiry.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </LayoutHoc>
  );
};

export default EnquiryDetails; 