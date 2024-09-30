import React, { useState } from 'react';
import { Col, Row, Button } from 'antd';
import LayoutHoc from '@/HOC/LayoutHoc';
import FilledButtonComponent from '@/components/Button';
import styles from "../styles.module.css";
import SearchCategory from '@/components/search-category';
import Fileuploader from '@/components/FIleUpload';
import Link from 'next/link';
import { SVG } from '@/assest/svg';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { addSurmandal } from '@/api/surmandalapi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';


export default function ManageSurmandal() {

    const router = useRouter()
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
            value: 'S',
            label: 'S',
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
            value: 'Raag 1',
            label: 'Raag 1',
        },
        {
            value: 'Raag 2',
            label: 'Raag 2',
        },
        {
            value: 'Raag 3',
            label: 'Raag 3',
        },
    ];

    const [selectedValue, setSelectedValue] = useState('C');
    const [musicValue, setMusicValue] = useState('Raag 1');


    const handleCategoryChange = (value) => {
        setSelectedValue(value);
    };

    const handleMusicChange = (value) => {
        setMusicValue(value);
    };
    const initialState = {
        pitch: "",
        raag: "",
        files: [""]
    }


    return (
        <LayoutHoc>
            <Col className={styles.title}>
                <h3>Add Surmandal</h3>
                <Link href="/manage-surmandal">  <FilledButtonComponent> <SVG.Arrow /> Back</FilledButtonComponent></Link>
            </Col>
            <Formik
                initialValues={initialState}
                //      validationSchema={categorySchema}

                onSubmit={(values) => {

                    const formdata = new FormData();
                    formdata.append("pitch", values?.pitch);
                    formdata.append("raag", values?.raag);
                    for (let file of values?.files) {
                        formdata.append("files", file);
                    }




                    addSurmandal(formdata).then((data) => {
                        console.log(data, "skhueg");
                        if (data) {
                            toast.success(`surmandal will be added sucessfully`)
                        }


                        router.push('/manage-surmandal')

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


                        <Col className='tableBox fileAttach'>
                            <Row className={`${styles.appendRow}`}>
                                <Col md={24}>
                                    <Col className={styles.titleBox}>
                                        <SearchCategory
                                            title="Select Pitch"
                                            defaultValue={selectedValue}
                                            onChange={(values) => {
                                                setFieldValue('pitch', values)
                                            }}
                                            options={dynamicOptions}
                                        />
                                    </Col>
                                </Col>
                                <Col md={24}>
                                    <Col className={styles.titleBox}>
                                        <SearchCategory
                                            title="Select Raag "
                                            defaultValue={musicValue}
                                            onChange={(values) => {
                                                setFieldValue('raag', values)
                                            }}
                                            options={MusicOptions}
                                        />
                                    </Col>
                                </Col>
                                <Col md={24}>
                                    <Fileuploader
                                        title="Attached File"
                                        name="files"
                                        count={1}
                                        setFieldValue={setFieldValue}

                                    />
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
