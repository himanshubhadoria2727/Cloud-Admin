import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LayoutHoc from "@/HOC/LayoutHoc";
import styles from "../properties.module.css";
import { Col, Row, Select } from "antd";
import LabelInputComponent from "@/components/TextFields/labelInput";
import FilledButtonComponent from "@/components/Button";
import { FaBed, FaBath, FaHome, FaBuilding, FaWarehouse } from "react-icons/fa";

const { Option } = Select;

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
    amenities: Yup.array().min(1, "Select at least one amenity"),
  });

  const amenitiesList = [
    "Air Conditioning",
    "Swimming Pool",
    "Gym",
    "Fireplace",
    "Garden",
    "Garage",
    "Basement",
    "Walk-in Closet",
    "Balcony",
    "Rooftop",
    "Smart Home Features",
    "High-Speed Internet",
    "Security System",
    "Washer/Dryer",
    "Elevator",
    "Hardwood Floors",
    "Pet Friendly",
    "Solar Panels",
    "Wheelchair Accessible",
  ];

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
            renterAgreement: false,
            landlordInsurance: false,
            amenities: [],
            photos: Array(10).fill(null), 
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className={styles.formCard}>
              <h3 className={styles.formTitle}>Description</h3>
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

              {/* Home Type Dropdown */}
              <div className={styles.dropdownContainer}>
                <label className={styles.label}>Home Type</label>
                <Select
                  placeholder="Select home type"
                  className={styles.dropdown}
                  value={values.homeType}
                  onChange={(value) => setFieldValue("homeType", value)}
                >
                  <Option value="apartment">
                    <FaBuilding style={{ marginRight: "8px" }} />
                    Apartment
                  </Option>
                  <Option value="house">
                    <FaHome style={{ marginRight: "8px" }} />
                    House
                  </Option>
                  <Option value="villa">
                    <FaHome style={{ marginRight: "8px" }} />
                    Villa
                  </Option>
                  <Option value="studio">
                    <FaWarehouse style={{ marginRight: "8px" }} />
                    Studio
                  </Option>
                </Select>
                <ErrorMessage name="homeType">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Counter for Bedrooms, Bathrooms, and Kitchens */}
              <div className={styles.counterGroup}>
                {["bedrooms", "bathrooms", "kitchens"].map((field) => (
                  <div className={styles.counter} key={field}>
                    <label>
                      {field === "bedrooms" && <><FaBed style={{ marginRight: "8px" }} /> Bedrooms</>}
                      {field === "bathrooms" && <><FaBath style={{ marginRight: "8px" }} /> Bathrooms</>}
                      {field === "kitchens" && <>Kitchens</>}
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

              {/* Amenities Section */}
              <h3 className={styles.formTitle}>Amenities</h3>
              <div className={styles.amenitiesGrid}>
                {amenitiesList.map((amenity, index) => (
                  <div className={styles.amenityItem} key={index}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="amenities"
                        value={amenity}
                        checked={values.amenities.includes(amenity)}
                        onChange={() => {
                          const newAmenities = values.amenities.includes(amenity)
                            ? values.amenities.filter((item) => item !== amenity)
                            : [...values.amenities, amenity];
                          setFieldValue("amenities", newAmenities);
                        }}
                      />
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
              <ErrorMessage name="amenities">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              {/* House Rules Section */}
              <h3 className={styles.formTitle}>House Rules</h3>
              <LabelInputComponent
                name="houseRules"
                title="House Rules"
                placeholder="Describe your house rules"
                textarea
                className={styles.largeTextarea}
              />
              <ErrorMessage name="houseRules">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              {/* Address Section */}
              <h3 className={styles.formTitle}>Location</h3>
              <LabelInputComponent
                name="address"
                title="Address"
                placeholder="Enter your address..."
                textarea
                className={styles.labelinput}
              />

              <LabelInputComponent
                name="apartment"
                title="Apartment, suit, building, flat no. etc (optional)"
                placeholder="Enter your apartment, suit, building, flat no. etc"
                textarea
                className={styles.labelinput}
              />

              <Row gutter={16}>
                <Col span={12}>
                  <LabelInputComponent
                    name="longitude"
                    title="Longitude"
                    placeholder="Enter longitude"
                    className={styles.labelinput}
                  />
                  <ErrorMessage name="longitude">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
                <Col span={12}>
                  <LabelInputComponent
                    name="latitude"
                    title="Latitude"
                    placeholder="Enter latitude"
                    className={styles.labelinput}
                  />
                  <ErrorMessage name="latitude">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
              </Row>

              {/* House Rules Section */}
              <h3 className={styles.formTitle}>Pricing</h3>
              <LabelInputComponent
                name="pricing"
                title="Write in your fare market value"
                placeholder="Let us know the fair market value today"
                textarea
                className={styles.largeTextarea}
              />
              <ErrorMessage name="pricing">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              {/* Agreement Section */}
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
                    checked={values.renterAgreement}
                    onChange={(e) => setFieldValue("renterAgreement", e.target.checked)}
                  />
                  I agree that I will have any renter who contacts me through Rent-to-Own Realty book the rental through Rent-to-Own Realty.
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="landlordInsurance"
                    checked={values.landlordInsurance}
                    onChange={(e) => setFieldValue("landlordInsurance", e.target.checked)}
                  />
                  I certify that I have landlord insurance on this property.
                </label>
              </div>

              {/* Add Photos Section */}
              <h3 className={styles.formTitle}>Photos (minimum add 2 photos)</h3>
              <div className={styles.photoUploadSection}>
                <div className={styles.photoUploadGrid}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div className={styles.photoUploadBox} key={index}>
                      <label>
                        <input
                          type="file"
                          name={`photos[${index}]`}
                          accept="image/jpeg, image/png, image/gif"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            if (file) {
                              setFieldValue(`photos.${index}`, file);
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <div className={styles.photoUploadPlaceholder}>
                          <span className={styles.uploadIcon}>📤</span>
                          <p>Choose an image</p>
                          <p>JPG, PNG, GIF, Max 10 MB</p>
                        </div>
                      </label>
                      {values.photos[index] && (
                        <div className={styles.preview}>
                          <img
                            src={URL.createObjectURL(values.photos[index])}
                            alt={`Preview ${index + 1}`}
                          />
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => setFieldValue(`photos.${index}`, null)}
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <ErrorMessage name="photos">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
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
