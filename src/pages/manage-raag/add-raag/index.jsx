import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
import React from 'react'
import styles from "../styles.module.css"
// import SelectDropdownComponent from '@/components/TextFields/selectDropdown'
import FilledButtonComponent from '@/components/Button'
import LabelInputComponent from '@/components/TextFields/labelInput'
import Link from 'next/link'
import { SVG } from '@/assest/svg'

export default function Addraag() {
    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Add Raag</h3>
                    <Link href="/manage-raag">  <FilledButtonComponent className={`${styles.arrowBtn}`}> <SVG.Arrow /> Back</FilledButtonComponent></Link>
                </Col>
                <Col className='tableBox'>
                    <Col style={{ marginBottom: "14px" }}>
                        <LabelInputComponent title="Manage Raag Name" type="search" />

                    </Col>

                    <Col style={{ textAlign: "end", marginTop: "16px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
            </LayoutHoc>
        </>
    )
}
