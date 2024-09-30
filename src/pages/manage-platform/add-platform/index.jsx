import LayoutHoc from '@/HOC/LayoutHoc'
import React from 'react'
import styles from "../platform.module.css"
import { Col } from 'antd'
import LabelInputComponent from '@/components/TextFields/labelInput'
import FilledButtonComponent from '@/components/Button'

export default function AddPlatForm() {
    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Add Platform</h3>
                </Col>
                <Col className="tableBox">
                    <Col>
                        <LabelInputComponent type="file" title="manage Icons :" style={{paddingTop:"10px"}} />
                    </Col>
                    <Col>
                        <LabelInputComponent title="Manage Name :" />
                    </Col>
                    <Col>
                        <LabelInputComponent title="Manage Days :" />
                    </Col>
                    <Col style={{ textAlign: "end", marginTop: "16px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
            </LayoutHoc>
        </>
    )
}
