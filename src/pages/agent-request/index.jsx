import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Col, message, Popconfirm, Button, Tag, Spin, Select, Pagination, Input } from "antd";
import { EyeOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";
import React, { useState } from "react";
import { 
  useGetAllAgentRequestsQuery, 
  useDeleteAgentRequestMutation,
  useUpdateAgentRequestStatusMutation
} from "@/redux/slices/apiSlice";
import { useRouter } from "next/router";

const AgentRequests = () => {
  const router = useRouter();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  
  const { data: response, isLoading, error, refetch } = useGetAllAgentRequestsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    searchField: searchField,
  });
  
  const [deleteAgentRequest, { isLoading: isDeleting }] = useDeleteAgentRequestMutation();
  const [updateAgentRequestStatus, { isLoading: isUpdating }] = useUpdateAgentRequestStatusMutation();

  const paginationInfo = React.useMemo(() => {
    return response?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalRequests: 0,
      limit: 10,
    };
  }, [response]);

  // Get total count directly from backend response
  const totalCount = paginationInfo.totalRequests;

  const handleDelete = async (id) => {
    try {
      await deleteAgentRequest(id).unwrap();
      message.success('Agent request deleted successfully');
      refetch();
    } catch (err) {
      console.error('Delete error:', err);
      message.error(err?.data?.message || 'Failed to delete agent request');
    }
  };

  const handleViewDetails = (id) => {
    router.push(`/agent-request/${id}`);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log(id, newStatus);
      await updateAgentRequestStatus({ id, status: newStatus }).unwrap();
      message.success(`Status updated to ${newStatus}`);
      refetch();
    } catch (err) {
      console.error('Status update error:', err);
      message.error(err?.data?.message || 'Failed to update status');
    }
  };

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'assigned':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      sorter: (a, b) => (a.nationality || '').localeCompare(b.nationality || ''),
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
    },
    {
      title: "Move In Date",
      dataIndex: "moveInDate",
      key: "moveInDate",
      sorter: (a, b) => new Date(a.moveInDate) - new Date(b.moveInDate),
    },
    {
      title: "University",
      dataIndex: "universityName",
      key: "universityName",
      sorter: (a, b) => (a.universityName || '').localeCompare(b.universityName || ''),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {record.status}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Assigned', value: 'assigned' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status?.toLowerCase() === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
      render: (dateString) => new Date(dateString).toLocaleString('en-US', {
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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record.id)}
            title="View Details"
            size="small"
          />
          <Popconfirm
            title="Delete Agent Request"
            description="Are you sure you want to delete this agent request? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              size="small"
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </Popconfirm>
          <Select
            size="small"
            style={{ width: 120 }}
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            loading={isUpdating}
            disabled={isUpdating}
          >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="assigned">Assigned</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <LayoutHoc>
        <Col className={`${styles.title}`}>
          <h3>Agent Requests</h3>
        </Col>
        <Col className="tableBox">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <Spin size="large" />
          </div>
        </Col>
      </LayoutHoc>
    );
  }

  if (error) {
    return (
      <LayoutHoc>
        <Col className={`${styles.title}`}>
          <h3>Agent Requests</h3>
        </Col>
        <Col className="tableBox">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ color: '#ff4d4f', fontSize: '16px' }}>
              Error loading agent requests
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>
              {error?.message || 'Something went wrong while fetching data'}
            </div>
            <Button onClick={refetch} type="primary">
              Retry
            </Button>
          </div>
        </Col>
      </LayoutHoc>
    );
  }

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Agent Requests ({paginationInfo.totalRequests})</h3>
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
            <Select.Option value="all">All Fields</Select.Option>
            <Select.Option value="fullName">Name</Select.Option>
            <Select.Option value="email">Email</Select.Option>
            <Select.Option value="nationality">Nationality</Select.Option>
            <Select.Option value="mobileNumber">Mobile</Select.Option>
            <Select.Option value="universityName">University</Select.Option>
            <Select.Option value="status">Status</Select.Option>
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
          <div style={{ marginBottom: 16, color: "#666", fontStyle: 'italic', padding: "0 16px" }}>
            {paginationInfo.totalRequests > 0 
              ? `Found ${paginationInfo.totalRequests} request(s) matching "${searchTerm}" in ${searchField === 'all' ? 'all fields' : searchField}`
              : `No requests found matching "${searchTerm}" in ${searchField === 'all' ? 'all fields' : searchField}`
            }
          </div>
        )}
        
        {/* Summary Info */}
        <div style={{ marginBottom: 16, color: "#666", padding: "0 16px" }}>
          Showing {((paginationInfo.currentPage - 1) * paginationInfo.limit) + 1} to {Math.min(paginationInfo.currentPage * paginationInfo.limit, paginationInfo.totalRequests)} of {paginationInfo.totalRequests} requests
        </div>

        <DataTable
          colData={columns}
          rowKey="_id"
          rowData={response?.data?.map((item) => ({
            id: item._id,
            fullName: item.fullName,
            email: item.email,
            nationality: item.nationality,
            mobileNumber: item.mobileNumber,
            moveInDate: item.moveInDate,
            universityName: item.universityName,
            status: item.status,
            createdAt: new Date(item.createdAt).toLocaleString(),
          }))}
          loading={isLoading}
          error={error}
          title="Agent Requests"
          showSearch={false} // Disable built-in search since we have custom search
          searchFields={['fullName', 'email', 'mobileNumber', 'universityName']}
          pagination={false} // Disable built-in pagination
          scroll={{ x: 800 }}
        />

        {/* Custom Pagination Component */}
        <div style={{ 
          marginTop: 20, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{ color: '#666' }}>
            Total {paginationInfo.totalRequests} requests
          </div>
          
          <Pagination
            current={paginationInfo.currentPage}
            pageSize={paginationInfo.limit}
            total={paginationInfo.totalRequests}
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

export default AgentRequests;