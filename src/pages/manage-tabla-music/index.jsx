import LayoutHoc from "@/HOC/LayoutHoc";
import { Col, Row, Pagination } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css"
import Datatable from "@/components/Datatable";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/assest/images";
import FilledButtonComponent from "@/components/Button";
import Swal from "sweetalert2";
import { deleteAlertContext } from "@/HOC/alert";

function ManageTabla() {
    const [loading, setloading] = useState(false);
    const [tabla, settabla] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        },
        {
            title: "Sub Taal Name",
            dataIndex: "sub_raag",
            key: "sub_raag",
            width: "20%",
            searchable: true
        },
        {
            title: "Pitch",
            dataIndex: "pitch",
            key: "pitch",
            width: "20%",
            searchable: true
        },
        {
            title: "Files",
            dataIndex: "files",
            key: "files",
            width: "20%",
            searchable: true
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

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tabla?.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getTableData = () => {
        return currentItems && currentItems.length > 0 ? currentItems.map((data, id) => {
            return {
                key: indexOfFirstItem + id + 1,
                raag_name: data?.taalname?.CategoryName,
                sub_raag: data?.subtaalname?.subCategory,
                pitch: data?.pitch,
                files: data?.taalfiles.length,
                option: (
                    <Image 
                        src={IMAGES.Delete} 
                        alt="" 
                        onClick={() => deleteduser(data?._id)} 
                        style={{ width: "20px", height: "20px", objectFit: "contain" }} 
                    />
                ),
            }
        }) : [];
    };

    if (loading) {
        return <h6>.</h6>
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
                            <Link href="/manage-tabla-music/add-tabla-music">
                                <FilledButtonComponent>Add</FilledButtonComponent>
                            </Link>
                        </Col>
                    </Col>
                </Row>
            </Col>
            
            <Col className="tableBox">
                <Datatable 
                    rowData={getTableData()} 
                    colData={columns} 
                />
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination
                        current={currentPage}
                        total={tabla?.length || 0}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </Col>
        </LayoutHoc>
    );
}

export default ManageTabla;