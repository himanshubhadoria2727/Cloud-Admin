import LayoutHoc from '@/HOC/LayoutHoc'
import React from 'react'
import styles from "./log.module.css"
import { Col } from 'antd'
import LabelInputComponent from '@/components/TextFields/labelInput'
import FilledButtonComponent from '@/components/Button'
import Fileuploader from '@/components/FIleUpload'
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { addSurpeti } from '@/api/surmandalapi'
import { toast } from 'react-toastify'

export default function SearchLog() {
    const initialState = {
        files: [""]
    }

    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Manage Surpeti</h3>
                </Col>

                <Formik
                    initialValues={initialState}
                    //      validationSchema={categorySchema}

                    onSubmit={(values) => {
                        console.log(values, "jdjjdjdjdj");

                        const formdata = new FormData();

                        for (let file of values?.files) {
                            formdata.append("files", file);
                        }




                        addSurpeti(formdata).then((data) => {
                            console.log(data, "skhueg");
                            if (data) {
                                toast.success(`surpeti will be added sucessfully`)


                            }


                            location.reload();




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


                            <Col className="tableBox fileAttach">
                                <Col className={`${styles.titleBox}`}>
                                    <Fileuploader
                                        title="Attached File"
                                        name="files"
                                        count={1}
                                        setFieldValue={setFieldValue}

                                    />
                                </Col>
                                <Col style={{ textAlign: "end", marginTop: "15px" }}>
                                    <button className="btn submit" type='submit'>Save</button>
                                </Col>
                            </Col>
                        </Form>
                    )}
                </Formik>
            </LayoutHoc>
        </>
    )
}
