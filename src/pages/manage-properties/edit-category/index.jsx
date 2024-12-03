import LayoutHoc from '@/HOC/LayoutHoc'
import React from 'react'
import styles from "../properties.module.css"
import { Col } from 'antd'
import LabelInputComponent from '@/components/TextFields/labelInput'
import FilledButtonComponent from '@/components/Button'
import Link from 'next/link'
import { SVG } from '@/assest/svg'
// import SearchCategory from '../component/search-category'

export default function EditCategory() {
    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Edit Category</h3>
                    <Link href="/manage-raag-sub-raag">  <FilledButtonComponent> <SVG.Arrow /> Back</FilledButtonComponent></Link>
                </Col>
                <Col className="tableBoxed">
                    <Col>
                        <LabelInputComponent type="text" title="Category Name" />
                    </Col>
                    {/* <Col className='subCatregory'>
                        <SearchCategory title="Sub Category" />
                    </Col> */}
                    <Col>
                        <LabelInputComponent type="file" title="Category Image" />
                    </Col>
                    <Col style={{ textAlign: "end", marginTop: "20px", marginBottom: "15px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
            </LayoutHoc>
        </>
    )
}
