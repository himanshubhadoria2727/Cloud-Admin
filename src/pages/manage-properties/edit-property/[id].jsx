"use client";

import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LayoutHoc from "../../../HOC/LayoutHoc";
import styles from "../properties.module.css";
import { Col, Row, Select } from "antd";
import LabelInputComponent from "../../../components/TextFields/labelInput";
import { FaBed, FaBath, FaHome, FaBuilding, FaWarehouse } from "react-icons/fa";
import {
  useGetPropertiesQuery,
  useEditPropertyMutation,
} from "../../../redux/slices/apiSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import MyQuillEditor from "../../../components/TextFields/textArea";

const { Option } = Select;

export default function AddProperty() {
  const [editProperty] = useEditPropertyMutation();
  const router = useRouter();
  const { id } = router.query;

  // Check if id is defined before fetching property details
  const {
    data: propertyDetails,
    isLoading,
    error,
  } = useGetPropertiesQuery(id ? { id } : null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching property details</div>;

  // Assuming propertyDetails is an array, take the first item
  const property = propertyDetails[0];

  const initialValues = {
    propertyName: property?.title || "",
    squareFootage: property?.overview?.squareFeet || "",
    description: property?.description || "",
    homeType: property?.type || "",
    bedrooms: property?.overview?.bedrooms || 0,
    bathrooms: property?.overview?.bathrooms || 0,
    kitchens: property?.overview?.kitchen || 0,
    ownership: false, // Assuming this is not part of the fetched data
    renterAgreement: false, // Assuming this is not part of the fetched data
    landlordInsurance: false, // Assuming this is not part of the fetched data
    amenities: property?.amenities ? JSON.parse(property.amenities[0]) : [], // Parse the amenities
    photos: property?.images || Array(10).fill(null), // Initialize with fetched image URLs or nulls
    pricing: property?.price || "",
    latitude: property?.latitude || "",
    longitude: property?.longitude || "",
    location: property?.location || "",
    city: property?.city || "",
    rentDetails: property?.rentDetails, // Add default value
    termsOfStay: property?.termsOfStay, // Add default value
  };

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
    renterAgreement: Yup.bool().oneOf(
      [true],
      "You must agree to this condition"
    ),
    landlordInsurance: Yup.bool().oneOf([true], "You must certify insurance"),
    amenities: Yup.array().min(1, "Select at least one amenity"),
    pricing: Yup.number().required("Pricing is required"),
    latitude: Yup.number().required("Latitude is required"),
    longitude: Yup.number().required("Longitude is required"),
    location: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log("submit is pressed");

    try {
      const formData = new FormData();

      // Add basic property details
      formData.append("title", values.propertyName);
      formData.append("squareFootage", values.squareFootage);
      formData.append("description", values.description);
      formData.append("price", values.pricing);
      formData.append("latitude", values.latitude);
      formData.append("longitude", values.longitude);
      formData.append("type", values.homeType);
      formData.append("location", values.location);
      formData.append("city", values.city);
      // Add amenities as JSON string
      formData.append("amenities", JSON.stringify(values.amenities || []));

      // Create and add overview object as JSON string
      const overview = {
        bedrooms: parseInt(values.bedrooms),
        bathrooms: parseInt(values.bathrooms),
        squareFeet: parseInt(values.squareFootage),
        kitchen: values.kitchens,
        yearOfConstruction: new Date().getFullYear(),
      };
      formData.append("overview", JSON.stringify(overview));

      // Add required string fields with default values if not provided
      formData.append(
        "rentDetails",
        values.rentDetails || "Details about rent"
      );
      formData.append("termsOfStay", values.termsOfStay || "Terms of stay");

      // Add images - filter out null values and append each valid image
      const validPhotos = values.photos.filter((photo) => photo !== null);
      validPhotos.forEach((photo) => {
        formData.append("images", photo);
      });

      const result = await editProperty({ id, data: formData }).unwrap();
      console.log("Property updated successfully:", result);
      toast.success("Property updated successfully");
      router.back();
    } catch (error) {
      console.error("Failed to update property:", error);
      const errorMessage = error.data?.message || "Failed to update property";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LayoutHoc>
      <div className={styles.container}>
        <h2 className={styles.title}>Edit Property</h2>
        <Formik
          initialValues={initialValues}
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
                      {field === "bedrooms" && (
                        <>
                          <FaBed style={{ marginRight: "8px" }} /> Bedrooms
                        </>
                      )}
                      {field === "bathrooms" && (
                        <>
                          <FaBath style={{ marginRight: "8px" }} /> Bathrooms
                        </>
                      )}
                      {field === "kitchens" && <>Kitchens</>}
                    </label>
                    <div className={styles.counterControls}>
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(field, Math.max(0, values[field] - 1))
                        }
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
                          const newAmenities = values.amenities.includes(
                            amenity
                          )
                            ? values.amenities.filter(
                                (item) => item !== amenity
                              )
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

              {/* Address Section */}
              <h3 className={styles.formTitle}>Location</h3>
              <LabelInputComponent
                name="location"
                title="Address"
                placeholder="Enter your location..."
                textarea
                className={styles.labelinput}
              />

              <LabelInputComponent
                name="city"
                title="City"
                placeholder="Enter your city"
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

              {/* Rent Details Section */}
              <h3 className={styles.formTitle}>Rent Details</h3>
              <MyQuillEditor
                label="Rent Details"
                name="rentDetails"
                placeholder="Rent Details"
                setFieldValue={setFieldValue}
              />
              <ErrorMessage name="rentDetails">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              {/* Terms of Stay Section */}
              <h3 className={styles.formTitle}>Terms of Stay</h3>
              <MyQuillEditor
                label="Terms of Stay"
                name="termsOfStay"
                setFieldValue={setFieldValue}
              />
              <ErrorMessage name="termsOfStay">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              {/* Agreement Section */}
              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="ownership"
                    checked={values.ownership}
                    onChange={(e) =>
                      setFieldValue("ownership", e.target.checked)
                    }
                  />
                  I certify that I own this property or am an authorized
                  representative of the owner.
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="renterAgreement"
                    checked={values.renterAgreement}
                    onChange={(e) =>
                      setFieldValue("renterAgreement", e.target.checked)
                    }
                  />
                  I agree that I will have any renter who contacts me through
                  Rent-to-Own Realty book the rental through Rent-to-Own Realty.
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="landlordInsurance"
                    checked={values.landlordInsurance}
                    onChange={(e) =>
                      setFieldValue("landlordInsurance", e.target.checked)
                    }
                  />
                  I certify that I have landlord insurance on this property.
                </label>
              </div>

              {/* Add Photos Section */}
              <h3 className={styles.formTitle}>
                Photos (minimum add 2 photos)
              </h3>
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
                            } else {
                              setFieldValue(`photos.${index}`, null);
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
                            // Add a guard clause
                            src={
                              typeof values.photos[index] === "string"
                                ? values.photos[index]
                                : URL.createObjectURL(values.photos[index])
                            }
                            alt={`Preview ${index + 1}`}
                          />
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() =>
                              setFieldValue(`photos.${index}`, null)
                            }
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
                <button className={styles.submitButton} type="submit">
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </LayoutHoc>
  );
}
