import React, { useState } from 'react'
import styles from "./plan.module.css"
import LayoutHoc from '@/HOC/LayoutHoc'
import { Col, Row } from 'antd'
import LabelInputComponent from '@/components/TextFields/labelInput'
import FilledButtonComponent from '@/components/Button'
import MyQuillEditor from '@/components/TextFields/textArea'
import Link from 'next/link'
import { SVG } from '@/assest/svg'
import CheckBoxComponent from '@/components/TextFields/checkBox'

export default function AddPlan() {
  const [isFreePlan, setIsFreePlan] = useState(false);
  console.log({ isFreePlan });
  return (
    <>
      <LayoutHoc>
        <Col className={`${styles.title}`}>
          <h3>Add Plan</h3>
          <Link href="/subscription-setting">  <FilledButtonComponent> <SVG.Arrow /> Back</FilledButtonComponent></Link>
        </Col>
        <Col className="tableBox">
          <Col>
            <LabelInputComponent title="Plan Name :" />

            <Col>
              <LabelInputComponent title="Amount:" disabledStatus={isFreePlan} />
              <CheckBoxComponent
                content="Free Plan"
                className="planCheckbox"
                onChange={(vl) => setIsFreePlan(vl)}
              />
            </Col>
            <Col className={`${styles.messageCount}`}>
            <LabelInputComponent title="Text Messages Count :" />
            <LabelInputComponent title="Audio Messages Count  :" />
            <LabelInputComponent title="Video Messages Count :" />
            </Col>
            <MyQuillEditor label="Description" />
            <Col style={{ textAlign: "end", marginTop: "16px" }}>
              <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
            </Col>
          </Col>
        </Col>
      </LayoutHoc>
    </>
  )
}
