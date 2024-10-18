import { Formik, Form } from 'formik';
import LayoutHoc from '@/HOC/LayoutHoc';
import { Col } from 'antd';
import React from 'react';
import styles from './styles.module.css';
import LabelInputComponent from '@/components/TextFields/labelInput';
import FilledButtonComponent from '@/components/Button';

export default function AdminSetting() {
  return (
    <LayoutHoc>
      <Col className={`${styles.title}`}>
        <h3>Admin Setting</h3>
      </Col>
      <Formik
        initialValues={{
          smtpUserName: '',
          smtpHost: '',
          smtpPort: '',
          smtpPassword: '',
          apiKey: '',
          smsApiKey: '',
        }}
        onSubmit={(values) => {
          // Handle form submission
          console.log('Form values:', values);
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Col className="tableBox">
              <h3>Manage SMTP Password</h3>
              <Col>
                <LabelInputComponent title="SMTP User Name" name="smtpUserName" />
                <LabelInputComponent title="SMTP Host" name="smtpHost" />
                <LabelInputComponent title="SMTP Port" name="smtpPort" />
                <LabelInputComponent title="SMTP Password" name="smtpPassword" />
                <Col style={{ textAlign: 'end' }}>
                  <FilledButtonComponent className="btn submit" type="submit">Save</FilledButtonComponent>
                </Col>
              </Col>
            </Col>
            <Col className="tableBox">
              <h3>Manage Payment Gateway</h3>
              <Col>
                <LabelInputComponent title="Manage Api Key" name="apiKey" />
                <LabelInputComponent title="SMS Api Key" name="smsApiKey" />
                <Col style={{ textAlign: 'end' }}>
                  <FilledButtonComponent className="btn submit" type="submit">Save</FilledButtonComponent>
                </Col>
              </Col>
            </Col>
          </Form>
        )}
      </Formik>
    </LayoutHoc>
  );
}
