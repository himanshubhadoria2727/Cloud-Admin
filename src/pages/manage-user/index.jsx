import LayoutHoc from "@/HOC/LayoutHoc";
import { Col, Row } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./user.module.css";
import Datatable from "@/components/Datatable";
import Image from "next/image";
import Link from "next/link";


import { IMAGES } from "@/assest/images";
import DateRangePickerComponent from "@/components/TextFields/datepicker";

import CheckBoxComponent from "@/components/TextFields/checkBox";
import { deleteduserapi, userapi } from "@/api/userapi";
import Swal from "sweetalert2";
import { deleteAlertContext } from "@/HOC/alert";

function ManageUser() {

  const [freeUsersChecked, setFreeUsersChecked] = useState(false);
  const [paidUsersChecked, setPaidUsersChecked] = useState(false);
  const [loading, setloading] = useState(false)

  const [user, setuser] = useState([])






  useEffect(() => {
    userapi(paidUsersChecked, freeUsersChecked).then((data) => {


      setuser(data?.data?.users)
      console.log(data, "cheking data");

    })



  }, [loading, paidUsersChecked, freeUsersChecked])




  console.log(user, "shdwgwu");

  const deleteduser = (id) => {
    setloading(true)

    Swal.fire(deleteAlertContext).then((data) => {
      if (data.isConfirmed) {
        deleteduserapi(id).then((data) => {
          console.log(data, "cheking respond is");
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          setloading(false);
        }).catch((err) => {
          if (err) {
            setloading(false)
          }
        })


      }
      setloading(false)
    })

  }




  if (loading) {
    return <h6>
      loading....
    </h6>
  }





  const columns = [
    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      width: "16%",
    },
    {
      title: "User Id",
      dataIndex: "user",
      key: "user",
      width: "16%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      searchable: true
      // ...getColumnSearchProps("name"),
    },

    {
      title: "Email Id",
      dataIndex: "email",
      key: "email",
      width: "20%",
      searchable: true
      // ...getColumnSearchProps("slug"),
    },
    {
      title: "Phone Number",
      dataIndex: "number",
      key: "number",
      width: "20%",
      searchable: true
      // ...getColumnSearchProps("date"),
    },
    {
      title: "Payment Plan",
      dataIndex: "plan",
      key: "plan",
      width: "40%",
      searchable: true
      // ...getColumnSearchProps("code"),
    },

    {
      title: "Action",
      dataIndex: "option",
      key: "option",
    },
  ];

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <Row className="optionTag">
          <Col md={14}>
            <h3>Manage User</h3>
          </Col>
        </Row>
        <Col className={`${styles.dateFilter}`}>
          <DateRangePickerComponent />
          <Col>
            <CheckBoxComponent
              checked={freeUsersChecked}
              onChange={(checked) => {
                setFreeUsersChecked(checked);
                if (checked) {
                  // If Free Users checkbox is checked, uncheck Paid Users checkbox
                  setPaidUsersChecked(false);
                }
                console.log(checked);
              }}
            >
              Free Users
            </CheckBoxComponent>
            <CheckBoxComponent
              checked={paidUsersChecked}
              onChange={(checked) => {
                setPaidUsersChecked(checked);
                if (checked) {

                  setFreeUsersChecked(false);
                }
                console.log(checked);
              }}
            >
              Paid Users
            </CheckBoxComponent>
          </Col>
        </Col>
      </Col>
      <Col className="tableBox">

        <Datatable rowData={user && user?.length > 0 && user.map((data, id) => (
          {
            key: data?._id,
            creation_date: "26.7.2023",
            user: data?.user?._id,
            name: "Jihn ",
            email: data?.user?.email,
            number: data?.user?.phone_no,
            plan: data?.plan?.plantype[0]?.amount > 0 ? "paid" : "free",
            option: (

              <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} onClick={() => deleteduser(data?._id)} />

            ),
          }
        ))} colData={columns} />
      </Col>
    </LayoutHoc>
  );
}

export default ManageUser;
