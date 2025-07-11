import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Button, Col, Modal, Select, Space, Tag, message, Spin, Popconfirm, Pagination, Input } from "antd";
import { EyeOutlined, ExclamationCircleOutlined, DeleteOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} from "@/redux/slices/apiSlice";

const { confirm } = Modal;
const { Option } = Select;

const ManageBookings = () => {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  // Fetch bookings with pagination and search
  const { data, isLoading, refetch } = useGetBookingsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    searchField: searchField,
  });

  const [updateBookingStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

  const paginationInfo = data?.pagination || {
    page: 1,
    limit: 5,
    totalPages: 1,
    totalCount: 0,
  };

  // Get total count directly from backend response
  const totalCount = paginationInfo.totalCount;

  const bookings = data?.bookings?.map((booking) => ({
    key: booking._id,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    property: booking.propertyId ? booking.propertyId.title : "N/A",
    moveInMonth: booking.moveInMonth,
    rentalDays: booking.rentalDays,
    price: booking.price,
    securityDeposit: booking.securityDeposit,
    lastMonthPayment: booking.lastMonthPayment,
    total: booking.price + booking.securityDeposit + booking.lastMonthPayment,
    status: booking.status,
    createdAt: booking.createdAt,
  })) || [];

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const handleStatusChange = async ({ key, status }) => {
    try {
      await updateBookingStatus({ id: key, status }).unwrap();
      message.success("Booking status updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error(error?.data?.message || "Failed to update booking status");
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
          refetch();
        } catch (error) {
          console.error("Error deleting booking:", error);
          message.error("Failed to delete booking");
        }
      },
    });
  };

  const handleViewDetails = (bookingId) => {
    router.push(`/bookings/${bookingId}`);
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", text: "Pending" },
      confirmed: { color: "green", text: "Confirmed" },
      cancelled: { color: "red", text: "Cancelled" },
      completed: { color: "blue", text: "Completed" },
    };
    const info = statusMap[status] || { color: "default", text: status };
    return <Tag color={info.color}>{info.text}</Tag>;
  };

  const getStatusOptions = () => [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ];

  const handlePaginationChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchFieldChange = (field) => {
    setSearchField(field);
    setCurrentPage(1); // Reset to first page when changing search field
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchField("all");
    setCurrentPage(1);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Property", dataIndex: "property", key: "property" },
    { title: "Move-in Month", dataIndex: "moveInMonth", key: "moveInMonth" },
    { title: "Rental Days", dataIndex: "rentalDays", key: "rentalDays" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (val) => `$${val?.toLocaleString()}`,
    },
    {
      title: "Security Deposit",
      dataIndex: "securityDeposit",
      key: "securityDeposit",
      render: (val) => `$${val?.toLocaleString()}`,
    },
    {
      title: "Last Month",
      dataIndex: "lastMonthPayment",
      key: "lastMonthPayment",
      render: (val) => `$${val?.toLocaleString()}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (val) => `$${val?.toLocaleString()}`,
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
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record.key)} />
          <Select
            size="small"
            value={record.status}
            onChange={(val) => handleStatusChange({ key: record.key, status: val })}
            loading={isUpdating && selectedBooking?.key === record.key}
          >
            {getStatusOptions().map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => showDeleteConfirm(record.key)}
          >
            <Button icon={<DeleteOutlined />} danger loading={isDeleting} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Bookings ({paginationInfo.totalCount})</h3>
      </Col>
      <Col className="tableBox">
        {/* Search Controls */}
        <div style={{ 
          marginBottom: 20, 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '0 16px'
        }}>
          <Select
            value={searchField}
            onChange={handleSearchFieldChange}
            style={{ width: 150 }}
            placeholder="Search in..."
          >
            <Option value="all">All Fields</Option>
            <Option value="name">Name</Option>
            <Option value="email">Email</Option>
            <Option value="phone">Phone</Option>
            <Option value="property">Property</Option>
            <Option value="status">Status</Option>
          </Select>
          
          <Input.Search
            placeholder={`Search ${searchField === 'all' ? 'all fields' : searchField}...`}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
            enterButton={<SearchOutlined />}
          />
          
          {searchTerm && (
            <Button 
              icon={<ClearOutlined />} 
              onClick={clearSearch}
              type="default"
            >
              Clear Search
            </Button>
          )}
        </div>
        
        {/* Search Results Info */}
        {searchTerm && (
          <div style={{ marginBottom: 16, color: "#666", fontStyle: 'italic' }}>
            {paginationInfo.totalCount > 0 
              ? `Found ${paginationInfo.totalCount} booking(s) matching "${searchTerm}" in ${searchField === 'all' ? 'all fields' : searchField}`
              : `No bookings found matching "${searchTerm}" in ${searchField === 'all' ? 'all fields' : searchField}`
            }
          </div>
        )}
        
        {/* Summary Info */}
        <div style={{ marginBottom: 16, color: "#666" }}>
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} bookings
        </div>

        <DataTable
          rowData={bookings}
          colData={columns}
          loading={isLoading}
          pagination={false} // Disable built-in pagination
          scroll={{ x: 1200 }}
        />

        {/* Custom Pagination Component */}
        <div style={{ 
          marginTop: 20, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ color: '#666' }}>
            Total {totalCount} bookings
          </div>
          
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalCount}
            showSizeChanger={true}
            pageSizeOptions={['5', '10', '20', '50']}
            showQuickJumper={true}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
            }
            size="default"
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '8px' 
            }}
          />
        </div>
      </Col>
    </LayoutHoc>
  );
};

export default ManageBookings;