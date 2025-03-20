import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Col, message, Popconfirm } from "antd";
import styles from "./styles.module.css";
import React from "react";
import { useGetEnquiriesQuery, useDeleteEnquiryMutation } from "@/redux/slices/apiSlice";

const ManageEnquiries = () => {
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
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: '40%',
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
        <Popconfirm
          title="Are you sure you want to delete this enquiry?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <a href="#">Delete</a>
        </Popconfirm>
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
