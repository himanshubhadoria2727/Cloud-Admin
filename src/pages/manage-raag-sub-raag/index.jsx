import LayoutHoc from "@/HOC/LayoutHoc";
import { Col, Pagination } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./category.module.css";
import LabelInputComponent from "@/components/TextFields/labelInput";
import SelectDropdownComponent from "@/components/TextFields/selectDropdown";
import FilledButtonComponent from "@/components/Button";
import DataTable from "@/components/Datatable";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/assest/images";
import {
  delSubcategory,
  getSubcategory,
  getCategoryapi,
} from "@/api/Categoryapi";
import moment from "moment";
import { linkbase } from "@/HOC/constant";
import Swal from "sweetalert2";
import { deleteAlertContext } from "@/HOC/alert";

export default function ManageCategory() {
  const [loading, setloading] = useState(false);
  const [subCategory, setsubCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const deleteduser = (id) => {
    setloading(true);

    Swal.fire(deleteAlertContext).then((data) => {
      if (data.isConfirmed) {
        delSubcategory(id)
          .then((data) => {
            console.log(data, "cheking respond is");
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            setloading(false);
          })
          .catch((err) => {
            if (err) {
              setloading(false);
            }
          });
      }
      setloading(false);
    });
  };

  useEffect(() => {
    getSubcategory().then((data) => {
      console.log(data, "cheking data is here");
      setsubCategory(data?.data);
    });
  }, [loading]);

  useEffect(() => {
    getCategoryapi().then((data) => {
      console.log(data, "cheking category");
      setCategory(data?.data?.allCategories);
    });
  }, [loading]);

  const columns = [
    {
      title: "S.NO",
      dataIndex: "serial_no",
      key: "serial_no",
      width: "25%",
    },
    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      width: "25%",
    },
    {
      title: "Taal Name",
      dataIndex: "taal_name",
      key: "taal_name",
      width: "25%",
      searchable: true,
    },
    {
      title: "Sub Taal Name",
      dataIndex: "raag_name",
      key: "raag_name",
      width: "25%",
      searchable: true,
    },
    {
      title: "Action",
      dataIndex: "option",
      key: "option",
    },
  ];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = category?.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getTableData = () => {
    return currentItems && currentItems.length > 0
      ? currentItems.map((data, id) => {
          const subCategoryNames = data.subcategories?.length
            ? data.subcategories.map((sub) => sub.subCategory).join(", ")
            : "N/A";
          const categoryName = data?.CategoryName?.toString() || "N/A";

          return {
            key: indexOfFirstItem + id + 1,
            serial_no: indexOfFirstItem + id + 1,
            creation_date: moment(data?.createdAt).format("L"),
            raag_name: subCategoryNames,
            taal_name: categoryName,
            option: (
              <Col className={`${styles.optionBtn}`}>
                <Image
                  src={IMAGES.Delete}
                  onClick={() => deleteduser(data?._id)}
                  alt=""
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
              </Col>
            ),
          };
        })
      : [];
  };

  return (
    <div>
      <LayoutHoc>
        <Col className={`${styles.title}`}>
          <h3 style={{ position: "relative", top: "11px" }}>
            Manage Taal & Sub Taal
          </h3>
          <Col>
            <Link href="/manage-raag-sub-raag/add-sub-category">
              {" "}
              <FilledButtonComponent>Add Sub Category</FilledButtonComponent>
            </Link>
            <Link href="/manage-raag-sub-raag/add-category">
              {" "}
              <FilledButtonComponent>Add Category</FilledButtonComponent>
            </Link>
          </Col>
        </Col>

        <Col className="tableBox">
          <DataTable rowData={getTableData()} colData={columns} />
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              current={currentPage}
              total={category?.length || 0}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </Col>
      </LayoutHoc>
    </div>
  );
}