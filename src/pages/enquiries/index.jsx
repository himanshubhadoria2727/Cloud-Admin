import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Col, message, Popconfirm, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import React from "react";
import { useGetEnquiriesQuery, useDeleteEnquiryMutation } from "@/redux/slices/apiSlice";
import { useRouter } from "next/router";

const ManageEnquiries = () => {
  const router = useRouter();
  const { data: response, isLoading, error } = useGetEnquiriesQuery();
  const [deleteEnquiry] = useDeleteEnquiryMutation();

  const handleDelete = async (id) => {
    try {
      await deleteEnquiry(id).unwrap();
      message.success('Enquiry deleted successfully');
    } catch (err) {
      message.error('Failed to delete enquiry');
    }
  };

  const handleViewDetails = (id) => {
    router.push(`/enquiries/${id}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record._id)}
          />
          <Popconfirm
            title="Are you sure you want to delete this enquiry?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (error) {
    return <div>Error loading enquiries</div>;
  }

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Enquiries</h3>
      </Col>
      <Col className="tableBox">
        <DataTable 
          rowData={response?.enquiries || []} 
          colData={columns} 
          loading={isLoading}
        />
      </Col>
    </LayoutHoc>
  );
};

export default ManageEnquiries;
