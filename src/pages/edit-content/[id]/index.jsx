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
    const router = useRouter()
    const { id } = router.query;
    console.log(id, "dkfwurgu");


    const [initialState, setinitialState] = useState({
        title: "",
        bannerImage: "",
        description: ""

    })

    useEffect(() => {
        if (id) {
            singlecontent(id).then((data) => {
                console.log(data, "snuegv");
                setinitialState({
                    title: data?.data?.title,
                    bannerImage: data?.data?.bannerImage,
                    description: data?.data?.description
                })
            })
        }
    }, [id])

    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Edit Content</h3>
                    <Link href="/manage-content">  <FilledButtonComponent> <SVG.Arrow /> Back</FilledButtonComponent></Link>
                </Col>
                <Col className="tableBox">
                    <Col>
                        <Formik
                            initialValues={initialState}
                            //      validationSchema={categorySchema}

                            onSubmit={(values) => {

                                const formdata = new FormData();
                                formdata.append("title", values?.title);
                                formdata.append("description", values?.description);
                                formdata.append("file", values?.bannerImage);





                                editcontent(id, formdata).then((data) => {
                                    console.log(data, "skhueg");
                                    if (data) {
                                        toast.success(`content will be added sucessfully`)
                                    }


                                    router.push('/manage-content')

                                })
                                    .catch((err) => {
                                        if (err) {
                                            toast.error(`Some went wrong`)
                                        }
                                        console.log(err);
                                    })

                            }}
                        >
                            {({ setFieldValue, values }) => (
                                <Form>

                                    <LabelInputComponent title="Heading" name="title" />
                                    <BannerUpload title="Manage Banner" addimage={setFieldValue} image={values?.bannerImage} />
                                    <MyQuillEditor label="Description" name="description" setFieldValue={setFieldValue} />
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
    )
}
