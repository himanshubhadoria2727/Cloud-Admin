import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import LayoutHoc from "@/HOC/LayoutHoc";
import Image from "next/image";
import styles from "../category.module.css";
import { IMAGES } from "@/assest/images";
import { Row, Col } from "antd";
import LabelInputComponent from "@/components/TextFields/labelInput";
import FilledButtonComponent from "@/components/Button";
import Link from "next/link";
import { SVG } from "@/assest/svg";
import { addCategory } from "@/features/category/categorySlice";
import { useRouter } from "next/router";

export default function AddCategory() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((state) => state.category);
  // Formik validation schema
  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required("Category name is required"),
    bol: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Bol Name is required"),
        })
      )
      .min(1, "At least one Bol is required"),
  });

  const handleSubmit = async (values) => {
    console.log("hii", values);
    const formData = new FormData();
    formData.append("CategoryName", values.categoryName);

    // Check if bol is an array and then append valid bol names to the FormData
    if (Array.isArray(values.bol)) {
      values.bol.forEach((item, index) => {
        if (item?.name) {
          formData.append(`Bol[${index}][name]`, item.name); // Format Bol array properly
        }
      });
    }

    try {
      // Dispatch the addCategory action to the store
      const result = await dispatch(addCategory(formData)).unwrap();
      console.log("Dispatch result:", result);
      router.back(); // Navigate back to the previous page
    } catch (error) {
      console.error("Error during category addition:", error);
    }
  };

  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3 style={{ position: "relative", top: "6px" }}>Add Category</h3>
        <Link href="/manage-raag-sub-raag">
          <FilledButtonComponent>
            <SVG.Arrow /> Back
          </FilledButtonComponent>
        </Link>
      </Col>
      <Formik
        initialValues={{
          categoryName: "",
          bol: [{ name: "" }], // Default value for bol field
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Col className="tableBoxed tableBox">
              <Col>
                <LabelInputComponent
                  name="categoryName"
                  type="text"
                  title="Category Name"
                  placeholder="Enter category name"
                />
              </Col>
              <ErrorMessage name="categoryName">
                {(msg) => <div className={styles.errorMessage}>{msg}</div>}
              </ErrorMessage>
              <Col className={styles.bolBox}>
                <label>Bol</label>

                <Row className={styles.bolInput}>
                  {values?.bol?.length > 0 &&
                    values?.bol.map((bol, index) => (
                      <React.Fragment key={index}>
                        <Col md={2} className="bolInput">
                          <LabelInputComponent name={`bol[${index}].name`} />
                          <ErrorMessage name={`bol[${index}].name`}>
                            {(msg) => (
                              <div className={styles.errorMessage}>{msg}</div>
                            )}
                          </ErrorMessage>
                        </Col>
                        {index > 0 && (
                          <Image
                            src={IMAGES.Delete}
                            alt="Delete"
                            onClick={() => {
                              // Remove bol input by filtering out the one clicked
                              setFieldValue(
                                "bol",
                                values?.bol?.filter((_, i) => i !== index)
                              );
                            }}
                            style={{
                              cursor: "pointer",
                              height: "20px",
                              width: "20px",
                              marginTop: "12px",
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                </Row>

                <Col>
                  <Image
                    src={IMAGES.Add}
                    alt="Add"
                    style={{
                      cursor: "pointer",
                      height: "20px",
                      width: "20px",
                      position: "relative",
                      top: "7px",
                    }}
                    onClick={() => {
                      // Add new bol input when clicked
                      setFieldValue("bol", [...values?.bol, { name: "" }]);
                    }}
                  />
                </Col>
              </Col>
              <Col style={{ textAlign: "end", marginTop: "15px" }}>
                <button
                  className="btn submit"
                  type="submit" // This ensures that the Formik onSubmit handler is triggered
                >
                  Save
                </button>
              </Col>
            </Col>
            {status === "loading" && <p>Saving category...</p>}
            {status === "failed" && (
              <p>
                Error: {typeof error === "string" ? error : "An error occurred"}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </LayoutHoc>
  );
}
