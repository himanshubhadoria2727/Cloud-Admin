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
  const [pageSize] = useState(5); // Set your page size

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getUser(page, pageSize); // Pass current page and page size
      const userData = response?.data || {};
      setUsers(userData.data); // Assuming your API returns users under `data.data`
      setTotalUsers(userData.pagination.total); // Update total number of users
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage); // Fetch users when the page changes
  }, [currentPage]);

  const handleDeleteUser = (id) => {
    Swal.fire(deleteAlertContext).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        deleteduserapi(id).then(() => {
          Swal.fire("Deleted!", "The user has been deleted.", "success");
          // Filter out the deleted user without a full reload
          setUsers((prevUsers) => prevUsers.filter(user => user._id !== id));
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
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
      render: (createdAt) => new Date(createdAt).toLocaleDateString(), // Format date
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
      render: (email) => email || "N/A", // Handle empty email
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
        </Row>
        <Col className={styles.dateFilter}>
          <DateRangePickerComponent />
        </Col>
      </Col>
      <Col className="tableBox">
        {/* Data Table with Loader */}
        <div className={styles.tableWrapper}>
          {loading && <div className={styles.loader}></div>} {/* Loader inside table */}
          <Datatable
            rowData={users.map((user) => ({
              key: user._id,
              createdAt: user.createdAt,
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              phone_no: user.phone_no,
              country_name: user.country_name,
            }))}
            colData={columns}
          />
          {/* Pagination Component */}
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
