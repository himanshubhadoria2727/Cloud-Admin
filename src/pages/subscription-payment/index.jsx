import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Col, Dropdown, Row, Space } from "antd";
import React from "react";
import styles from "./property.module.css";
import DateRangePickerComponent from "@/components/TextFields/datepicker";
const data = [
  {
    key: "1",
    id: "#123432",
    transaction_id: "64c21c92",
    user_id: "#1",
    date: "26.7.2023.",
    email: "praveen@gmail.com",

    amount: "$100",
    
  },

];

const columns = [
  {
    title: "Payment ID ",
    dataIndex: "id",
    key: "id",
    width: "15%",
    searchable: true
    // ...getColumnSearchProps("name"),
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
    title: "User ID ",
    dataIndex: "user_id",
    key: "user_id",
    width: "20%",
    searchable: true
    // ...getColumnSearchProps("date"),
  },
  {
    title: "User Email ",
    dataIndex: "email",
    key: "email",
    width: "20%",
    searchable: true
    // ...getColumnSearchProps("date"),
  },

  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: "20%",
    searchable: true
    // ...getColumnSearchProps("date"),
  },

  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },

];

export default function ManageProperty() {

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Subscription payments</h3>
        <DateRangePickerComponent />
        
      </Col>
      <Col className="tableBox">
      <DataTable rowData={data} colData={columns} />
      </Col>
    </LayoutHoc>
  );
}
