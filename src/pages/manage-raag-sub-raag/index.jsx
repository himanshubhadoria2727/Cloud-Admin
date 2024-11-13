import LayoutHoc from "@/HOC/LayoutHoc";
import { Col } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./category.module.css";
import LabelInputComponent from "@/components/TextFields/labelInput";
import SelectDropdownComponent from "@/components/TextFields/selectDropdown";
import FilledButtonComponent from "@/components/Button";
import DataTable from "@/components/Datatable";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/assest/images";
import { delSubcategory, getSubcategory, getCategoryapi } from "@/api/Categoryapi";
import moment from "moment";
import { linkbase } from "@/HOC/constant";
import Swal from "sweetalert2";
import { deleteAlertContext } from "@/HOC/alert";

export default function ManageCategory() {
  const [loading, setloading] = useState(false);
  const [subCategory, setsubCategory] = useState([]);
  const [category, setCategory] = useState([]);

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
      setCategory(data?.data);
    });
  }, [loading]);

  const data = [
    {
      key: "1",
      serial_no: "1",
      creation_date: "26.7.2023",
      raag_name: "Raag Bahar",
      taal_name: "Bhimpalasi",
      category_image: (
        <Image
          src={IMAGES.Logo}
          alt=""
          style={{ width: "100px", height: "60px", objectFit: "contain" }}
        />
      ),
      option: (
        <>
          <Col className={`${styles.optionBtn}`}>
            {/* <Link href="/manage-raag-sub-raag/edit-category">
                            <span className={`${styles.editBtn}`}> <SVG.Edit /> </span>
                        </Link> */}
            <Link href="#">
              <Image
                src={IMAGES.Delete}
                alt=""
                style={{ width: "20px", height: "20px", objectFit: "contain" }}
              />
            </Link>
          </Col>
        </>
      ),
    },
  ];

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
      title: "Sub Taal Name",
      dataIndex: "raag_name",
      key: "raag_name",
      width: "25%",
      searchable: true,
      // ...getColumnSearchProps("name"),
    },

    {
      title: "Taal Name",
      dataIndex: "taal_name",
      key: "taal_name",
      width: "25%",
      searchable: true,
      // ...getColumnSearchProps("name"),
    },
    {
      title: "Action",
      dataIndex: "option",
      key: "option",
    },
  ];

  console.log(subCategory);
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
          <DataTable
            rowData={
              subCategory &&
              subCategory.length > 0 &&
              subCategory.map((data, id) => {
                console.log(data); // Log each item to check its structure

                // Ensure subCategory and CategoryName are strings, else convert to a string or handle appropriately
                const subCategoryName = data?.subCategory?.toString() || "N/A";
                const categoryName =
                  data?.category?.CategoryName?.toString() || "N/A";

                return {
                  key: id + 1,
                  serial_no: id + 1,
                  creation_date: moment(data?.createdAt).format("L"),
                  raag_name: subCategoryName,
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
            }
            colData={columns}
          />
        </Col>
      </LayoutHoc>
    </div>
  );
}
