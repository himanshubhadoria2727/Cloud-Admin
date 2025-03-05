import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Button, Col, Modal, Select, Space, Tag, message } from "antd";
import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { 
  useGetBookingsQuery, 
  useUpdateBookingStatusMutation, 
  useDeleteBookingMutation 
} from "@/redux/slices/apiSlice";

const { confirm } = Modal;
const { Option } = Select;

const ManageBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  // Using Redux hooks for data fetching and mutations
  const { data, isLoading, refetch } = useGetBookingsQuery();
  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  // Transform the data for the table
  const bookings = data?.bookings?.map((booking) => ({
    key: booking._id,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    property: booking.propertyId ? booking.propertyId.title : 'N/A',
    moveInMonth: booking.moveInMonth,
    rentalDays: booking.rentalDays,
    price: booking.price,
    status: booking.status,
    createdAt: new Date(booking.createdAt).toLocaleDateString(),
  })) || [];

  const showStatusModal = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setIsStatusModalVisible(true);
  };

  const handleStatusChange = async () => {
    try {
      await updateBookingStatus({
        id: selectedBooking.key,
        status: newStatus
      }).unwrap();
      
      message.success("Booking status updated successfully");
      setIsStatusModalVisible(false);
      refetch(); // Refetch the bookings data
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Failed to update booking status");
    }
  };

  const showDeleteConfirm = (bookingId) => {
    confirm({
      title: "Are you sure you want to delete this booking?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteBooking(bookingId).unwrap();
          message.success("Booking deleted successfully");
          refetch(); // Refetch the bookings data
        } catch (error) {
          console.error("Error deleting booking:", error);
          message.error("Failed to delete booking");
        }
      },
    });
  };

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
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Move-in Month",
      dataIndex: "moveInMonth",
      key: "moveInMonth",
    },
    {
      title: "Rental Days",
      dataIndex: "rentalDays",
      key: "rentalDays",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={() => showStatusModal(record)}
            loading={isUpdating && selectedBooking?.key === record.key}
          >
            Update Status
          </Button>
          <Button 
            type="danger" 
            onClick={() => showDeleteConfirm(record.key)}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <LayoutHoc>
     <Col style={{ padding: "40px 20px", backgroundColor: "#fff" }}> 
      <Col className={`${styles.title}`}>
        <h3>Bookings</h3>
      </Col>
      <Col className="tableBox">
        <DataTable 
          rowData={bookings} 
          colData={columns} 
          loading={isLoading}
        />
      </Col>

      {/* Status Update Modal */}
      <Modal
        title="Update Booking Status"
        visible={isStatusModalVisible}
        onOk={handleStatusChange}
        onCancel={() => setIsStatusModalVisible(false)}
        confirmLoading={isUpdating}
      >
        <Select
          style={{ width: "100%" }}
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          disabled={isUpdating}
        >
          <Option value="pending">Pending</Option>
          <Option value="confirmed">Confirmed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </Modal>
    </Col>
    </LayoutHoc>
  );
};

export default ManageBookings; 