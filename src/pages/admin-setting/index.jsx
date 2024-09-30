import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
import React from 'react'
import styles from "./styles.module.css"
import LabelInputComponent from '@/components/TextFields/labelInput'
import FilledButtonComponent from '@/components/Button'

export default function AdminSetting() {
  return (
    <>
      <LayoutHoc>
        <Col className={`${styles.title}`}>
          <h3>Admin Setting</h3>
        </Col>
        <Col className="tableBox">
          <h3>Manage SMTP Password</h3>
          <Col>
            <LabelInputComponent title="SMTP User Name" />
            <LabelInputComponent title="SMTP Host" />
            <LabelInputComponent title="SMTP Port" />
            <LabelInputComponent title="SMTP Password" />
            <Col style={{ textAlign: "end" }}>
              <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
            </Col>
          </Col>
        </Col>
        <Col className="tableBox">
          <h3>Manage Payment Gateway</h3>
          <Col>
            <LabelInputComponent title="Manage Api Key" />
            <LabelInputComponent title="SMS Api Key" />
            <Col style={{ textAlign: "end" }}>
              <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
            </Col>
          </Col>
        </Col>
      </LayoutHoc>
    </>
  )
}
