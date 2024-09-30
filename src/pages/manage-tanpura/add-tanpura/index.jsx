import React, { useState } from 'react';
import { Col, Row, Button } from 'antd';
import styles from "../styles.module.css";
import LayoutHoc from '@/HOC/LayoutHoc';
import SearchCategory from '@/components/search-category';
import Fileuploader from '@/components/FIleUpload';
import LabelInputComponent from '@/components/TextFields/labelInput';
import FilledButtonComponent from '@/components/Button';
import Link from 'next/link';
import { SVG } from '@/assest/svg';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { addTanpura } from '@/api/tanpura';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import * as Yup from 'yup';



export default function AddTanpura() {
    const router = useRouter()
    const tanpuraSchema = Yup.object().shape({
        pitch: Yup.string().required('Pitch is required'),
        types: Yup.string().required('Types is required'),


        bpm: Yup.string().required('BPM is required')
    });


    const dynamicOptions = [
        {
            value: 'C',
            label: 'C',
        },
        {
            value: 'C#',
            label: 'C#',
        },
        {
            value: 'D',
            label: 'D',
        },
        {
            value: 'D#',
            label: 'D#',
        },
        {
            value: 'E',
            label: 'E',
        },
        {
            value: 'F',
            label: 'F',
        },
        {
            value: 'F#',
            label: 'F#',
        },
        {
            value: 'G',
            label: 'G',
        },
        {
            value: 'G#',
            label: 'G#',
        },
        {
            value: 'F',
            label: 'F',
        },
        {
            value: 'F#',
            label: 'F#',
        },
        {
            value: 'B',
            label: 'B',
        },
    ];

    const MusicOptions = [
        {
            value: 'SA-PA',
            label: 'SA-PA',
        },
        {
            value: 'SA-MA',
            label: 'SA-MA',
        },
        {
            value: 'SA-NI',
            label: 'SA-NI',
        },
    ];

    const [selectedValue, setSelectedValue] = useState('C#');
    const [musicValue, setMusicValue] = useState('SA-PA');


    const handleCategoryChange = (value) => {
        setSelectedValue(value);
    };

    const handleMusicChange = (value) => {
        setMusicValue(value);
    };
    const initialValues = {
        pitch: "",
        types: "",
        file1: "",
        file2: "",
        file3: "",
        file4: "",
        bpm: ""
    }



    return (
        <LayoutHoc>
            <Col className={styles.title}>
                <h3>Add Tanpura Music</h3>
                <Link href="/manage-tanpura">  <FilledButtonComponent> <SVG.Arrow /> Back</FilledButtonComponent></Link>
            </Col>

            <Formik
                initialValues={initialValues}
                validationSchema={tanpuraSchema}

                onSubmit={(values) => {




                    addTanpura(values).then((data) => {
                        toast.success(`${data?.message}`)
                        router.push('/manage-tanpura')
                    })
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form>

                        <Col className="tableBox">
                            <Col className={styles.titleBox}>
                                <SearchCategory
                                    title="Select Pitch"
                                    defaultValue={selectedValue}
                                    onChange={(value) => {
                                        setFieldValue('pitch', value)
                                    }}
                                    options={dynamicOptions}
                                />
                                <ErrorMessage name="pitch" />
                            </Col>
                            <Col className={styles.titleBox}>
                                <SearchCategory
                                    title="Select type "
                                    defaultValue={musicValue}
                                    onChange={(value) => {
                                        setFieldValue("types", value)
                                    }}
                                    options={MusicOptions}
                                />
                                <ErrorMessage name="types" />
                            </Col>


                        </Col>
                        <Col className='tableBox fileAttach'>
                            <h3>Attach File</h3>
                            <Row className={`${styles.appendRow}`}>

                                <Col md={5} className={`${styles.fileName}`}>
                                    <Fileuploader
                                        title="File 1"
                                        name="file1"
                                        setFieldValue={setFieldValue}


                                    />
                                    <ErrorMessage name="file1" />
                                </Col>

                                <Col md={5} className={`${styles.fileName}`}>
                                    <Fileuploader
                                        title="File 2 (optional)"
                                        name="file2"
                                        setFieldValue={setFieldValue}


                                    />
                                    <ErrorMessage name="file1" />
                                </Col>
                                <Col md={5} className={`${styles.fileName}`}>
                                    <Fileuploader
                                        title="File 3 (optional)"
                                        name="file2"
                                        setFieldValue={setFieldValue}


                                    />
                                </Col>
                                <Col md={5} className={`${styles.fileName}`}>
                                    <Fileuploader
                                        title="File 4 (optional)"

                                        name="file4"
                                        setFieldValue={setFieldValue}


                                    />
                                </Col>
                                <Col md={4}>
                                    <label>BPM</label>
                                    <LabelInputComponent name="bpm" />
                                    <ErrorMessage name="bpm" />

                                </Col>

                            </Row>
                            <Col style={{ textAlign: 'end', marginTop: '15px' }}>
                                <button className="btn submit" type='submit' >
                                    Save
                                </button>
                            </Col>
                        </Col>

                    </Form>
                )}
            </Formik>
        </LayoutHoc>
    );
}
