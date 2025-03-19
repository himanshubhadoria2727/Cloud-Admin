import LayoutHoc from '@/HOC/LayoutHoc'
import { Col, Row, Select } from 'antd'
import styles from "../content.module.css"
import React, { useEffect, useState } from 'react'
import LabelInputComponent from '@/components/TextFields/labelInput'
import MyQuillEditor from '@/components/TextFields/textArea'
import FilledButtonComponent from '@/components/Button'
import { SVG } from '@/assest/svg'
import Link from 'next/link'
import BannerUpload from '../component/BannerUpload'
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { useRouter } from 'next/router'
import { editcontent, singlecontent } from '@/api/contentapi'
import { toast } from 'react-toastify'
import * as Yup from 'yup';

export default function EditContent() {
    const router = useRouter();
    const { id } = router.query;

    const [initialState, setInitialState] = useState({
        title: "",
        bannerImage: "",
        description: "",
        phone_no: "",
        email: "",
        // Property specific fields
        price: "",
        securityDeposit: "",
        currency: "USD",
        country: "",
        latitude: "",
        longitude: "",
        type: "",
        amenities: [],
        utilities: [],
        overview: {
            bedrooms: 0,
            bathrooms: 0,
            squareFeet: 0,
            kitchen: 0,
            yearOfConstruction: new Date().getFullYear(),
            roomType: "private",
            kitchenType: "private",
            bathroomType: "private",
        },
        rentDetails: "",
        termsOfStay: "",
        location: "",
        city: "",
        locality: "",
        images: [],
        minimumStayDuration: "Less than 6 months",
        availableFrom: "Jan",
        nearbyUniversities: [],
    });

    const [showPhoneField, setShowPhoneField] = useState(false); // State to track if phone field should be shown
    const [showEmailField, setShowEmailField] = useState(false); // State to track if email field should be shown

    useEffect(() => {
        if (id) {
            singlecontent(id).then((data) => {
                const { phone_no, email } = data?.data;

                setInitialState({
                    title: data?.data?.title || "",
                    bannerImage: data?.data?.bannerImage || "",
                    description: data?.data?.description || "",
                    phone_no: phone_no || "",
                    email: email || "",
                    // Property specific fields
                    price: data?.data?.price || "",
                    securityDeposit: data?.data?.securityDeposit || "",
                    currency: data?.data?.currency || "USD",
                    country: data?.data?.country || "",
                    latitude: data?.data?.latitude || "",
                    longitude: data?.data?.longitude || "",
                    type: data?.data?.type || "",
                    amenities: data?.data?.amenities || [],
                    utilities: data?.data?.utilities || [],
                    overview: data?.data?.overview || {
                        bedrooms: 0,
                        bathrooms: 0,
                        squareFeet: 0,
                        kitchen: 0,
                        yearOfConstruction: new Date().getFullYear(),
                        roomType: "private",
                        kitchenType: "private",
                        bathroomType: "private",
                    },
                    rentDetails: data?.data?.rentDetails || "",
                    termsOfStay: data?.data?.termsOfStay || "",
                    location: data?.data?.location || "",
                    city: data?.data?.city || "",
                    locality: data?.data?.locality || "",
                    images: data?.data?.images || [],
                    minimumStayDuration: data?.data?.minimumStayDuration || "Less than 6 months",
                    availableFrom: data?.data?.availableFrom || "Jan",
                    nearbyUniversities: data?.data?.nearbyUniversities || [],
                });

                // Set the visibility states based on the fetched data
                setShowPhoneField(!!phone_no);
                setShowEmailField(!!email);
            });
        }
    }, [id]);

    // Add validation schema for the property fields
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        price: Yup.number().typeError("Price must be a number").required("Price is required"),
        securityDeposit: Yup.number().typeError("Security deposit must be a number").required("Security deposit is required"),
        currency: Yup.string().required("Currency is required"),
        country: Yup.string().required("Country is required"),
        latitude: Yup.number().typeError("Latitude must be a number").required("Latitude is required"),
        longitude: Yup.number().typeError("Longitude must be a number").required("Longitude is required"),
        type: Yup.string().required("Property type is required"),
        location: Yup.string().required("Location is required"),
        city: Yup.string().required("City is required"),
        locality: Yup.string().required("Locality is required"),
        rentDetails: Yup.string().required("Rent details are required"),
        termsOfStay: Yup.string().required("Terms of stay are required"),
        minimumStayDuration: Yup.string().required("Minimum stay duration is required"),
        availableFrom: Yup.string().required("Available from date is required"),
        'overview.bedrooms': Yup.number().min(0, "Bedrooms cannot be negative").required("Bedrooms is required"),
        'overview.bathrooms': Yup.number().min(0, "Bathrooms cannot be negative").required("Bathrooms is required"),
        'overview.squareFeet': Yup.number().min(0, "Square feet cannot be negative").required("Square feet is required"),
        'overview.kitchen': Yup.number().min(0, "Kitchen cannot be negative").required("Kitchen is required"),
        'overview.yearOfConstruction': Yup.number().required("Year of construction is required"),
        'overview.roomType': Yup.string().required("Room type is required"),
        'overview.kitchenType': Yup.string().required("Kitchen type is required"),
        'overview.bathroomType': Yup.string().required("Bathroom type is required"),
    });

    const handleSubmit = (values) => {
        const formdata = new FormData();
        formdata.append("title", values?.title);
        formdata.append("description", values?.description);
        formdata.append("file", values?.bannerImage);
        formdata.append("phone_no", values?.phone_no);
        formdata.append("email", values?.email);

        // Add property specific fields
        formdata.append("price", values?.price);
        formdata.append("securityDeposit", values?.securityDeposit);
        formdata.append("currency", values?.currency);
        formdata.append("country", values?.country);
        formdata.append("latitude", values?.latitude);
        formdata.append("longitude", values?.longitude);
        formdata.append("type", values?.type);
        formdata.append("location", values?.location);
        formdata.append("city", values?.city);
        formdata.append("locality", values?.locality);
        formdata.append("minimumStayDuration", values?.minimumStayDuration);
        formdata.append("availableFrom", values?.availableFrom);
        
        // Add arrays as JSON strings
        formdata.append("amenities", JSON.stringify(values?.amenities || []));
        formdata.append("utilities", JSON.stringify(values?.utilities || []));
        formdata.append("nearbyUniversities", JSON.stringify(values?.nearbyUniversities || []));

        // Add overview object as JSON string
        formdata.append("overview", JSON.stringify(values?.overview || {}));

        // Add rent details and terms of stay
        formdata.append("rentDetails", values?.rentDetails);
        formdata.append("termsOfStay", values?.termsOfStay);

        // Add images if they exist
        if (values?.images && values?.images.length > 0) {
            values.images.forEach((image, index) => {
                if (image) formdata.append("images", image);
            });
        }

        editcontent(id, formdata)
            .then((data) => {
                if (data) {
                    toast.success(`Content updated successfully`);
                }
                router.push('/manage-content');
            })
            .catch((err) => {
                if (err) {
                    toast.error(`Something went wrong`);
                }
                console.log(err);
            });
    };

    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Edit Content</h3>
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
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <h3>Basic Information</h3>
                                    <LabelInputComponent title="Title" name="title" />
                                    <MyQuillEditor label="Description" name="description" setFieldValue={setFieldValue} />
                                    
                                    <h3>Property Details</h3>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <LabelInputComponent title="Price" name="price" />
                                            <ErrorMessage name="price">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col span={12}>
                                            <LabelInputComponent title="Security Deposit" name="securityDeposit" />
                                            <ErrorMessage name="securityDeposit">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                    </Row>

                                    <div className="dropdown-container">
                                        <label>Currency</label>
                                        <Select
                                            placeholder="Select currency"
                                            style={{ width: '100%' }}
                                            value={values.currency}
                                            onChange={(value) => setFieldValue("currency", value)}
                                        >
                                            <Select.Option value="USD">USD (US Dollar)</Select.Option>
                                            <Select.Option value="INR">INR (Indian Rupee)</Select.Option>
                                            <Select.Option value="CAD">CAD (Canadian Dollar)</Select.Option>
                                            <Select.Option value="GBP">GBP (British Pound)</Select.Option>
                                            <Select.Option value="EUR">EUR (Euro)</Select.Option>
                                            <Select.Option value="AUD">AUD (Australian Dollar)</Select.Option>
                                        </Select>
                                        <ErrorMessage name="currency">
                                            {(msg) => <div className="error">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div className="dropdown-container">
                                        <label>Property Type</label>
                                        <Select
                                            placeholder="Select property type"
                                            style={{ width: '100%' }}
                                            value={values.type}
                                            onChange={(value) => setFieldValue("type", value)}
                                        >
                                            <Select.Option value="apartment">Apartment</Select.Option>
                                            <Select.Option value="house">House</Select.Option>
                                            <Select.Option value="commercial">Commercial</Select.Option>
                                            <Select.Option value="land">Land</Select.Option>
                                        </Select>
                                        <ErrorMessage name="type">
                                            {(msg) => <div className="error">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <h3>Overview</h3>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <LabelInputComponent title="Bedrooms" name="overview.bedrooms" />
                                            <ErrorMessage name="overview.bedrooms">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col span={8}>
                                            <LabelInputComponent title="Bathrooms" name="overview.bathrooms" />
                                            <ErrorMessage name="overview.bathrooms">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col span={8}>
                                            <LabelInputComponent title="Kitchen" name="overview.kitchen" />
                                            <ErrorMessage name="overview.kitchen">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <LabelInputComponent title="Square Feet" name="overview.squareFeet" />
                                            <ErrorMessage name="overview.squareFeet">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col span={12}>
                                            <LabelInputComponent title="Year of Construction" name="overview.yearOfConstruction" />
                                            <ErrorMessage name="overview.yearOfConstruction">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <div className="dropdown-container">
                                                <label>Room Type</label>
                                                <Select
                                                    placeholder="Select room type"
                                                    style={{ width: '100%' }}
                                                    value={values.overview?.roomType}
                                                    onChange={(value) => setFieldValue("overview.roomType", value)}
                                                >
                                                    <Select.Option value="private">Private</Select.Option>
                                                    <Select.Option value="shared">Shared</Select.Option>
                                                </Select>
                                                <ErrorMessage name="overview.roomType">
                                                    {(msg) => <div className="error">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="dropdown-container">
                                                <label>Kitchen Type</label>
                                                <Select
                                                    placeholder="Select kitchen type"
                                                    style={{ width: '100%' }}
                                                    value={values.overview?.kitchenType}
                                                    onChange={(value) => setFieldValue("overview.kitchenType", value)}
                                                >
                                                    <Select.Option value="private">Private</Select.Option>
                                                    <Select.Option value="shared">Shared</Select.Option>
                                                </Select>
                                                <ErrorMessage name="overview.kitchenType">
                                                    {(msg) => <div className="error">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="dropdown-container">
                                                <label>Bathroom Type</label>
                                                <Select
                                                    placeholder="Select bathroom type"
                                                    style={{ width: '100%' }}
                                                    value={values.overview?.bathroomType}
                                                    onChange={(value) => setFieldValue("overview.bathroomType", value)}
                                                >
                                                    <Select.Option value="private">Private</Select.Option>
                                                    <Select.Option value="shared">Shared</Select.Option>
                                                </Select>
                                                <ErrorMessage name="overview.bathroomType">
                                                    {(msg) => <div className="error">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                        </Col>
                                    </Row>

                                    <h3>Location</h3>
                                    <LabelInputComponent title="Address" name="location" />
                                    <ErrorMessage name="location">
                                        {(msg) => <div className="error">{msg}</div>}
                                    </ErrorMessage>

                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <LabelInputComponent title="City" name="city" />
                                            <ErrorMessage name="city">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col span={8}>
                                            <div className="dropdown-container">
                                                <label>Country</label>
                                                <Select
                                                    placeholder="Select country"
                                                    style={{ width: '100%' }}
                                                    value={values.country}
                                                    onChange={(value) => setFieldValue("country", value)}
                                                >
                                                    <Select.Option value="USA">United States</Select.Option>
                                                    <Select.Option value="India">India</Select.Option>
                                                    <Select.Option value="Canada">Canada</Select.Option>
                                                    <Select.Option value="UK">United Kingdom</Select.Option>
                                                    <Select.Option value="EU">European Union</Select.Option>
                                                    <Select.Option value="Australia">Australia</Select.Option>
                                                </Select>
                                                <ErrorMessage name="country">
                                                    {(msg) => <div className="error">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <LabelInputComponent title="Locality" name="locality" />
                                            <ErrorMessage name="locality">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <LabelInputComponent title="Latitude" name="latitude" />
                                            <ErrorMessage name="latitude">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                        <Col span={12}>
                                            <LabelInputComponent title="Longitude" name="longitude" />
                                            <ErrorMessage name="longitude">
                                                {(msg) => <div className="error">{msg}</div>}
                                            </ErrorMessage>
                                        </Col>
                                    </Row>

                                    <h3>Amenities & Utilities</h3>
                                    <div className="amenities-section">
                                        <h4>Amenities</h4>
                                        <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            {[
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
                                            ].map((amenity, index) => (
                                                <div key={index} style={{ marginBottom: '5px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            name="amenities"
                                                            value={amenity}
                                                            checked={values.amenities?.includes(amenity)}
                                                            onChange={() => {
                                                                const newAmenities = values.amenities?.includes(amenity)
                                                                    ? values.amenities.filter((item) => item !== amenity)
                                                                    : [...(values.amenities || []), amenity];
                                                                setFieldValue("amenities", newAmenities);
                                                            }}
                                                            style={{ marginRight: '8px' }}
                                                        />
                                                        {amenity}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="utilities-section" style={{ marginTop: '20px' }}>
                                        <h4>Utilities Included</h4>
                                        <div className="utilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            {[
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
                                            ].map((utility, index) => (
                                                <div key={index} style={{ marginBottom: '5px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            name="utilities"
                                                            value={utility}
                                                            checked={values.utilities?.includes(utility)}
                                                            onChange={() => {
                                                                const newUtilities = values.utilities?.includes(utility)
                                                                    ? values.utilities.filter((item) => item !== utility)
                                                                    : [...(values.utilities || []), utility];
                                                                setFieldValue("utilities", newUtilities);
                                                            }}
                                                            style={{ marginRight: '8px' }}
                                                        />
                                                        {utility}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="universities-section" style={{ marginTop: '20px' }}>
                                        <h4>Nearby Universities</h4>
                                        <div className="universities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            {[
                                                "University of Toronto",
                                                "York University",
                                                "Ryerson University",
                                                "McGill University",
                                                "University of British Columbia",
                                                "University of Waterloo",
                                                "McMaster University",
                                                "Queen's University",
                                                "University of Alberta",
                                                "University of Calgary",
                                                "Harvard University",
                                                "MIT",
                                                "Stanford University",
                                                "Yale University",
                                                "Princeton University",
                                                "Oxford University",
                                                "Cambridge University",
                                                "IIT Delhi",
                                                "IIT Bombay",
                                                "IIT Madras"
                                            ].map((university, index) => (
                                                <div key={index} style={{ marginBottom: '5px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            name="nearbyUniversities"
                                                            value={university}
                                                            checked={values.nearbyUniversities?.includes(university)}
                                                            onChange={() => {
                                                                const newUniversities = values.nearbyUniversities?.includes(university)
                                                                    ? values.nearbyUniversities.filter((item) => item !== university)
                                                                    : [...(values.nearbyUniversities || []), university];
                                                                setFieldValue("nearbyUniversities", newUniversities);
                                                            }}
                                                            style={{ marginRight: '8px' }}
                                                        />
                                                        {university}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <h3>Stay Details</h3>
                                    <div className="dropdown-container">
                                        <label>Minimum Stay Duration</label>
                                        <Select
                                            placeholder="Select minimum stay duration"
                                            style={{ width: '100%' }}
                                            value={values.minimumStayDuration}
                                            onChange={(value) => setFieldValue("minimumStayDuration", value)}
                                        >
                                            <Select.Option value="Less than 6 months">Less than 6 months</Select.Option>
                                            <Select.Option value="6-12 months">6-12 months</Select.Option>
                                            <Select.Option value="1 year+">1 year+</Select.Option>
                                        </Select>
                                        <ErrorMessage name="minimumStayDuration">
                                            {(msg) => <div className="error">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <div className="dropdown-container">
                                        <label>Available From</label>
                                        <Select
                                            placeholder="Select availability month"
                                            style={{ width: '100%' }}
                                            value={values.availableFrom}
                                            onChange={(value) => setFieldValue("availableFrom", value)}
                                        >
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                                                <Select.Option key={month} value={month}>{month}</Select.Option>
                                            ))}
                                        </Select>
                                        <ErrorMessage name="availableFrom">
                                            {(msg) => <div className="error">{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <h3>Additional Details</h3>
                                    <MyQuillEditor label="Rent Details" name="rentDetails" setFieldValue={setFieldValue} />
                                    <ErrorMessage name="rentDetails">
                                        {(msg) => <div className="error">{msg}</div>}
                                    </ErrorMessage>

                                    <MyQuillEditor label="Terms of Stay" name="termsOfStay" setFieldValue={setFieldValue} />
                                    <ErrorMessage name="termsOfStay">
                                        {(msg) => <div className="error">{msg}</div>}
                                    </ErrorMessage>

                                    {/* Phone and Email fields if needed */}
                                    {showPhoneField && (
                                        <LabelInputComponent title="Phone Number" name="phone_no" maxLength={10} />
                                    )}

                                    {showEmailField && (
                                        <LabelInputComponent title="Email" name="email" />
                                    )}

                                    <Col style={{ textAlign: "end", marginTop: "20px", marginBottom: "15px" }}>
                                        <button className="btn submit">Save</button>
                                    </Col>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Col>
            </LayoutHoc>
        </>
    );
}
