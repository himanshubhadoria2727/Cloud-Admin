import LayoutHoc from "@/HOC/LayoutHoc";
import { Col, Row, Input, Button, Pagination } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./user.module.css";
import Datatable from "@/components/Datatable";
import Image from "next/image";
import Swal from "sweetalert2";
import { IMAGES } from "@/assest/images";
import DateRangePickerComponent from "@/components/TextFields/datepicker";
import { getUser, deleteduserapi } from "@/api/userapi";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

function ManageUser() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch user data
  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await getUser(page, pageSize, search);
      const userData = response?.data || {};
      setUsers(userData.data || []);
      setTotalUsers(userData.pagination.total || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger initial + search + pagination
  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // ✅ Handle search input enter
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ✅ Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // ✅ Delete user
  const handleDeleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        deleteduserapi(id)
          .then(() => {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
            setUsers((prev) => prev.filter((user) => user._id !== id));
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  // ✅ DataTable columns
  const columns = [
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "User Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "firstname",
      key: "firstname",
      render: (_, record) =>
        record.firstname || record.lastname
          ? `${record.firstname} ${record.lastname}`
          : "N/A",
    },
    {
      title: "Email Id",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "N/A",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_no",
      key: "phone_no",
    },
    {
      title: "Country",
      dataIndex: "country_name",
      key: "country_name",
    },
    {
      title: "Action",
      key: "option",
      render: (_, record) => (
        <Image
          src={IMAGES.Delete}
          alt="Delete User"
          style={{
            width: "20px",
            height: "20px",
            objectFit: "contain",
            cursor: "pointer",
          }}
          onClick={() => handleDeleteUser(record._id)}
        />
      ),
    },
  ];

  // ✅ Row data mapped
  const rowData = users.map((user) => ({
    key: user._id,
    createdAt: user.createdAt,
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone_no: `${user.country_code} ${user.phone_no}`,
    country_name: user.country_name,
  }));

  return (
    <LayoutHoc>
      <Col className={styles.title}>
      <Col className={`${styles.title}`}>
              <h3>Manage User</h3>
            </Col>
        <Row className="optionTag" style={{ flexWrap: "wrap" }}>
          
          <Col md={12} style={{ display: "flex", gap: "12px" }}>
            <Input.Search
              placeholder="Search by Name, ID or Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              allowClear
              style={{ width: 300 }}
            />
            {searchTerm && (
              <Button icon={<ClearOutlined />} onClick={clearSearch}>
                Clear
              </Button>
            )}
          </Col>
        </Row>

        <Col className={styles.dateFilter}>
          <DateRangePickerComponent />
        </Col>
      </Col>

      <Col className="tableBox">
        <div className={styles.tableWrapper}>
          <Datatable rowData={rowData} colData={columns} loading={loading} />

          <Pagination
            current={currentPage}
            total={totalUsers}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            style={{ marginTop: "20px", textAlign: "right" }}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} users`
            }
          />
        </div>
      </Col>
    </LayoutHoc>
  );
}

export default ManageUser;
