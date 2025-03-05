import LayoutHoc from "@/HOC/LayoutHoc";
import DataTable from "@/components/Datatable";
import { Col } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/assest/images";
import { SVG } from "@/assest/svg";
import DateRangePickerComponent from "@/components/TextFields/datepicker";
import FilledButtonComponent from '@/components/Button'
import { allContent, deletedcontent } from "@/api/contentapi";
import Swal from "sweetalert2";
import { deleteAlertContext } from "@/HOC/alert";
const data = [
  {
    key: "1",
    number: "1",
    pagename: "Homepage",

  },
  {
    key: "2",
    number: "2",
    pagename: "Privacy Policy",

  },
  {
    key: "3",
    number: "3",
    pagename: "Terms of Use",

  },

];

const columns = [
  {
    title: "Sr. No",
    dataIndex: "number",
    key: "number",
    width: "10%",
    searchable: true
    // ...getColumnSearchProps("name"),
  },
  {
    title: "Page Name",
    dataIndex: "pagename",
    key: "pagename",
    width: "10%",
    searchable: true
    // ...getColumnSearchProps("mobilenumber"),
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    width: "10%",


  },


];

export default function ManageContent() {

  const [loading, setloading] = useState(false)

  const [content, setcontent] = useState([])

  useEffect(() => {
    allContent().then((data) => {

      setcontent(data?.data)

    })
  }, [loading])

  const deleteduser = (id) => {
    setloading(true)

    Swal.fire(deleteAlertContext).then((data) => {
      if (data.isConfirmed) {
        deletedcontent(id).then((data) => {
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
    return <h6>.</h6>
  }
  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Manage Content</h3>
        {/* <Link href="/manage-content/add-content"><FilledButtonComponent className={`${styles.addBtn}`}>Add</FilledButtonComponent></Link>  */}
        {/* <DateRangePickerComponent/> */}
      </Col>
      <Col className="tableBox">
        <DataTable rowData={content && content.length > 0 && content.map((data, id) => ({
          key: id,
          number: id + 1,
          pagename: data?.title,
          action: (
            <>
              <Link href={`/edit-content/${data?._id}`}>
                <SVG.Edit />
              </Link>


              {/* <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} onClick={() => deleteduser(data?._id)} /> */}


            </>
          ),
        }))} colData={columns} />
      </Col>
    </LayoutHoc>
  );
}
