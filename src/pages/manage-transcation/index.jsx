import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Col, Dropdown, Row, Space } from "antd";
import React from "react";
import styles from "./property.module.css";
import DateRangePickerComponent from "@/components/TextFields/datepicker";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/assest/images";
const data = [
  {
    key: "1",
    id: "#123432",
    transaction_id: "#64c21c92",
    user_detail: (
      <>
      <Col className={`${styles.userDetails}`}>
      <p>#12389</p>
      <p>Harsh</p>
      <p>Harsh@gmail.com</p>
      </Col>
      </>
    ),
    date: "26.7.2023.",
    amount: "$100",
    option: (
      <Link href="#">
        <Image src={IMAGES.Invoice} alt="" style={{width:"20px", height:"20px", objectFit:"contain"}} />
      </Link>
    ),
  },

];

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: "20%",
    searchable: true
    // ...getColumnSearchProps("date"),
  },
  {
    title: "Transcation ID ",
    dataIndex: "transaction_id",
    key: "transaction_id",
    width: "15%",
    searchable: true
    // ...getColumnSearchProps("mobilenumber"),
  },
  {
    title: "User Details ",
    dataIndex: "user_detail",
    key: "user_id",
    width: "20%",
    searchable: true
    // ...getColumnSearchProps("date"),
  },

  {
    title: "Amount Paid",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Action",
    dataIndex: "option",
    key: "option",
  },
 

];

export default function ManageProperty() {

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Manage Subscription Orders</h3>
        <DateRangePickerComponent />
        
      </Col>
      <Col className="tableBox">
      <DataTable rowData={data} colData={columns} />
      </Col>
    </LayoutHoc>
  );
}
