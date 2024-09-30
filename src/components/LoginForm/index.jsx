import { Col, Row } from "antd";
import React from "react";
import styles from "./login.module.css";
import LabelInputComponent from "../TextFields/labelInput";
import FilledButtonComponent from "../Button";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/assest/images";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as yup from "yup";
import { login } from "@/api/login";
import { toast } from "react-toastify";
import { useRouter } from "next/router";


function LoginForm() {
  const router = useRouter()
  const initialvalue = {
    email: "",
    password: ""
  }
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Enter a valid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(5, 'Password must be at least 8 characters')
      .required('Password is required'),
  });


  return (
    <>
      <Formik
        initialValues={initialvalue}
        // validationSchema={validationSchema}

        onSubmit={(values) => {


          console.log(values, "sciehui");
          login(values).then((res) => {
            if (res?.data?.Message === "Invalid Credential") {
              toast.error('Invalid Credential')
              return
            }

            localStorage.setItem("auth_token", res?.data?.token);
            toast.success('Logged in Succesfully.')
            router.push('/dashboard')

          })
        }}
      >
        <Form>

          <div>
            <Col>
              <Row>

                <Col md={24}>
                  <Col className={`${styles.rightBody}`}>
                    <div className={`${styles.loginBox}`}>
                      <Col className={`${styles.title}`}>
                        <h2>Tabla</h2>
                      </Col>
                      {/* <Image src={IMAGES.Logo} alt="" /> */}
                      <h3>LOGIN</h3>
                      <LabelInputComponent title="Email" placeholder="Email" name="email" />
                      <LabelInputComponent title="Password" placeholder="Password" name="password" />

                      {" "}
                      <button type="submit" className={`${styles.submitBtn}`}>
                        Submit
                      </button>

                    </div>
                  </Col>
                </Col>
              </Row>
            </Col>
          </div>
        </Form>
      </Formik>
    </>
  );
}

export default LoginForm;
