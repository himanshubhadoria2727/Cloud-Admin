import LayoutHoc from "@/HOC/LayoutHoc";
import { Col, Row, Pagination } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./user.module.css";
import Datatable from "@/components/Datatable";
import Image from "next/image";
import Swal from "sweetalert2";
import { IMAGES } from "@/assest/images";
import DateRangePickerComponent from "@/components/TextFields/datepicker";
import { getUser, deleteduserapi } from "@/api/userapi";
import { deleteAlertContext } from "@/HOC/alert";

function ManageUser() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await getUser(page, pageSize, search); // Pass search term to the API
      const userData = response?.data || {};
      setUsers(userData.data);
      setTotalUsers(userData.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm); // Fetch users when the page changes
  }, [currentPage]); // Remove searchTerm from dependency array

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      fetchUsers(currentPage, searchTerm); // Trigger fetch when Enter is pressed
    }
  };

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
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
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

  const columns = [
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "16%",
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "User Id",
      dataIndex: "_id",
      key: "_id",
      width: "16%",
    },
    {
      title: "Name",
      dataIndex: "firstname",
      key: "firstname",
      width: "20%",
      render: (text, record) => (record.firstname || record.lastname ? `${record.firstname} ${record.lastname}` : "N/A"),
    },
    {
      title: "Email Id",
      dataIndex: "email",
      key: "email",
      width: "20%",
      render: (email) => email || "N/A",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_no",
      key: "phone_no",
      width: "20%",
    },
    {
      title: "Country",
      dataIndex: "country_name",
      key: "country_name",
      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "option",
      key: "option",
      render: (text, record) => (
        <Image
          src={IMAGES.Delete}
          alt="Delete User"
          style={{ width: "20px", height: "20px", objectFit: "contain", cursor: "pointer" }}
          onClick={() => handleDeleteUser(record._id)}
        />
      ),
    },
  ];

  return (
    <LayoutHoc>
      <Col className={styles.title}>
        <Row className="optionTag">
          <Col md={14}>
            <h3>Manage User</h3>
          </Col>
          <Col md={10}>
            <input
              type="text"
              placeholder="Search by Name, ID or Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              onKeyPress={handleSearch} // Call the search handler
              style={{ width: "100%", padding: "8px", margin: "10px 0" }}
            />
          </Col>
        </Row>
        <Col className={styles.dateFilter}>
          <DateRangePickerComponent />
        </Col>
      </Col>
      <Col className="tableBox">
        <div className={styles.tableWrapper}>
          {loading && <div className={styles.loader}></div>}
          <Datatable
            rowData={users.map((user) => ({
              key: user._id,
              createdAt: user.createdAt,
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              phone_no: `${user.country_code} ${user.phone_no}`,
              country_name: user.country_name,
            }))}
            colData={columns}
          />
          <Pagination
            current={currentPage}
            total={totalUsers}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </div>
      </Col>
    </LayoutHoc>
  );
}

export default ManageUser;
