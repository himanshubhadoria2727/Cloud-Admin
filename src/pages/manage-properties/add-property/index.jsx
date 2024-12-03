import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LayoutHoc from "@/HOC/LayoutHoc";
import styles from "../properties.module.css";
import { Col, Row } from "antd";
import LabelInputComponent from "@/components/TextFields/labelInput";
import SelectDropdownComponent from "@/components/TextFields/selectDropdown";
import FilledButtonComponent from "@/components/Button";
import { FaBed, FaBath } from "react-icons/fa";

export default function AddProperty() {
  const validationSchema = Yup.object().shape({
    propertyName: Yup.string().required("Property name is required"),
    squareFootage: Yup.number()
      .typeError("Approximate square footage must be a number")
      .required("Square footage is required"),
    description: Yup.string().required("Description is required"),
    homeType: Yup.string().required("Home type is required"),
    bedrooms: Yup.number().min(0, "Bedrooms cannot be negative"),
    bathrooms: Yup.number().min(0, "Bathrooms cannot be negative"),
    kitchens: Yup.number().min(0, "Kitchens cannot be negative"),
    ownership: Yup.bool().oneOf([true], "You must certify ownership"),
    renterAgreement: Yup.bool().oneOf([true], "You must agree to this condition"),
    landlordInsurance: Yup.bool().oneOf([true], "You must certify insurance"),
  });

  const handleSubmit = (values) => {
    console.log("Form Values:", values);
    // Handle submission logic
  };

  return (
    <LayoutHoc>
      <div className={styles.container}>
        <h2 className={styles.title}>Add Property</h2>
        <Formik
          initialValues={{
            propertyName: "",
            squareFootage: "",
            description: "",
            homeType: "",
            bedrooms: 0,
            bathrooms: 0,
            kitchens: 0,
            ownership: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className={styles.formCard}>
              <h3 className={styles.formTitle}>Add Your Home</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <LabelInputComponent
                    name="propertyName"
                    title="Property Name"
                    placeholder="Enter property name"
                    className={styles.labelinput}
                  />
                  <ErrorMessage name="propertyName">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
                <Col span={12}>
                  <LabelInputComponent
                    name="squareFootage"
                    title="Square Footage"
                    placeholder="Enter square footage"
                    className={styles.labelinput}
                  />
                  <ErrorMessage name="squareFootage">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
              </Row>

              <LabelInputComponent
                name="description"
                title="Description"
                placeholder="Describe your home"
                textarea
                className={styles.labelinput}
              />
              <ErrorMessage name="description">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              <SelectDropdownComponent
                name="homeType"
                title="Home Type"
                placeholder="Select home type"
                options={["Apartment", "Condo", "Single-Family", "Townhouse", "Villa", "Cottage"]}
                className={styles.dropdown_menu}
              />

              <ErrorMessage name="homeType">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              <div className={styles.counterGroup}>
                {["bedrooms", "bathrooms", "kitchens"].map((field) => (
                  <div className={styles.counter} key={field}>
                    <label>
                      {field === "bedrooms" && "Bedrooms"}
                      {field === "bathrooms" && "Bathrooms"}
                      {field === "kitchens" && "Kitchens"}
                    </label>
                    <div className={styles.counterControls}>
                      <button
                        type="button"
                        onClick={() => setFieldValue(field, Math.max(0, values[field] - 1))}
                      >
                        -
                      </button>
                      <span>{values[field]}</span>
                      <button
                        type="button"
                        onClick={() => setFieldValue(field, values[field] + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="ownership"
                    checked={values.ownership}
                    onChange={(e) => setFieldValue("ownership", e.target.checked)}
                  />
                  I certify that I own this property or am an authorized representative of the owner.
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="renterAgreement"
                    onChange={(e) => setFieldValue("renterAgreement", e.target.checked)}
                  />
                  I agree that I will have any renter who contacts me through Rent-to-Own Realty book the rental through Rent-to-Own Realty.
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="landlordInsurance"
                    onChange={(e) => setFieldValue("landlordInsurance", e.target.checked)}
                  />
                  I certify that I have landlord's insurance on this property.
                </label>
              </div>

              <div className={styles.submitButtonContainer}>
                <FilledButtonComponent className={styles.submitButton} type="submit">
                  Save
                </FilledButtonComponent>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </LayoutHoc>
  );
}

