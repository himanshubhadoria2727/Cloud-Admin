import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
import React from 'react'
import styles from "../styles.module.css"
// import SelectDropdownComponent from '@/components/TextFields/selectDropdown'
import FilledButtonComponent from '@/components/Button'
import LabelInputComponent from '@/components/TextFields/labelInput'
import Link from 'next/link'
import { SVG } from '@/assest/svg'
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
export default function AddTaal() {


    const initialValues = {
        pitch: "",
        taalname: "",
        subtaalname: "",
        taal: [{
            name: ""
        }],
        taalfiles: [
            {
                filename: "",
                bpm: ""
            }
        ]


    }

    return (

        <>
            <LayoutHoc>

                <Formik
                    initialValues={initialValues}
                    // validationSchema={validationSchema}

                    onSubmit={(values) => {


                        console.log(values, "sciehui");
                    }}
                >
                    {({ setFieldValue, values }) => (
                        <Form>

                            <Col className={`${styles.title}`}>
                                <h3>Add Taal</h3>
                                <Link href="/manage-taal">  <FilledButtonComponent className={`${styles.arrowBtn}`}> <SVG.Arrow /> Back</FilledButtonComponent></Link>
                            </Col>
                            <Col className='tableBox'>
                                <Col style={{ marginBottom: "14px" }}>
                                    <LabelInputComponent title="Manage Taal Name" type="search" />

                                </Col>

                                <Col style={{ textAlign: "end", marginTop: "16px" }}>
                                    <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                                </Col>
                            </Col>

                        </Form>
                    )}
                </Formik>
            </LayoutHoc >
        </>
    )
}
