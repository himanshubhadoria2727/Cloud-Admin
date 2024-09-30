import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
import React from 'react'
import styles from "./styles.module.css"
import SelectDropdownComponent from '@/components/TextFields/selectDropdown'
import FilledButtonComponent from '@/components/Button'
import DataTable from '@/components/Datatable'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/assest/images'

export default function ManageLesson() {

 
    const data = [
        {
          key: "1",
          number: "1",
          lessonname: "raag",
      
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
          title: "Lesson Name",
          dataIndex: "lessonname",
          key: "lessonname",
          width: "10%",
          searchable: true
          // ...getColumnSearchProps("mobilenumber"),
        },
      
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          width: "10%",
          render: (text, record) => (
            <span className={`${styles.options}`}>
              {/* <Link href="/edit-content">
                <SVG.Edit />
              </Link> */}
      
              <Link href="#">
                <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
              </Link>
            </span>
          ),
      
        },
      
      
      ];
    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Manage Lesson Type</h3>
                    <Link href="/manage-lesson/add-lesson"><FilledButtonComponent className={`${styles.addBtn}`}>Add</FilledButtonComponent></Link> 
                </Col>
                <Col className="tableBox">
                    <DataTable rowData={data} colData={columns} />
                </Col>

            </LayoutHoc>
        </>
    )
}
