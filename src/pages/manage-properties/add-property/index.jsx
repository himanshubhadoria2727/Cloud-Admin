import React, { useEffect, useState, useCallback } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LayoutHoc from "@/HOC/LayoutHoc";
import styles from "../properties.module.css";
import { Col, Row, Select } from "antd";
import LabelInputComponent from "@/components/TextFields/labelInput";
import { FaBed, FaBath, FaHome, FaBuilding, FaWarehouse } from "react-icons/fa";
import {
  useGetPropertiesQuery,
  useCreatePropertyMutation,
  useGetUniversitiesByLocationQuery,
} from "../../../redux/slices/apiSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import MyQuillEditor from "../../../components/TextFields/textArea";
import Image from "next/image";

const { Option } = Select;

export default function AddProperty() {
  const router = useRouter();
  const { id } = router.query || {};
  const [createProperty] = useCreatePropertyMutation();
  const [universities, setUniversities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const {
    data: property,
    isLoading,
    error,
  } = useGetPropertiesQuery(id ? { id } : null);

  // Add debouncing for city and country changes
  const [debouncedCity, setDebouncedCity] = useState('');
  const [debouncedCountry, setDebouncedCountry] = useState('');
  
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
      setUniversities(universitiesData.map(uni => uni.name));
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

  const [initialValues, setInitialValues] = useState({
    propertyName: "",
    squareFootage: "",
    description: "",
    homeType: "",
    bedrooms: 0,
    bathrooms: 0,
    kitchens: 0,
    roomType: "private",
    kitchenType: "private",
    bathroomType: "private",
    securityDeposit: "",
    ownership: true,
    renterAgreement: true,
    landlordInsurance: true,
    amenities: [],
    utilities: [],
    photos: Array(10).fill(null),
    pricing: "",
    latitude: "",
    longitude: "",
    location: "",
    city: "",
    country: "",
    locality: "",
    rentDetails: "Details about rent",
    termsOfStay: "Terms of stay",
    cancellationPolicy: "Cancellation policy",
    yearOfConstruction: "",
    minimumStayDuration: "",
    availableFrom: "",
    nearbyUniversities: [],
    bedroomDetails: [], // Add this new field for bedroom details
    onSiteVerification: false,
    bookingOptions: {
        allowSecurityDeposit: false,
        allowFirstRent: false,
        allowFirstAndLastRent: false
    },
    instantBooking: false,
    bookByEnquiry: false
  });

  useEffect(() => {
    if (property) {
      setInitialValues({
        propertyName: property.title || "",
        squareFootage: property.squareFootage || "",
        description: property.description || "",
        homeType: property.type || "",
        bedrooms: property.overview?.bedrooms || 0,
        bathrooms: property.overview?.bathrooms || 0,
        kitchens: property.overview?.kitchen || 0,
        roomType: property.overview?.roomType || "private",
        kitchenType: property.overview?.kitchenType || "private",
        bathroomType: property.overview?.bathroomType || "private",
        securityDeposit: property.securityDeposit || "",
        ownership: property.ownership !== false,
        renterAgreement: property.renterAgreement !== false,
        landlordInsurance: property.landlordInsurance !== false,
        amenities: property.amenities || [],
        utilities: property.utilities || [],
        photos: property.images || Array(10).fill(null),
        pricing: property.price || "",
        latitude: property.latitude || "",
        city: property.city || "",
        country: property.country || "",
        locality: property.locality || "",
        longitude: property.longitude || "",
        location: property.location || "",
        rentDetails: property.rentDetails || "Details about rent",
        termsOfStay: property.termsOfStay || "Terms of stay",
        cancellationPolicy: property.cancellationPolicy || "Cancellation policy",
        yearOfConstruction: property.yearOfConstruction || "",
        minimumStayDuration: property.minimumStayDuration || "",
        availableFrom: property.availableFrom || "",
        nearbyUniversities: property.nearbyUniversities || [],
        bedroomDetails: property.bedroomDetails || [], // Add this new field for bedroom details
        onSiteVerification: property.onSiteVerification || false,
        bookingOptions: {
            allowSecurityDeposit: property.bookingOptions?.allowSecurityDeposit || false,
            allowFirstRent: property.bookingOptions?.allowFirstRent || false,
            allowFirstAndLastRent: property.bookingOptions?.allowFirstAndLastRent || false
        },
        instantBooking: property.instantBooking || false,
        bookByEnquiry: property.bookByEnquiry || false
      });
    }
  }, [property]);

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
    securityDeposit: Yup.number().required("Security deposit is required"),
    ownership: Yup.bool().oneOf([true], "You must certify ownership"),
    renterAgreement: Yup.bool().oneOf(
      [true],
      "You must agree to this condition"
    ),
    landlordInsurance: Yup.bool().oneOf([true], "You must certify insurance"),
    amenities: Yup.array().min(1, "Select at least one amenity"),
    utilities: Yup.array(),
    pricing: Yup.number().required("Pricing is required"),
    // latitude: Yup.number().required("Latitude is required"),
    // longitude: Yup.number().required("Longitude is required"),
    location: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    locality: Yup.string().required("Locality is required"),
    rentDetails: Yup.string().required("Rent details are required"),
    termsOfStay: Yup.string().required("Terms of stay are required"),
    cancellationPolicy: Yup.string().required("Cancellation policy is required"),
    yearOfConstruction: Yup.number().required("Year of construction is required"),
    minimumStayDuration: Yup.string().required("Minimum stay duration is required"),
    availableFrom: Yup.string().required("Available from date is required"),
    nearbyUniversities: Yup.array(),
    onSiteVerification: Yup.boolean(),
    bookingOptions: Yup.object().shape({
        allowSecurityDeposit: Yup.boolean(),
        allowFirstRent: Yup.boolean(),
        allowFirstAndLastRent: Yup.boolean()
    }),
    instantBooking: Yup.boolean(),
    bookByEnquiry: Yup.boolean()
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

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Create the property object with all fields
      const propertyData = {
        title: values.propertyName,
        squareFootage: values.squareFootage,
        description: values.description,
        price: values.pricing,
        securityDeposit: values.securityDeposit,
        latitude: values.latitude,
        longitude: values.longitude,
        type: values.homeType,
        location: values.location,
        city: values.city,
        country: values.country,
        locality: values.locality,
        minimumStayDuration: values.minimumStayDuration,
        availableFrom: values.availableFrom,
        ownership: values.ownership,
        renterAgreement: values.renterAgreement,
        landlordInsurance: values.landlordInsurance,
        amenities: values.amenities || [],
        utilities: values.utilities || [],
        nearbyUniversities: values.nearbyUniversities || [],
        rentDetails: values.rentDetails || "Details about rent",
        termsOfStay: values.termsOfStay || "Terms of stay",
        cancellationPolicy: values.cancellationPolicy || "Cancellation policy",
        onSiteVerification: values.onSiteVerification,
        instantBooking: values.instantBooking,
        bookByEnquiry: values.bookByEnquiry,
        bookingOptions: values.bookingOptions,
        overview: {
          bedrooms: parseInt(values.bedrooms),
          bathrooms: parseInt(values.bathrooms),
          squareFeet: parseInt(values.squareFootage),
          kitchen: values.kitchens,
          roomType: values.roomType,
          kitchenType: values.kitchenType,
          bathroomType: values.bathroomType,
          yearOfConstruction: parseInt(values.yearOfConstruction),
          bedroomDetails: values.bedroomDetails || []
        }
      };

      // Create FormData only for images
      const imageFormData = new FormData();
      const validPhotos = values.photos.filter((photo) => photo !== null);
      validPhotos.forEach((photo) => {
        imageFormData.append("images", photo);
      });

      // First upload images and get their URLs
      const imageUploadResponse = await fetch('/api/upload-images', {
        method: 'POST',
        body: imageFormData
      });
      
      if (!imageUploadResponse.ok) {
        throw new Error('Failed to upload images');
      }

      const { imageUrls } = await imageUploadResponse.json();
      
      // Add image URLs to the property data
      propertyData.images = imageUrls;

      // Create property with complete data
      const result = await createProperty(propertyData).unwrap();
      console.log("Property created successfully:", result);
      toast.success("Property created successfully");
      router.back();
    } catch (error) {
      console.error("Failed to create property:", error);
      const errorMessage = error.data?.message || "Failed to create property";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBedroomCountChange = (newCount, currentCount, setFieldValue, currentValues) => {
    const currentBedrooms = currentValues?.bedroomDetails || [];
    if (newCount > currentCount) {
      // Add new bedroom
      setFieldValue('bedroomDetails', [
        ...currentBedrooms,
        {
          name: '',
          rent: '',
          sizeSqFt: '',
          furnished: false,
          privateWashroom: false,
          sharedWashroom: false,
          sharedKitchen: false
        }
      ]);
    } else if (newCount < currentCount) {
      // Remove last bedroom
      setFieldValue('bedroomDetails', currentBedrooms.slice(0, newCount));
    }
    setFieldValue('bedrooms', newCount);
  };

  if (isLoading) return <p></p>;
  if (error) return <p>Error loading property: {error.message}</p>;

  return (
    <LayoutHoc>
      <div className={styles.container}>
        <h2 className={styles.title}>Add Property</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
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
                          if (field === 'bedrooms') {
                            handleBedroomCountChange(newValue, values[field], setFieldValue, values);
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
                          if (field === 'bedrooms') {
                            handleBedroomCountChange(newValue, values[field], setFieldValue, values);
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
                  {Array.from({ length: values.bedrooms }).map((_, index) => (
                    <div key={index} className={styles.bedroomCard}>
                      <h4>Bedroom {index + 1}</h4>
                      <Row gutter={16}>
                        <Col span={8}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.name`}
                            title="Name"
                            placeholder="Enter bedroom name"
                            className={styles.labelinput}
                            value={values.bedroomDetails[index]?.name || ''}
                            onChange={(e) => {
                              const newDetails = [...(values.bedroomDetails || [])];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].name = e.target.value;
                              setFieldValue('bedroomDetails', newDetails);
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.rent`}
                            title="Rent"
                            placeholder="Enter rent amount"
                            className={styles.labelinput}
                            value={values.bedroomDetails[index]?.rent || ''}
                            onChange={(e) => {
                              const newDetails = [...(values.bedroomDetails || [])];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].rent = e.target.value;
                              setFieldValue('bedroomDetails', newDetails);
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <LabelInputComponent
                            name={`bedroomDetails.${index}.sizeSqFt`}
                            title="Size (sq ft)"
                            placeholder="Enter size in sq ft"
                            className={styles.labelinput}
                            value={values.bedroomDetails[index]?.sizeSqFt || ''}
                            onChange={(e) => {
                              const newDetails = [...(values.bedroomDetails || [])];
                              if (!newDetails[index]) newDetails[index] = {};
                              newDetails[index].sizeSqFt = e.target.value;
                              setFieldValue('bedroomDetails', newDetails);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row gutter={16} className={styles.checkboxRow}>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={values.bedroomDetails[index]?.furnished || false}
                              onChange={(e) => {
                                const newDetails = [...(values.bedroomDetails || [])];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].furnished = e.target.checked;
                                setFieldValue('bedroomDetails', newDetails);
                              }}
                            />
                            Furnished
                          </label>
                        </Col>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={values.bedroomDetails[index]?.privateWashroom || false}
                              onChange={(e) => {
                                const newDetails = [...(values.bedroomDetails || [])];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].privateWashroom = e.target.checked;
                                setFieldValue('bedroomDetails', newDetails);
                              }}
                            />
                            Private Washroom
                          </label>
                        </Col>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={values.bedroomDetails[index]?.sharedWashroom || false}
                              onChange={(e) => {
                                const newDetails = [...(values.bedroomDetails || [])];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].sharedWashroom = e.target.checked;
                                setFieldValue('bedroomDetails', newDetails);
                              }}
                            />
                            Shared Washroom
                          </label>
                        </Col>
                        <Col span={6}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={values.bedroomDetails[index]?.sharedKitchen || false}
                              onChange={(e) => {
                                const newDetails = [...(values.bedroomDetails || [])];
                                if (!newDetails[index]) newDetails[index] = {};
                                newDetails[index].sharedKitchen = e.target.checked;
                                setFieldValue('bedroomDetails', newDetails);
                              }}
                            />
                            Shared Kitchen
                          </label>
                        </Col>
                      </Row>
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
                    onChange={(e) => setFieldValue('onSiteVerification', e.target.checked)}
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
              <Row gutter={16}>
                <Col span={12}>
                  <LabelInputComponent
                    name="city"
                    title="City"
                    placeholder="Enter your city"
                    className={styles.labelinput}
                    onChange={(e) => handleCityChange(e, setFieldValue)}
                  />
                  <ErrorMessage name="city">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
                <Col span={12}>
                  <div className={styles.dropdownContainer}>
                    <label className={styles.label}>Country</label>
                    <Select
                      placeholder="Select country"
                      className={styles.dropdown}
                      value={values.country}
                      onChange={(value) => handleCountryChange(value, setFieldValue)}
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
                </Col>
              </Row>

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

              {/* Pricing Section */}
              <h3 className={styles.formTitle}>Pricing</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <LabelInputComponent
                    name="pricing"
                    title="Monthly Rent"
                    placeholder="Enter monthly rent amount"
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

              {/* Booking Options Section */}
              <div className={styles.bookingOptionsContainer}>
                <h4 className={styles.sectionTitle}>Payment Options</h4>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="paymentType"
                            checked={values.bookingOptions.allowSecurityDeposit}
                            onChange={() => {
                                setFieldValue('bookingOptions', {
                                    ...values.bookingOptions,
                                    allowSecurityDeposit: true,
                                    allowFirstRent: false,
                                    allowFirstAndLastRent: false
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
                            checked={values.bookingOptions.allowFirstRent}
                            onChange={() => {
                                setFieldValue('bookingOptions', {
                                    ...values.bookingOptions,
                                    allowSecurityDeposit: false,
                                    allowFirstRent: true,
                                    allowFirstAndLastRent: false
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
                            checked={values.bookingOptions.allowFirstAndLastRent}
                            onChange={() => {
                                setFieldValue('bookingOptions', {
                                    ...values.bookingOptions,
                                    allowSecurityDeposit: false,
                                    allowFirstRent: false,
                                    allowFirstAndLastRent: true
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
                                    setFieldValue('instantBooking', true);
                                    setFieldValue('bookByEnquiry', false);
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
                                    setFieldValue('bookByEnquiry', true);
                                    setFieldValue('instantBooking', false);
                                }}
                            />
                            Book by Enquiry
                        </label>
                    </div>
                </div>
              </div>

              {/* Year of Construction */}
              <Row gutter={16}>
                <Col span={12}>
                  <LabelInputComponent
                    name="yearOfConstruction"
                    title="Year of Construction"
                    placeholder="Enter year of construction"
                    className={styles.labelinput}
                  />
                  <ErrorMessage name="yearOfConstruction">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                </Col>
              </Row>

              {/* Minimum Stay Duration */}
              <div className={styles.dropdownContainer}>
                <label className={styles.label}>Minimum Stay Duration</label>
                <Select
                  placeholder="Select minimum stay duration"
                  className={styles.dropdown}
                  value={values.minimumStayDuration}
                  onChange={(value) => setFieldValue("minimumStayDuration", value)}
                >
                  <Select.Option value="Month-to-Month">Month-to-Month</Select.Option>
                  
                  {/* Quarter 1 Ranges */}
                  <Select.Option value="Jan to Mar">Jan to Mar (Q1)</Select.Option>
                  <Select.Option value="Jan to Jun">Jan to Jun (Q1-Q2)</Select.Option>
                  <Select.Option value="Jan to Sep">Jan to Sep (Q1-Q3)</Select.Option>
                  <Select.Option value="Jan to Dec">Jan to Dec (Full Year)</Select.Option>
                  <Select.Option value="Feb to Apr">Feb to Apr</Select.Option>
                  <Select.Option value="Feb to Jul">Feb to Jul</Select.Option>
                  <Select.Option value="Feb to Dec">Feb to Dec</Select.Option>
                  <Select.Option value="Mar to May">Mar to May</Select.Option>
                  <Select.Option value="Mar to Aug">Mar to Aug</Select.Option>
                  <Select.Option value="Mar to Dec">Mar to Dec</Select.Option>
                  
                  {/* Quarter 2 Ranges */}
                  <Select.Option value="Apr to Jun">Apr to Jun (Q2)</Select.Option>
                  <Select.Option value="Apr to Sep">Apr to Sep (Q2-Q3)</Select.Option>
                  <Select.Option value="Apr to Dec">Apr to Dec (Q2-Q4)</Select.Option>
                  <Select.Option value="May to Jul">May to Jul</Select.Option>
                  <Select.Option value="May to Oct">May to Oct</Select.Option>
                  <Select.Option value="May to Dec">May to Dec</Select.Option>
                  <Select.Option value="Jun to Aug">Jun to Aug</Select.Option>
                  <Select.Option value="Jun to Nov">Jun to Nov</Select.Option>
                  <Select.Option value="Jun to Dec">Jun to Dec</Select.Option>
                  
                  {/* Quarter 3 Ranges */}
                  <Select.Option value="Jul to Sep">Jul to Sep (Q3)</Select.Option>
                  <Select.Option value="Jul to Dec">Jul to Dec (Q3-Q4)</Select.Option>
                  <Select.Option value="Aug to Oct">Aug to Oct</Select.Option>
                  <Select.Option value="Aug to Dec">Aug to Dec</Select.Option>
                  <Select.Option value="Sep to Nov">Sep to Nov</Select.Option>
                  <Select.Option value="Sep to Dec">Sep to Dec</Select.Option>
                  
                  {/* Quarter 4 Ranges */}
                  <Select.Option value="Oct to Dec">Oct to Dec (Q4)</Select.Option>
                  <Select.Option value="Nov to Dec">Nov to Dec</Select.Option>
                  
                  {/* General Durations */}
                  <Select.Option value="Less than 6 months">Less than 6 months</Select.Option>
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
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <Option key={month} value={month}>{month}</Option>
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
                          checked={values.nearbyUniversities.includes(university)}
                          onChange={() => {
                            const newUniversities = values.nearbyUniversities.includes(university)
                              ? values.nearbyUniversities.filter((item) => item !== university)
                              : [...values.nearbyUniversities, university];
                            setFieldValue("nearbyUniversities", newUniversities);
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

              {/* Cancellation Policy Section */}
              <h3 className={styles.formTitle}>Cancellation Policy</h3>
              <MyQuillEditor
                label="Cancellation Policy"
                name="cancellationPolicy"
                placeholder="Enter cancellation policy details"
                setFieldValue={setFieldValue}
              />
              <ErrorMessage name="cancellationPolicy">
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
                <ErrorMessage name="ownership">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
                
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
                <ErrorMessage name="renterAgreement">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
                
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
                <ErrorMessage name="landlordInsurance">
                  {(msg) => <div className={styles.error}>{msg}</div>}
                </ErrorMessage>
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
                          <Image
                            src={URL.createObjectURL(values.photos[index])}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={200}
                            objectFit="cover"
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
