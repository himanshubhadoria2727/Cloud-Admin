import LayoutHoc from "@/HOC/LayoutHoc";
import { Col } from "antd";
import styles from "../add-content.module.css";
import React, { useState } from "react";
import LabelInputComponent from "@/components/TextFields/labelInput";
import MyQuillEditor from "@/components/TextFields/textArea";
import FilledButtonComponent from "@/components/Button";
import { SVG } from "@/assest/svg";
import Link from "next/link";
import BannerUpload from "../component/BannerUpload";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { addContent } from "@/api/contentapi"; // Import the addContent function
import { toast } from "react-toastify";

export default function AddContent() {
  const router = useRouter();
  const [image, setImage] = useState(null);

  // Initialize state for form values
  const [initialState, setInitialState] = useState({
    title: "",
    bannerImage: null, // Changed to null to allow file uploads
    description: "",
  });
  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Add Content</h3>
        <Link href="/manage-content">
          <FilledButtonComponent>
            <SVG.Arrow /> Back
          </FilledButtonComponent>
        </Link>
      </Col>
      <Col className="tableBox">
        <Col>
          <Formik
            initialValues={initialState}
            onSubmit={(values) => {
              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("description", values.description);

              // Ensure bannerImage is appended only if it exists and is a File object
              formData.append("bannerImage", values.bannerImage); // Append bannerImage

              addContent(formData) // Call the addContent function
                .then((data) => {
                  if (data) {
                    toast.success("Content added successfully"); // Success message
                  }
                  router.push("/manage-content");
                })
                .catch((err) => {
                  toast.error("Something went wrong"); // Error message
                  console.log(err);
                });
            }}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <LabelInputComponent title="Heading" name="title" />
                <BannerUpload
                  title="Manage Banner"
                  addimage={setFieldValue}
                  image={values?.bannerImage}
                />
                <MyQuillEditor
                  label="Description"
                  name="description"
                  setFieldValue={setFieldValue}
                />
                <Col
                  style={{
                    textAlign: "end",
                    marginTop: "20px",
                    marginBottom: "15px",
                  }}
                >
                  <button className="btn submit" type="submit">
                    Save
                  </button>
                </Col>
              </Form>
            )}
          </Formik>
        </Col>
      </Col>
    </LayoutHoc>
  );
}
