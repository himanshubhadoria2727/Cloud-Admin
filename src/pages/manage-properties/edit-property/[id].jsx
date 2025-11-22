"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LayoutHoc from "../../../HOC/LayoutHoc";
import styles from "../properties.module.css";
import { Col, Row, Select, Button, DatePicker, Spin, message, Switch } from "antd";
import LabelInputComponent from "../../../components/TextFields/labelInput";
import { FaBed, FaBath, FaHome, FaBuilding, FaWarehouse } from "react-icons/fa";
import {
  useGetPropertiesQuery,
  useEditPropertyMutation,
  useGetUniversitiesByLocationQuery,
} from "../../../redux/slices/apiSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import MyQuillEditor from "../../../components/TextFields/textArea";
import Image from "next/image";

const { Option } = Select;

export default function EditProperty() {
  const [editProperty] = useEditPropertyMutation();
  const router = useRouter();
  const { id } = router.query;
  const [universities, setUniversities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Check if id is defined before fetching property details
  const {
    data: propertyDetails,
    isLoading,
    error,
  } = useGetPropertiesQuery(id ? { id } : null);

  // Assuming propertyDetails is an array, take the first item
  const property = propertyDetails?.[0];

  // Set initial city and country when property is loaded
  useEffect(() => {
    if (property) {
      setSelectedCity(property.city || "");
      setSelectedCountry(property.country || "");
    }
  }, [property]);

  // Add debouncing for city and country changes
  const [debouncedCity, setDebouncedCity] = useState("");
  const [debouncedCountry, setDebouncedCountry] = useState("");

  // Handle city changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedCity) {
        setDebouncedCity(selectedCity);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [selectedCity]);

  // Handle country changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedCountry) {
        setDebouncedCountry(selectedCountry);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [selectedCountry]);

  // Fetch universities when debounced city or country changes
  const {
    data: universitiesData,
    isLoading: isLoadingUniversities,
    isFetching: isFetchingUniversities,
  } = useGetUniversitiesByLocationQuery(
    { city: debouncedCity, country: debouncedCountry },
    { skip: !debouncedCity || !debouncedCountry }
  );

  // Update universities when data is fetched
  useEffect(() => {
    if (universitiesData && Array.isArray(universitiesData)) {
      setUniversities(universitiesData.map((uni) => uni.name));
    }
  }, [universitiesData]);

  // Helper to handle city input change
  const handleCityChange = useCallback((e, setFieldValue) => {
    const cityValue = e.target.value;
    setFieldValue("city", cityValue);
    setSelectedCity(cityValue);
  }, []);

  // Helper to handle country selection
  const handleCountryChange = useCallback((value, setFieldValue) => {
    setFieldValue("country", value);
    setSelectedCountry(value);
  }, []);

  // Handle bedroom count changes
  const handleBedroomCountChange = (
    newCount,
    currentCount,
    setFieldValue,
    currentValues
  ) => {
    const currentBedrooms = currentValues?.bedroomDetails || [];
    if (newCount > currentCount) {
      // Add new bedroom
      setFieldValue("bedroomDetails", [
        ...currentBedrooms,
        {
          name: "",
          rent: "",
          sizeSqFt: "",
          furnished: false,
          privateWashroom: false,
          sharedWashroom: false,
          sharedKitchen: false,
          images: [],
          imageFiles: [],
          availableFrom: "",
          lease: "",
          moveInDate: "",
          note: "",
          leaseTerms: "",
        },
      ]);
    } else if (newCount < currentCount) {
      // Remove last bedroom
      setFieldValue("bedroomDetails", currentBedrooms.slice(0, newCount));
    }
    setFieldValue("bedrooms", newCount);
  };

  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching property details</div>;

  const initialValues = {
    propertyName: property?.title || "",
    squareFootage: property?.overview?.squareFeet || "",
    description: property?.description || "",
    homeType: property?.type || "",
    bedrooms: property?.overview?.bedrooms || 0,
    bathrooms: property?.overview?.bathrooms || 0,
    kitchens: property?.overview?.kitchen || 0,
    roomType: property?.overview?.roomType || "private",
    kitchenType: property?.overview?.kitchenType || "private",
    bathroomType: property?.overview?.bathroomType || "private",
    securityDeposit: property?.securityDeposit || "",
    bookingOptions: {
      allowSecurityDeposit:
        property?.bookingOptions?.allowSecurityDeposit || false,
      allowFirstRent: property?.bookingOptions?.allowFirstRent || false,
      allowFirstAndLastRent:
        property?.bookingOptions?.allowFirstAndLastRent || false,
    },
    instantBooking: property?.instantBooking || false,
    bookByEnquiry: property?.bookByEnquiry || false,
    ownership: property?.ownership !== false,
    renterAgreement: property?.renterAgreement !== false,
    landlordInsurance: property?.landlordInsurance !== false,
    amenities: property?.amenities || [],
    utilities: property?.utilities || [],
    photos: property?.images || [],
    pricing: property?.price || "",
    latitude: property?.latitude || "",
    longitude: property?.longitude || "",
    location: property?.location || "",
    city: property?.city || "",
    country: property?.country || "",
    locality: property?.locality || "",
    rentDetails: property?.rentDetails || "Details about rent",
    termsOfStay: property?.termsOfStay || "Terms of stay",
    cancellationPolicy: property?.cancellationPolicy || "Cancellation policy",
    yearOfConstruction: property?.overview?.yearOfConstruction || "",
    minimumStayDuration: property?.minimumStayDuration || "",
    availableFrom: property?.availableFrom || "",
    nearbyUniversities: property?.nearbyUniversities || [],
    bedroomDetails: property?.overview?.bedroomDetails
      ? property.overview.bedroomDetails.map((bedroom) => ({
          ...bedroom,
          images: bedroom.images || [],
          imageFiles: [], // Initialize empty array for actual file objects
          floor: bedroom.floor || "",
        }))
      : [],
    onSiteVerification: property?.onSiteVerification || false,
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
    roomType: Yup.string().required("Room type is required"),
    kitchenType: Yup.string().required("Kitchen type is required"),
    bathroomType: Yup.string().required("Bathroom type is required"),
    pricing: Yup.number().required("Pricing is required"),
    bookingOptions: Yup.object().shape({
      allowSecurityDeposit: Yup.boolean(),
      allowFirstRent: Yup.boolean(),
      allowFirstAndLastRent: Yup.boolean(),
    }),
    instantBooking: Yup.boolean(),
    ownership: Yup.bool().oneOf([true], "You must certify ownership"),
    renterAgreement: Yup.bool().oneOf(
      [true],
      "You must agree to this condition"
    ),
    landlordInsurance: Yup.bool().oneOf([true], "You must certify insurance"),
    amenities: Yup.array().min(1, "Select at least one amenity"),
    utilities: Yup.array(), // Add utilities validation
    pricing: Yup.number().required("Pricing is required"),
    location: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"), // Add country validation
    locality: Yup.string().required("Locality is required"), // Add locality validation
    rentDetails: Yup.string().required("Rent details are required"),
    termsOfStay: Yup.string().required("Terms of stay are required"),
    cancellationPolicy: Yup.string().required(
      "Cancellation policy is required"
    ),
    yearOfConstruction: Yup.number().required(
      "Year of construction is required"
    ),
    minimumStayDuration: Yup.string().required(
      "Minimum stay duration is required"
    ),
    availableFrom: Yup.string().required("Available from date is required"),
    nearbyUniversities: Yup.array(),
    bedroomDetails: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Bedroom name is required"),
        rent: Yup.number()
          .required("Rent is required")
          .typeError("Rent must be a number"),
        sizeSqFt: Yup.number()
          .required("Size is required")
          .typeError("Size must be a number"),
        // These fields are optional and don't require validation
        availableFrom: Yup.string(),
        lease: Yup.string(),
        moveInDate: Yup.date().nullable(),
        note: Yup.string(),
        leaseTerms: Yup.string(),
        floor: Yup.string(),
      })
    ),
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

  const utilitiesList = [
    "Water",
    "Electricity",
    "Gas",
    "Heating",
    "Air Conditioning",
    "Internet",
    "Cable TV",
    "Trash Collection",
    "Sewer",
    "Landscaping/Lawn Care",
    "Snow Removal",
    "Pest Control",
  ];

  const validateFileSize = (file) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `File "${file.name}" exceeds the 10MB limit. Please resize it before uploading.`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();

      // Basic property details
      formData.append("title", values.propertyName);
      formData.append("description", values.description);
      formData.append("price", values.pricing);
      formData.append("securityDeposit", values.securityDeposit);
      formData.append("type", values.homeType);

      // Location details
      formData.append("location", values.location);
      formData.append("city", values.city);
      formData.append("country", values.country);
      formData.append("locality", values.locality);
      formData.append("latitude", values.latitude || "0"); // Default to 0 if empty
      formData.append("longitude", values.longitude || "0"); // Default to 0 if empty

      // Arrays and objects
      formData.append("amenities", JSON.stringify(values.amenities || []));
      formData.append("utilities", JSON.stringify(values.utilities || []));
      formData.append(
        "nearbyUniversities",
        JSON.stringify(values.nearbyUniversities || [])
      );

      // Process bedroom details (remove the image data URLs which are just for previews)
      const bedroomDetailsWithoutImages = values.bedroomDetails.map(
        (bedroom) => {
          // Remove the images field (which contains data URLs) and imageFiles field
          // The imageFiles will be handled separately
          const { images, imageFiles, ...bedroomWithoutImages } = bedroom;

          // If the bedroom has existing URL images (not data URLs), attach them to the bedroom
          const existingUrls = Array.isArray(images)
            ? images.filter(
                (url) => typeof url === "string" && !url.startsWith("data:")
              )
            : [];

          return {
            ...bedroomWithoutImages,
            images: existingUrls, // Keep existing non-data URL images
          };
        }
      );

      // Add processed bedroom details to overview
      const overview = {
        bedrooms: parseInt(values.bedrooms),
        bathrooms: parseInt(values.bathrooms),
        squareFeet: parseInt(values.squareFootage),
        kitchen: values.kitchens,
        roomType: values.roomType,
        kitchenType: values.kitchenType,
        bathroomType: values.bathroomType,
        yearOfConstruction: parseInt(values.yearOfConstruction),
        bedroomDetails: bedroomDetailsWithoutImages,
      };

      // Important: stringify the overview object
      formData.append("overview", JSON.stringify(overview));

      // Text fields
      formData.append("rentDetails", values.rentDetails);
      formData.append("termsOfStay", values.termsOfStay);
      formData.append("cancellationPolicy", values.cancellationPolicy);

      // Booking options
      formData.append(
        "bookingOptions",
        JSON.stringify(values.bookingOptions || {})
      );
      formData.append("instantBooking", values.instantBooking);
      formData.append("bookByEnquiry", values.bookByEnquiry);

      // Verification flags
      formData.append("onSiteVerification", values.onSiteVerification);
      formData.append("ownership", values.ownership);
      formData.append("renterAgreement", values.renterAgreement);
      formData.append("landlordInsurance", values.landlordInsurance);

      // Availability
      formData.append("minimumStayDuration", values.minimumStayDuration);
      formData.append("availableFrom", values.availableFrom);

      // Handle main property images
      const existingPhotos = values.photos.filter(
        (photo) => typeof photo === "string"
      );
      const newPhotos = values.photos.filter((photo) => photo instanceof File);

      // Append existing images
      existingPhotos.forEach((photoUrl) => {
        formData.append("existingImages", photoUrl);
      });

      // Append new images
      newPhotos.forEach((photo) => {
        formData.append("images", photo);
      });

      // Handle bedroom images - use a simpler approach without complex indexing
      values.bedroomDetails.forEach((bedroom, roomIndex) => {
        // Only process bedrooms that have imageFiles
        if (
          bedroom.imageFiles &&
          bedroom.imageFiles.some((file) => file instanceof File)
        ) {
          // Add all files for this bedroom with the roomIndex in the fieldname
          bedroom.imageFiles.forEach((file) => {
            if (file instanceof File) {
              // Use a consistent and simple field name
              formData.append("images", file);
              // Also append metadata to identify which bedroom this image belongs to
              formData.append(
                `bedroom_image_index_${formData.getAll("images").length - 1}`,
                roomIndex
              );
            }
          });
        }
      });

      // Log the FormData contents for debugging
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ":", value.name, "(", value.size, "bytes )");
        } else {
          console.log(
            key,
            ":",
            typeof value === "string" && value.length > 100
              ? value.substring(0, 100) + "..."
              : value
          );
        }
      }

      // Make sure we have at least one main property image
      if (existingPhotos.length === 0 && newPhotos.length === 0) {
        throw new Error("Please add at least one image for the property");
      }

      const result = await editProperty({ id, data: formData }).unwrap();
      console.log("Property updated successfully:", result);
      toast.success("Property updated successfully");
      router.back();
    } catch (error) {
      console.error("Failed to update property:", error);
      const errorMessage =
        error.data?.message || error.message || "Failed to update property";
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
          enableReinitialize
        >
          {({ values, setFieldValue }) => {
            const handleImageChange = (e) => {
              const files = Array.from(e.target.files);
              const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
              const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

              // Check individual file sizes
              const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
              if (oversizedFiles.length > 0) {
                  toast.error(`Some images exceed the 10MB limit. Please resize them before uploading.`);
                  return;
              }

              // Check total size
              const totalSize = files.reduce((acc, file) => acc + file.size, 0);
              if (totalSize > MAX_TOTAL_SIZE) {
                  toast.error(`Total size of images exceeds 50MB. Please reduce the number of images or their size.`);
                  return;
              }

              setFieldValue("photos", [...values.photos, ...files]);
            };

            return (
            <Form className={styles.formCard}>
              <h3 className={styles.formTitle}>Basic Details</h3>
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

              <MyQuillEditor
                label="Description"
                name="description"
                setFieldValue={setFieldValue}
                height="300px"
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
                        onClick={() => {
                          const newValue = Math.max(0, values[field] - 1);
                          if (field === "bedrooms") {
                            handleBedroomCountChange(
                              newValue,
                              values[field],
                              setFieldValue,
                              values
                            );
                          } else {
                            setFieldValue(field, newValue);
                          }
                        }}
                      >
                        -
                      </button>
                      <span>{values[field]}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newValue = values[field] + 1;
                          if (field === "bedrooms") {
                            handleBedroomCountChange(
                              newValue,
                              values[field],
                              setFieldValue,
                              values
                            );
                          } else {
                            setFieldValue(field, newValue);
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bedroom Details Section */}
              {values.bedrooms > 0 && (
                <div className={styles.bedroomDetailsSection}>
                  <h3 className={styles.formTitle}>Bedroom Details</h3>
                  {values.bedroomDetails.map((bedroom, index) => (
                    <div key={index} className={styles.bedroomCard}>
                      <h4>Bedroom {index + 1}</h4>
                      <Row gutter={16}>
                        <Col span={8}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.name`}
                            title="Name"
                            placeholder="Enter bedroom name"
                            className={styles.labelinput}
                            value={values.bedroomDetails[index]?.name || ""}
                            onChange={(e) => {
                              const newDetails = [
                                ...(values.bedroomDetails || []),
                              ];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].name = e.target.value;
                              setFieldValue("bedroomDetails", newDetails);
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.rent`}
                            title="Rent"
                            placeholder="Enter rent amount"
                            className={styles.labelinput}
                            value={values.bedroomDetails[index]?.rent || ""}
                            onChange={(e) => {
                              const newDetails = [
                                ...(values.bedroomDetails || []),
                              ];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].rent = e.target.value;
                              setFieldValue("bedroomDetails", newDetails);
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.sizeSqFt`}
                            title="Size (sq ft)"
                            placeholder="Enter size in sq ft"
                            className={styles.labelinput}
                            value={values.bedroomDetails[index]?.sizeSqFt || ""}
                            onChange={(e) => {
                              const newDetails = [
                                ...(values.bedroomDetails || []),
                              ];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].sizeSqFt = e.target.value;
                              setFieldValue("bedroomDetails", newDetails);
                            }}
                          />
                        </Col>
                          <Col span={8}>
                            <LabelInputComponent
                              name={`bedroomDetails.${index}.floor`}
                              title="Floor"
                              placeholder="Enter floor (e.g. Ground, 1st, Basement)"
                              className={styles.labelinput}
                              value={values.bedroomDetails[index]?.floor || ""}
                              onChange={(e) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].floor = e.target.value;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                            />
                          </Col>
                      </Row>
                      <Row gutter={16} className={styles.checkboxRow}>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={
                                values.bedroomDetails[index]?.furnished || false
                              }
                              onChange={(e) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].furnished = e.target.checked;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                            />
                            Furnished
                          </label>
                        </Col>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={
                                values.bedroomDetails[index]?.privateWashroom ||
                                false
                              }
                              onChange={(e) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].privateWashroom =
                                  e.target.checked;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                            />
                            Private Washroom
                          </label>
                        </Col>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={
                                values.bedroomDetails[index]?.sharedWashroom ||
                                false
                              }
                              onChange={(e) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].sharedWashroom =
                                  e.target.checked;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                            />
                            Shared Washroom
                          </label>
                        </Col>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={
                                values.bedroomDetails[index]?.sharedKitchen ||
                                false
                              }
                              onChange={(e) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].sharedKitchen =
                                  e.target.checked;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                            />
                            Shared Kitchen
                          </label>
                        </Col>
                      </Row>

                      {/* New fields for bedroom details */}
                      <Row gutter={16} style={{ marginTop: "16px" }}>
                        <Col span={8}>
                          <div className={styles.dropdownContainer}>
                            <label className={styles.label}>
                              Available From
                            </label>
                            <Select
                              placeholder="Select month"
                              className={styles.dropdown}
                              value={
                                values.bedroomDetails[index]?.availableFrom ||
                                ""
                              }
                              onChange={(value) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].availableFrom = value;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                            >
                              {[
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                              ].map((month) => (
                                <Option key={month} value={month}>
                                  {month}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className={styles.dropdownContainer}>
                            <label className={styles.label}>Lease</label>
                            <Select
                              placeholder="Select lease type"
                              className={styles.dropdown}
                              value={values.bedroomDetails[index]?.lease || ""}
                              onChange={(value) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].lease = value;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                            >
                              <Option value="Month-to-Month">
                                Month-to-Month
                              </Option>
                              <Option value="6-Month">6-Month</Option>
                              <Option value="1-Year">1-Year</Option>
                            </Select>
                          </div>
                        </Col>
                        <Col span={8}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.moveInDate`}
                            title="Move-in Date"
                            type="date"
                            className={styles.labelinput}
                            value={
                              values.bedroomDetails[index]?.moveInDate || ""
                            }
                            onChange={(e) => {
                              const newDetails = [
                                ...(values.bedroomDetails || []),
                              ];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].moveInDate = e.target.value;
                              setFieldValue("bedroomDetails", newDetails);
                            }}
                          />
                        </Col>
                      </Row>

                      <Row gutter={16} style={{ marginTop: "16px" }}>
                        <Col span={12}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.note`}
                            title="Note"
                            placeholder="Enter any additional notes"
                            textarea
                            className={styles.labelinput}
                            value={values.bedroomDetails[index]?.note || ""}
                            onChange={(e) => {
                              const newDetails = [
                                ...(values.bedroomDetails || []),
                              ];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].note = e.target.value;
                              setFieldValue("bedroomDetails", newDetails);
                            }}
                          />
                        </Col>
                        <Col span={12}>
                          <div className={styles.quillEditorContainer}>
                            {/* <label className={styles.label}>Lease Terms</label> */}
                            <MyQuillEditor
                              label="Lease Terms"
                              name={`bedroomDetails.${index}.leaseTerms`}
                              setFieldValue={(name, value) => {
                                const newDetails = [
                                  ...(values.bedroomDetails || []),
                                ];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].leaseTerms = value;
                                setFieldValue("bedroomDetails", newDetails);
                              }}
                              compact={true}
                              height="150px"
                            />
                          </div>
                        </Col>
                      </Row>

                      {/* Add Status Switch */}
                      <Row gutter={16} style={{ marginTop: "16px" }}>
                        <Col span={24}>
                          <div className={styles.statusSwitchContainer}>
                            <label className={styles.label}>Bedroom Status</label>
                            <div className={styles.statusSwitch}>
                              <Switch
                                checked={values.bedroomDetails[index]?.status === 'booked'}
                                onChange={(checked) => {
                                  const newDetails = [
                                    ...(values.bedroomDetails || []),
                                  ];
                                  if (!newDetails[index]) newDetails[index] = {};
                                  newDetails[index].status = checked ? 'booked' : 'available';
                                  setFieldValue("bedroomDetails", newDetails);
                                }}
                                checkedChildren="Booked"
                                unCheckedChildren="Available"
                              />
                              <span className={styles.statusLabel}>
                                {values.bedroomDetails[index]?.status === 'booked' ? 'Booked' : 'Available'}
                              </span>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      {/* Bedroom Images Section */}
                      <div className={styles.bedroomImagesSection}>
                        <h5 className={styles.subSectionTitle}>
                          Bedroom Images
                        </h5>
                        <div className={styles.bedroomPhotoGrid}>
                          {Array.from({ length: 3 }).map((_, photoIndex) => (
                            <div
                              className={styles.bedroomPhotoBox}
                              key={photoIndex}
                            >
                              <label>
                                <input
                                  type="file"
                                  accept="image/jpeg, image/png, image/gif"
                                  onChange={(event) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                      // Validate file size
                                      if (!validateFileSize(file)) {
                                        return;
                                      }

                                      const newDetails = [
                                        ...(values.bedroomDetails || []),
                                      ];
                                      if (!newDetails[index])
                                        newDetails[index] = {};
                                      if (!newDetails[index].images)
                                        newDetails[index].images = [];

                                      // Store the actual file in a temporary field for submission
                                      if (!newDetails[index].imageFiles) {
                                        newDetails[index].imageFiles = [];
                                      }
                                      newDetails[index].imageFiles[photoIndex] =
                                        file;

                                      // Convert to URL for preview only
                                      const reader = new FileReader();
                                      reader.onload = (e) => {
                                        const images = [
                                          ...(newDetails[index].images || []),
                                        ];
                                        images[photoIndex] = e.target.result;
                                        newDetails[index].images = images;
                                        setFieldValue(
                                          "bedroomDetails",
                                          newDetails
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  style={{ display: "none" }}
                                />
                                {values.bedroomDetails[index]?.images?.[
                                  photoIndex
                                ] ? (
                                  <div className={styles.bedroomPreview}>
                                    <Image
                                      src={
                                        values.bedroomDetails[index].images[
                                          photoIndex
                                        ]
                                      }
                                      alt={`Bedroom ${index + 1} Image ${
                                        photoIndex + 1
                                      }`}
                                      width={100}
                                      height={100}
                                      objectFit="cover"
                                    />
                                    <button
                                      type="button"
                                      className={styles.removeButton}
                                      onClick={() => {
                                        const newDetails = [
                                          ...(values.bedroomDetails || []),
                                        ];
                                        const images = [
                                          ...(newDetails[index].images || []),
                                        ];
                                        images[photoIndex] = null;

                                        // Also clear the file
                                        if (newDetails[index].imageFiles) {
                                          newDetails[index].imageFiles[
                                            photoIndex
                                          ] = null;
                                        }

                                        newDetails[index].images = images;
                                        setFieldValue(
                                          "bedroomDetails",
                                          newDetails
                                        );
                                      }}
                                    >
                                      ✖
                                    </button>
                                  </div>
                                ) : (
                                  <div
                                    className={styles.bedroomPhotoPlaceholder}
                                  >
                                    <span className={styles.uploadIcon}>
                                      📤
                                    </span>
                                    <p>Add Image</p>
                                  </div>
                                )}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.verificationCheckbox}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="onSiteVerification"
                    checked={values.onSiteVerification}
                    onChange={(e) =>
                      setFieldValue("onSiteVerification", e.target.checked)
                    }
                  />
                  On-site Verification
                </label>
              </div>

              {/* Room Type Section */}
              <h3 className={styles.formTitle}>Room Type</h3>
              <Row gutter={16}>
                <Col span={8}>
                  <div className={styles.dropdownContainer}>
                    <label className={styles.label}>Room Type</label>
                    <Select
                      placeholder="Select room type"
                      className={styles.dropdown}
                      value={values.roomType}
                      onChange={(value) => setFieldValue("roomType", value)}
                    >
                      <Option value="private">Private Room</Option>
                      <Option value="shared">Shared Room</Option>
                    </Select>
                    <ErrorMessage name="roomType">
                      {(msg) => <div className={styles.error}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.dropdownContainer}>
                    <label className={styles.label}>Kitchen Type</label>
                    <Select
                      placeholder="Select kitchen type"
                      className={styles.dropdown}
                      value={values.kitchenType}
                      onChange={(value) => setFieldValue("kitchenType", value)}
                    >
                      <Option value="private">Private Kitchen</Option>
                      <Option value="shared">Shared Kitchen</Option>
                    </Select>
                    <ErrorMessage name="kitchenType">
                      {(msg) => <div className={styles.error}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.dropdownContainer}>
                    <label className={styles.label}>Bathroom Type</label>
                    <Select
                      placeholder="Select bathroom type"
                      className={styles.dropdown}
                      value={values.bathroomType}
                      onChange={(value) => setFieldValue("bathroomType", value)}
                    >
                      <Option value="private">Private Bathroom</Option>
                      <Option value="shared">Shared Bathroom</Option>
                    </Select>
                    <ErrorMessage name="bathroomType">
                      {(msg) => <div className={styles.error}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                </Col>
              </Row>

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

              {/* Utilities Section */}
              <h3 className={styles.formTitle}>Utilities Included</h3>
              <div className={styles.amenitiesGrid}>
                {utilitiesList.map((utility, index) => (
                  <div className={styles.amenityItem} key={index}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="utilities"
                        value={utility}
                        checked={values.utilities.includes(utility)}
                        onChange={() => {
                          const newUtilities = values.utilities.includes(
                            utility
                          )
                            ? values.utilities.filter(
                                (item) => item !== utility
                              )
                            : [...values.utilities, utility];
                          setFieldValue("utilities", newUtilities);
                        }}
                      />
                      {utility}
                    </label>
                  </div>
                ))}
              </div>
              <ErrorMessage name="utilities">
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
                onChange={(e) => handleCityChange(e, setFieldValue)}
              />

              {/* Add Country Dropdown */}
              <div className={styles.dropdownContainer}>
                <label className={styles.label}>Country</label>
                <Select
                  placeholder="Select country"
                  className={styles.dropdown}
                  value={values.country}
                  onChange={(value) =>
                    handleCountryChange(value, setFieldValue)
                  }
                >
                  <Option value="USA">United States (USD)</Option>
                  <Option value="India">India (INR)</Option>
                  <Option value="Canada">Canada (CAD)</Option>
                  <Option value="UK">United Kingdom (GBP)</Option>
                  <Option value="EU">European Union (EUR)</Option>
                  <Option value="Australia">Australia (AUD)</Option>
                </Select>
                <ErrorMessage name="country">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Locality Field - Appears based on city selection */}
              {values.city && (
                <div className={styles.dropdownContainer}>
                  <label className={styles.label}>Locality</label>
                  <Select
                    placeholder="Select locality"
                    className={styles.dropdown}
                    value={values.locality}
                    onChange={(value) => setFieldValue("locality", value)}
                  >
                    <Option value="Downtown">Downtown</Option>
                    <Option value="North">North</Option>
                    <Option value="East">East</Option>
                    <Option value="West">West</Option>
                    <Option value="South">South</Option>
                    <Option value="Suburbs">Suburbs</Option>
                    <Option value="Midtown">Midtown</Option>
                    <Option value="Central">Central</Option>
                    <Option value="Business District">Business District</Option>
                    <Option value="Residential Area">Residential Area</Option>
                    <Option value="Other">Other (Specify in Address)</Option>
                  </Select>
                  <ErrorMessage name="locality">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </div>
              )}

              {/* <Row gutter={16}>
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
              </Row> */}

              {/* House Rules Section */}
              <h3 className={styles.formTitle}>Pricing</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <LabelInputComponent
                    name="pricing"
                    title="Staring price"
                    placeholder="Enter staring price amount"
                    className={styles.labelinput}
                  />
                  <ErrorMessage name="pricing">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
                <Col span={12}>
                  <LabelInputComponent
                    name="securityDeposit"
                    title="Security Deposit"
                    placeholder="Enter security deposit amount"
                    className={styles.labelinput}
                  />
                  <ErrorMessage name="securityDeposit">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
              </Row>

              {/* Add booking options section */}
              <h3 className={styles.formTitle}>Booking Options</h3>
              <div className={styles.bookingOptionsContainer}>
                <h4 className={styles.sectionTitle}>Payment Options</h4>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentType"
                      checked={values.bookingOptions?.allowSecurityDeposit}
                      onChange={() => {
                        setFieldValue("bookingOptions", {
                          ...values.bookingOptions,
                          allowSecurityDeposit: true,
                          allowFirstRent: false,
                          allowFirstAndLastRent: false,
                        });
                      }}
                    />
                    Allow booking by security deposit
                  </label>
                </div>

                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentType"
                      checked={values.bookingOptions?.allowFirstRent}
                      onChange={() => {
                        setFieldValue("bookingOptions", {
                          ...values.bookingOptions,
                          allowSecurityDeposit: false,
                          allowFirstRent: true,
                          allowFirstAndLastRent: false,
                        });
                      }}
                    />
                    Allow booking by First Rent
                  </label>
                </div>

                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="paymentType"
                      checked={values.bookingOptions?.allowFirstAndLastRent}
                      onChange={() => {
                        setFieldValue("bookingOptions", {
                          ...values.bookingOptions,
                          allowSecurityDeposit: false,
                          allowFirstRent: false,
                          allowFirstAndLastRent: true,
                        });
                      }}
                    />
                    Allow booking by First and Last rent
                  </label>
                </div>

                <div className={styles.bookingTypeSection}>
                  <h4 className={styles.sectionTitle}>Booking Type</h4>
                  <div className={styles.bookingTypeOptions}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="bookingType"
                        checked={values.instantBooking}
                        onChange={() => {
                          setFieldValue("instantBooking", true);
                          setFieldValue("bookByEnquiry", false);
                        }}
                      />
                      Instant Booking
                    </label>

                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="bookingType"
                        checked={values.bookByEnquiry}
                        onChange={() => {
                          setFieldValue("bookByEnquiry", true);
                          setFieldValue("instantBooking", false);
                        }}
                      />
                      Book by Enquiry
                    </label>
                  </div>
                </div>
              </div>
              {/* Cancellation Policy Section */}
              <h3 className={styles.formTitle}>Cancellation Policy</h3>
              <MyQuillEditor
                label="Cancellation Policy"
                name="cancellationPolicy"
                placeholder="Enter cancellation policy details"
                setFieldValue={setFieldValue}
                height="250px"
              />
              <ErrorMessage name="cancellationPolicy">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>
              {/* Rent Details Section */}
              <h3 className={styles.formTitle}>Rent Details</h3>
              <MyQuillEditor
                label="Rent Details"
                name="rentDetails"
                placeholder="Rent Details"
                setFieldValue={setFieldValue}
                height="250px"
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
                height="250px"
              />
              <ErrorMessage name="termsOfStay">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              {/* Year of Construction */}
              <h3 className={styles.formTitle}>Year of Construction</h3>
              <LabelInputComponent
                name="yearOfConstruction"
                title="Year of Construction"
                placeholder="Enter year of construction"
                className={styles.labelinput}
              />
              <ErrorMessage name="yearOfConstruction">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>

              {/* Minimum Stay Duration */}
              <div className={styles.dropdownContainer}>
                <label className={styles.label}>Minimum Stay Duration</label>
                <Select
                  placeholder="Select minimum stay duration"
                  className={styles.dropdown}
                  value={values.minimumStayDuration}
                  onChange={(value) =>
                    setFieldValue("minimumStayDuration", value)
                  }
                >
                  <Select.Option value="Month-to-Month">
                    Month-to-Month
                  </Select.Option>

                  {/* Quarter 1 Ranges */}
                  <Select.Option value="Jan to Mar">
                    Jan to Mar (Q1)
                  </Select.Option>
                  <Select.Option value="Jan to Jun">
                    Jan to Jun (Q1-Q2)
                  </Select.Option>
                  <Select.Option value="Jan to Sep">
                    Jan to Sep (Q1-Q3)
                  </Select.Option>
                  <Select.Option value="Jan to Dec">
                    Jan to Dec (Full Year)
                  </Select.Option>
                  <Select.Option value="Feb to Apr">Feb to Apr</Select.Option>
                  <Select.Option value="Feb to Jul">Feb to Jul</Select.Option>
                  <Select.Option value="Feb to Dec">Feb to Dec</Select.Option>
                  <Select.Option value="Mar to May">Mar to May</Select.Option>
                  <Select.Option value="Mar to Aug">Mar to Aug</Select.Option>
                  <Select.Option value="Mar to Dec">Mar to Dec</Select.Option>

                  {/* Quarter 2 Ranges */}
                  <Select.Option value="Apr to Jun">
                    Apr to Jun (Q2)
                  </Select.Option>
                  <Select.Option value="Apr to Sep">
                    Apr to Sep (Q2-Q3)
                  </Select.Option>
                  <Select.Option value="Apr to Dec">
                    Apr to Dec (Q2-Q4)
                  </Select.Option>
                  <Select.Option value="May to Jul">May to Jul</Select.Option>
                  <Select.Option value="May to Oct">May to Oct</Select.Option>
                  <Select.Option value="May to Dec">May to Dec</Select.Option>
                  <Select.Option value="Jun to Aug">Jun to Aug</Select.Option>
                  <Select.Option value="Jun to Nov">Jun to Nov</Select.Option>
                  <Select.Option value="Jun to Dec">Jun to Dec</Select.Option>

                  {/* Quarter 3 Ranges */}
                  <Select.Option value="Jul to Sep">
                    Jul to Sep (Q3)
                  </Select.Option>
                  <Select.Option value="Jul to Dec">
                    Jul to Dec (Q3-Q4)
                  </Select.Option>
                  <Select.Option value="Aug to Oct">Aug to Oct</Select.Option>
                  <Select.Option value="Aug to Dec">Aug to Dec</Select.Option>
                  <Select.Option value="Sep to Nov">Sep to Nov</Select.Option>
                  <Select.Option value="Sep to Dec">Sep to Dec</Select.Option>

                  {/* Quarter 4 Ranges */}
                  <Select.Option value="Oct to Dec">
                    Oct to Dec (Q4)
                  </Select.Option>
                  <Select.Option value="Nov to Dec">Nov to Dec</Select.Option>

                  {/* General Durations */}
                  <Select.Option value="Less than 6 months">
                    Less than 6 months
                  </Select.Option>
                  <Select.Option value="6-12 months">6-12 months</Select.Option>
                  <Select.Option value="1 year+">1 year+</Select.Option>
                </Select>
                <ErrorMessage name="minimumStayDuration">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Available From */}
              <div className={styles.dropdownContainer}>
                <label className={styles.label}>Available From</label>
                <Select
                  placeholder="Select availability month"
                  className={styles.dropdown}
                  value={values.availableFrom}
                  onChange={(value) => setFieldValue("availableFrom", value)}
                >
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((month) => (
                    <Option key={month} value={month}>
                      {month}
                    </Option>
                  ))}
                </Select>
                <ErrorMessage name="availableFrom">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Nearby Universities */}
              <h3 className={styles.formTitle}>Nearby Universities</h3>
              <div className={styles.amenitiesGrid}>
                {isLoadingUniversities || isFetchingUniversities ? (
                  <div>Loading universities...</div>
                ) : universities.length > 0 ? (
                  universities.map((university, index) => (
                    <div className={styles.amenityItem} key={index}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="nearbyUniversities"
                          value={university}
                          checked={values.nearbyUniversities.includes(
                            university
                          )}
                          onChange={() => {
                            const newUniversities =
                              values.nearbyUniversities.includes(university)
                                ? values.nearbyUniversities.filter(
                                    (item) => item !== university
                                  )
                                : [...values.nearbyUniversities, university];
                            setFieldValue(
                              "nearbyUniversities",
                              newUniversities
                            );
                          }}
                        />
                        {university}
                      </label>
                    </div>
                  ))
                ) : (
                  <div>
                    {debouncedCity && debouncedCountry
                      ? "No universities found for the selected location."
                      : "Enter a city and select a country to see universities."}
                  </div>
                )}
              </div>
              <ErrorMessage name="nearbyUniversities">
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
                <div
                  className={styles.photoDropZone}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(styles.dragOver);
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove(styles.dragOver);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.dragOver);

                    const files = Array.from(e.dataTransfer.files);
                    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

                    // Filter only image files
                    const imageFiles = files.filter(file =>
                      file.type === 'image/jpeg' ||
                      file.type === 'image/png' ||
                      file.type === 'image/gif' ||
                      file.type === 'image/webp'
                    );

                    if (imageFiles.length === 0) {
                      toast.error('Please drop only image files (JPG, PNG, GIF, WebP)');
                      return;
                    }

                    // Check individual file sizes
                    const oversizedFiles = imageFiles.filter(file => file.size > MAX_FILE_SIZE);
                    if (oversizedFiles.length > 0) {
                      toast.error(`${oversizedFiles.length} image(s) exceed the 10MB limit. Please resize them before uploading.`);
                      return;
                    }

                    // Filter out null values and add new files
                    const currentPhotos = values.photos.filter(photo => photo !== null);
                    const newPhotos = [...currentPhotos, ...imageFiles];

                    if (newPhotos.length > 100) {
                      toast.warning('Maximum 100 photos allowed. Only added as many as possible.');
                      setFieldValue("photos", newPhotos.slice(0, 100));
                    } else {
                      setFieldValue("photos", newPhotos);
                    }
                    toast.success(`${imageFiles.length} photo(s) added successfully!`);
                  }}
                >
                  <label className={styles.dropZoneLabel}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

                        // Check individual file sizes
                        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
                        if (oversizedFiles.length > 0) {
                          toast.error(`${oversizedFiles.length} image(s) exceed the 10MB limit. Please resize them before uploading.`);
                          return;
                        }

                        // Filter out null values and add new files
                        const currentPhotos = values.photos.filter(photo => photo !== null);
                        const newPhotos = [...currentPhotos, ...files];

                        if (newPhotos.length > 100) {
                          toast.warning('Maximum 100 photos allowed. Only added as many as possible.');
                          setFieldValue("photos", newPhotos.slice(0, 100));
                        } else {
                          setFieldValue("photos", newPhotos);
                        }

                        if (files.length > 0) {
                          toast.success(`${files.length} photo(s) added successfully!`);
                        }
                        // Reset input to allow re-selecting same files
                        e.target.value = '';
                      }}
                      style={{ display: "none" }}
                    />
                    <div className={styles.dropZoneContent}>
                      <div className={styles.uploadIconWrapper}>
                        <svg className={styles.uploadSvgIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className={styles.uploadMainHeading}>Upload Your Photos</h2>
                      <p className={styles.uploadSubtext}>Drag & drop images or click to browse</p>
                      <span className={styles.dropZoneHint}>JPG, PNG, GIF or WebP (Max 10MB per file, up to 100 photos)</span>
                    </div>
                  </label>

                  {/* Preview Grid - Show after upload */}
                  {values.photos.filter(photo => photo !== null).length > 0 && (
                    <div className={styles.uploadedPhotosSection}>
                      <div className={styles.photoCountBadge}>
                        📸 {values.photos.filter(photo => photo !== null).length}/{100} Photos Uploaded
                      </div>
                      <div className={styles.photoPreviewGrid}>
                        {values.photos.map((photo, index) => {
                          if (!photo) return null;
                          return (
                            <div className={styles.photoPreviewBox} key={index}>
                              <div className={styles.preview}>
                                <Image
                                  src={
                                    typeof photo === "string"
                                      ? photo
                                      : URL.createObjectURL(photo)
                                  }
                                  alt={`Preview ${index + 1}`}
                                  width={200}
                                  height={200}
                                  objectFit="cover"
                                />
                                <button
                                  type="button"
                                  className={styles.removeButton}
                                  onClick={() => {
                                    const newPhotos = values.photos.filter((_, i) => i !== index);
                                    setFieldValue("photos", newPhotos);
                                    toast.info('Photo removed');
                                  }}
                                  title="Remove this photo"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className={styles.photoNumber}>
                                #{index + 1}
                                {typeof photo !== "string" && (
                                  <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                                    {(photo.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                )}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <ErrorMessage name="photos">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
              </div>

              {/* On-site Verification Checkbox */}
              {/* <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="onSiteVerification"
                    checked={values.onSiteVerification}
                    onChange={(e) =>
                      setFieldValue("onSiteVerification", e.target.checked)
                    }
                  />
                  On-site Verification Required
                </label>
              </div> */}

              <div className={styles.submitButtonContainer}>
                <button className={styles.submitButton} type="submit">
                  Save
                </button>
              </div>
            </Form>
            );
          }}
        </Formik>
      </div>
    </LayoutHoc>
  );
}
