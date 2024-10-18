import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
import React from 'react'
import styles from "../manage-raag/styles.module.css"
import SelectDropdownComponent from '@/components/TextFields/selectDropdown'
  import FilledButtonComponent from '@/components/Button'
import DataTable from '@/components/Datatable'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/assest/images'

export default function ManageRaag() {


    const data = [
        {
          key: "1",
          number: "1",
          raagname: "raag",
      
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
          title: "Raag Name",
          dataIndex: "raagname",
          key: "raagname",
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
                    <h3>Manage Raag Name</h3>
                    <Link href="/manage-raag/add-raag"><FilledButtonComponent className={`${styles.addBtn}`}>Add</FilledButtonComponent></Link> 
                </Col>
                <Col className="tableBox">
                    <DataTable rowData={data} colData={columns} />
                   
                </Col>

            </LayoutHoc>
        </>
    )
}
