import React from 'react'
import styles from "./subscription.module.css"
import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
import CheckBoxComponent from '@/components/TextFields/checkBox'
import MyQuillEditor from '@/components/TextFields/textArea'
import FilledButtonComponent from '@/components/Button'
import DateRangePickerComponent from '@/components/TextFields/datepicker'
import Link from 'next/link'
import DataTable from '@/components/Datatable'
import Image from 'next/image'
import { IMAGES } from '@/assest/images'

export default function SubscriptionSetting() {
    const data = [
        {
            key: "1",
            serialnumber: "1",
            create_date: "27-11-23",
            plan_name: "Subscription",
            message: "Lorum ipsum....",
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
            title: "Created Date",
            dataIndex: "create_date",
            key: "create_date",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("name"),
        },
        {
            title: "Plan name",
            dataIndex: "plan_name",
            key: "plan_name",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("mobilenumber"),
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
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
                    <h3>Subscription Setting</h3>
                    <Link href="/subscription-setting/add-plan">
                        <Col className={`${styles.planBtn}`}>
                            <FilledButtonComponent className="btn submit">Add New Plan</FilledButtonComponent>
                        </Col>
                    </Link>

                    <DateRangePickerComponent />
                </Col>
             
                <Col className="tableBox">

                    <DataTable rowData={data} colData={columns} />
                </Col>
            </LayoutHoc >
        </>
    )
}
