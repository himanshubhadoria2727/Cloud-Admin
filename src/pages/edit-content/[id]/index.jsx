import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
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



export default function EditContent() {
    const router = useRouter();
    const { id } = router.query;

    const [initialState, setInitialState] = useState({
        title: "",
        bannerImage: "",
        description: "",
        phone_no: "",
        email: ""
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
                    email: email || ""
                });

                // Set the visibility states based on the fetched data
                setShowPhoneField(!!phone_no);
                setShowEmailField(!!email);
            });
        }
    }, [id]);

    const handleSubmit = (values) => {
        const formdata = new FormData();
        formdata.append("title", values?.title);
        formdata.append("description", values?.description);
        formdata.append("file", values?.bannerImage);
        formdata.append("phone_no", values?.phone_no);
        formdata.append("email", values?.email);

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
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>
                                    <LabelInputComponent title="Heading" name="title" />
                                    {/* <BannerUpload title="Manage Banner" addimage={setFieldValue} image={values?.bannerImage} /> */}

                                    {/* Show phone number field if it's supposed to be visible */}
                                    {showPhoneField && (
                                        <LabelInputComponent title="Phone Number" name="phone_no" maxLength={10} />
                                    )}

                                    {/* Show email field if it's supposed to be visible */}
                                    {showEmailField && (
                                        <LabelInputComponent title="Email" name="email" />
                                    )}

                                    {/* Description is only shown if both phone_no and email fields are hidden */}
                                    {!showPhoneField && !showEmailField && (
                                        <MyQuillEditor label="Description" name="description" setFieldValue={setFieldValue} />
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
