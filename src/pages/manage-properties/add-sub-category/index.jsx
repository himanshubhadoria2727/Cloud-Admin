import LayoutHoc from "@/HOC/LayoutHoc";
import React, { useState, useEffect } from "react";
import styles from "../properties.module.css";
import { Col } from "antd";
import LabelInputComponent from "@/components/TextFields/labelInput";
import FilledButtonComponent from "@/components/Button";
import Link from "next/link";
import { SVG } from "@/assest/svg";
import SearchCategory from "../add-property/component/search-category";
import { addSubcategory, getCategoryapi } from "@/api/Categoryapi";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as yup from "yup";

export default function AddSubCategory() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const [categoryOption, setcategoryOption] = useState([]);

  useEffect(() => {
    getCategoryapi().then((data) => {
      setcategoryOption(data?.data?.allCategories);
    });
  }, []);
  const initialState = {
    category: "",
    subCategory: "",
  };
  const subcategorySchema = yup.object().shape({
    category: yup.string().required("Category is required"),
    subCategory: yup.string().required("Subcategory is required"),
  });

  return (
    <>
      <LayoutHoc>
        <Col className={`${styles.title}`}>
          <h3 style={{ position: "relative", top: "11px" }}>
            Add Sub Category
          </h3>
          <Link href="/manage-raag-sub-raag">
            {" "}
            <FilledButtonComponent>
              {" "}
              <SVG.Arrow /> Back
            </FilledButtonComponent>
          </Link>
        </Col>
        <Formik
          initialValues={initialState}
          validationSchema={subcategorySchema}
          onSubmit={(values) => {
            console.log(values, "ekfjefefkekf");
            addSubcategory(values)
              .then((data) => {
                console.log(data, "cheking datat ");
                toast.success(`${data?.data?.message}`);
                router.push("/manage-raag-sub-raag");
              })
              .catch((err) => {
                if (err) {
                  toast.error(`Some went wrong`);
                }
                console.log(err);
              });
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Col className="tableBox ">
                <Col className="subCategory">
                  <SearchCategory
                    setFieldValue={setFieldValue}
                    title="Category"
                    options={categoryOption}
                    onCategoryChange={handleCategoryChange}
                  />
                  <ErrorMessage name={"category"}>
                    {(msg) => <div className={styles.errorMessage}>{msg}</div>}
                  </ErrorMessage>{" "}
                  {selectedCategory && (
                    <>
                      <Col style={{ marginTop: "21px" }}>
                        <LabelInputComponent
                          title="Sub Category"
                          name="subCategory"
                          type="search"
                        />
                        <ErrorMessage name={"subCategory"}>
                          {(msg) => (
                            <div className={styles.errorMessage}>{msg}</div>
                          )}
                        </ErrorMessage>{" "}
                      </Col>
                    </>
                  )}
                  <Col style={{ textAlign: "end", marginTop: "16px" }}>
                    <button className="btn submit" type="submit">
                      Save
                    </button>
                  </Col>
                </Col>
              </Col>
            </Form>
          )}
        </Formik>
      </LayoutHoc>
    </>
  );
}
