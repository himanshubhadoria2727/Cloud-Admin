import LayoutHoc from '@/HOC/LayoutHoc'
import { Col, Switch } from 'antd'
import React, { useState } from 'react'
import styles from "./styles.module.css"
import FilledButtonComponent from '@/components/Button'
import DataTable from '@/components/Datatable'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/assest/images'
import DateRangePickerComponent from '@/components/TextFields/datepicker'
import { SVG } from '@/assest/svg'


export default function ManageDevice() {
    const data = [
        {
            key: "1",
            serial_no: "1",
            course_name: "musical",
            category: "product",
            duration: "4:50 min",
            chapter_name: "Chapter1",
            trending: (
                <Switch defaultChecked={false} onChange={(checked) => console.log(checked)} />
              ),
            description: "Lorem ipsum is....",
            file: (
              <span style={{cursor:"pointer"}}><SVG.Pdf width="24" height="24" /></span>  
            ),
            option: (
                <Link href="#">
                    <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                </Link>
            ),
        },

    ];

    const columns = [
        {   
            title: "S.No",
            dataIndex: "serial_no",
            key: "serial_no",
            width: "16%",
        },
        {   
            title: "Course Name",
            dataIndex: "course_name",
            key: "course_name",
            width: "16%",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: "16%",
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("name"),
        },

        {
            title: "Chapter Name",
            dataIndex: "chapter_name",
            key: "chapter_name",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("slug"),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("date"),
        },
        {
            title: "Set as trending now",
            dataIndex: "trending",
            key: "trending",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("date"),
        },
        {
            title: "File",
            dataIndex: "file",
            key: "file",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("date"),
        },

        {
            title: "Action",
            dataIndex: "option",
            key: "option",
        },
    ];


    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <Col>
                        <h3>Manage Course</h3>
                        <DateRangePickerComponent />
                    </Col>
                  <Link href="/manage-course/add-course"><FilledButtonComponent className={`${styles.addBtn}`}>Add Course</FilledButtonComponent></Link>  
                </Col>
                <Col className="tableBox">
                    <DataTable rowData={data} colData={columns} />
                </Col>
            </LayoutHoc>
        </>
    )
}
