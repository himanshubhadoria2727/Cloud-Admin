import React, { useEffect, useState } from 'react';
import { Col, Row, Button } from 'antd';
import LayoutHoc from '@/HOC/LayoutHoc';
import FilledButtonComponent from '@/components/Button';
import styles from "./styles.module.css";

import Link from 'next/link';
import DataTable from '@/components/Datatable';
import Image from 'next/image';
import { IMAGES } from '@/assest/images';
import { delSurmandal, getSurmandal } from '@/api/surmandalapi';
import Swal from 'sweetalert2';
import { deleteAlertContext } from '@/HOC/alert';


export default function ManageTanpura() {
    const [loading, setloading] = useState(false)
    const [surmandal, setsurmandal] = useState([])

    const data = [
        {
            key: "1",
            pitch: "C#",
            type: "SA-PA",
            files: "24 ",

            option: (
                <Link href="#">
                    <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                </Link>
            ),
        },

    ];

    useEffect(() => {
        getSurmandal().then((data) => {
            console.log(data, "cheking surmandal");
            setsurmandal(data?.data)
        })
    }, [loading])

    const deleteduser = (id) => {
        setloading(true)

        Swal.fire(deleteAlertContext).then((data) => {
            if (data.isConfirmed) {
                delSurmandal(id).then((data) => {
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


    const columns = [

        {
            title: "Pitch",
            dataIndex: "pitch",
            key: "pitch",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("date"),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("date"),
        },
        {
            title: "Files",
            dataIndex: "files",
            key: "files",
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


    if (loading) {
        return <h1>Loading....</h1>
    }

    return (
        <LayoutHoc>
            <Col className={`${styles.title}`}>
                <Row className={`${styles.rowTag}`}>
                    <Col md={14}>
                        <h3 style={{ position: "relative", top: "11px" }}>Manage Surmandal</h3>
                    </Col>
                    <Col md={10}>
                        <Col style={{ textAlign: "end" }}>
                            <Link href="/manage-surmandal/add-surmandal">  <FilledButtonComponent>Add</FilledButtonComponent></Link>
                        </Col>
                    </Col>
                </Row>

            </Col>
            <Col className="tableBox">

                <DataTable rowData={surmandal && surmandal?.length > 0 && surmandal?.map((data) => ({
                    key: data?._id,
                    pitch: data?.pitch,
                    type: data?.raag,
                    files: data?.files?.length,

                    option: (

                        <Image src={IMAGES.Delete} alt="" onClick={() => deleteduser(data?._id)} style={{ width: "20px", height: "20px", objectFit: "contain" }} />

                    ),

                }))} colData={columns} />
            </Col>
        </LayoutHoc>
    );
}
