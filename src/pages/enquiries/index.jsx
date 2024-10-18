import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Col } from "antd";
import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";

// Dummy enquiry data
const dummyEnquiries = [
  {
    key: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    message: "I would like to know more about your services.",
  },
  {
    key: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    message: "What are your working hours?",
  },
  {
    key: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    message: "Do you offer discounts for bulk orders?",
  },
];

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
  },
];

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setEnquiries(dummyEnquiries);
  }, []);

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Enquiries</h3>
      </Col>
      <Col className="tableBox">
        <DataTable rowData={enquiries} colData={columns} />
      </Col>
    </LayoutHoc>
  );
};

export default ManageEnquiries;
