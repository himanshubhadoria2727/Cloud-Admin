import LayoutHoc from "@/HOC/LayoutHoc";
import { Col, Row } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import Datatable from "@/components/Datatable";
import Image from "next/image";
import Link from "next/link";

import { IMAGES } from "@/assest/images";

import FilledButtonComponent from "@/components/Button";
import { delTabla, getTabla } from "@/api/tabla";
import Swal from "sweetalert2";
import { deleteAlertContext } from "@/HOC/alert";

function ManageTabla() {
    const [loading, setloading] = useState(false)

    const [tabla, settabla] = useState([])

    const deleteduser = (id) => {
        setloading(true)

        Swal.fire(deleteAlertContext).then((data) => {
            if (data.isConfirmed) {
                delTabla(id).then((data) => {
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
            title: "Taal Name",
            dataIndex: "raag_name",
            key: "name",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("name"),
        },

        {
            title: "Sub Taal Name",
            dataIndex: "sub_raag",
            key: "sub_raag",
            width: "20%",
            searchable: true
            // ...getColumnSearchProps("slug"),
        },
        {
            title: "Pitch",
            dataIndex: "pitch",
            key: "pitch",
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


    useEffect(() => {
        getTabla().then((data) => {
            settabla(data?.data?.alltabla)
            console.log(data, "cheking tabla");
        })
    }, [loading])
    if (loading) {
        return <h6>loading....</h6>
    }

    return (
        <LayoutHoc>
            <Col className={`${styles.title}`}>
                <Row className={`${styles.rowTag}`} >
                    <Col md={14}>
                        <h3 style={{ position: "relative", top: "11px" }}>Manage Tabla Music</h3>
                    </Col>
                    <Col md={10}>
                        <Col style={{ textAlign: "end" }}>
                            <Link href="/manage-tabla-music/add-tabla-music">  <FilledButtonComponent>Add</FilledButtonComponent></Link>
                        </Col>
                    </Col>
                </Row>

            </Col>
            <Col className="tableBox">

                <Datatable rowData={tabla && tabla.length > 0 && tabla.map((data, id) => {
                    return (
                        {
                            key: id + 1,
                            raag_name: data?.taalname?.CategoryName,
                            sub_raag: data?.subtaalname?.subCategory,
                            pitch: data?.pitch,
                            files: data?.taalfiles.length,

                            option: (

                                <Image src={IMAGES.Delete} alt="" onClick={() => deleteduser(data?._id)} style={{ width: "20px", height: "20px", objectFit: "contain" }} />

                            ),
                        }

                    )
                })} colData={columns} />
            </Col>
        </LayoutHoc>
    );
}

export default ManageTabla;
