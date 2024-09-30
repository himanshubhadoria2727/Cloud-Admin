import LayoutHoc from '@/HOC/LayoutHoc'
import React from 'react'
import styles from "./platform.module.css"
import { Col } from 'antd'
import LabelInputComponent from '@/components/TextFields/labelInput'
import DataTable from '@/components/Datatable'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/assest/images'
import FilledButtonComponent from '@/components/Button'
import DateRangePickerComponent from '@/components/TextFields/datepicker'

export default function ManagePlatform() {
    const data = [
        {
            key: "1",
            serialnumber: "1",
            name: "facebook",
            days: "10 days",
            icons: (
                <Image src={IMAGES.FB} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
            ),
            option: (
                <Link href="/edit-user">
                    <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                </Link>
            ),
        },
    ];

    const columns = [
        {
            title: "SR.No",
            dataIndex: "serialnumber",
            key: "serialnumber",
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
            title: "Days",
            dataIndex: "days",
            key: "days",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("mobilenumber"),
        },
        {
            title: "Icons",
            dataIndex: "icons",
            key: "icons",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("slug"),
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
                    <h3>Manage Platform</h3>
                    <Link href="/manage-platform/add-platform">
                        <Col className={`${styles.planBtn}`}>
                            <FilledButtonComponent className="btn submit">Add</FilledButtonComponent>
                        </Col>
                    </Link>

                    <DateRangePickerComponent />
                </Col>
                <Col className="tableBox">
                    <DataTable rowData={data} colData={columns} />
                </Col>
                
            </LayoutHoc>
        </>
    )
}
