import React, { useEffect, useState } from "react";
import styles from "./subscription.module.css";
import LayoutHoc from "@/HOC/LayoutHoc";
import { Col } from "antd";
import CheckBoxComponent from "@/components/TextFields/checkBox";
import MyQuillEditor from "@/components/TextFields/textArea";
import FilledButtonComponent from "@/components/Button";
import DateRangePickerComponent from "@/components/TextFields/datepicker";
import Link from "next/link";
import DataTable from "@/components/Datatable";
import Image from "next/image";
import { IMAGES } from "@/assest/images";
import LabelInputComponent from "@/components/TextFields/labelInput";
import TextAreaComponent from "@/components/TextFields/textArea";
import SelectDropdownComponent from "@/components/TextFields/selectDropdown";
import RadioBox from "@/components/TextFields/radioButton";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import {
  addsubcription,
  deletdsubcription,
  subcriptionapi,
} from "@/api/subcriptionapi";
import moment from "moment/moment";
import Swal from "sweetalert2";
import { deleteAlertContext } from "@/HOC/alert";
import { toast } from "react-toastify";

export default function SubscriptionSetting() {
  const [sub, setsub] = useState([]);
  const [loading, setloading] = useState(false);

  const initialValues = {
    planname: "",
    description: "",
    plantype: [
      {
        country: "",
        amount: "",
      },
    ],
  };
  const validateYupSchema = Yup.object().shape({
    planname: Yup.string().required("Plan Name is required"),
    description: Yup.string().required("Description is required"),
    plantype: Yup.array()
      .of(
        Yup.object().shape({
          country: Yup.string().required("Country is required"),
          amount: Yup.number()
            .required("Amount is required")
            .typeError("Amount must be a number")
            .positive("Amount must be greater than zero"),
        })
      )
      .min(1, "At least one plan type is required")
      .required("At least one plan type is required"),
  });

  // Define your dynamic options
  const countryOptions = [
    { value: "india", label: "India" },
    { value: "germany", label: "Germany" },
    { value: "austria", label: "Austria" },
    { value: "italy", label: "Italy" },
    { value: "france", label: "France" },
    { value: "russia", label: "Russia" },
    { value: "uk", label: "United Kingdom" },
    { value: "usa", label: "USA" },
    { value: "japan", label: "Japan" },
    { value: "china", label: "China" },
    { value: "south_korea", label: "South Korea" },
    { value: "spain", label: "Spain" },
    { value: "canada", label: "Canada" },
    { value: "netherlands", label: "Netherlands" },
    { value: "switzerland", label: "Switzerland" },
    { value: "poland", label: "Poland" },
    { value: "australia", label: "Australia" },
    { value: "brazil", label: "Brazil" },
    { value: "mexico", label: "Mexico" },
    { value: "sweden", label: "Sweden" },
    { value: "czech_republic", label: "Czech Republic" },
    { value: "others", label: "and others" },
  ];

  const columns = [
    {
      title: "Plan Id",
      dataIndex: "id",
      key: "id",
      width: "16%",
    },
    {
      title: "Plan Name",
      dataIndex: "plan_name",
      key: "plan_name",
      width: "20%",
      searchable: true,
      // ...getColumnSearchProps("mobilenumber"),
    },
    {
      title: "Plan Type",
      dataIndex: "plan_type",
      key: "plan_type",
      width: "20%",
      searchable: true,
      // ...getColumnSearchProps("name"),
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      searchable: true,
      // ...getColumnSearchProps("slug"),
    },
    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      width: "20%",
      searchable: true,
      // ...getColumnSearchProps("slug"),
    },

    {
      title: "Action",
      dataIndex: "option",
      key: "option",
    },
  ];

  useEffect(() => {
    subcriptionapi().then((data) => {
      setsub(data?.data?.data);
    });
  }, [loading]);

  console.log(sub, "dhceieii");

  const deleteduser = (id) => {
    setloading(true);

    Swal.fire(deleteAlertContext).then((data) => {
        if (data.isConfirmed) {
            deletdsubcription(id)
                .then((data) => {
                    console.log(data, "checking response is");
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                })
                .catch((err) => {
                    setloading(false);
                    console.error("Error deleting subscription:", err);
                    // Show error message using SweetAlert
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.message || "An error occurred while deleting the subscription.",
                    });
                })
                .finally(() => {
                    setloading(false); // Ensures loading state is cleared
                });
        } else {
            setloading(false); // Clear loading if the user cancels
        }
    });
};

  if (loading) {
    return <h6></h6>;
  }

  return (
    <>
      <LayoutHoc>
        <Formik
          initialValues={initialValues}
          validationSchema={validateYupSchema}
          onSubmit={(values) => {
            console.log(values, "sciehui");
            setloading(true);
            addsubcription(values)
              .then((data) => {
                if (data) {
                  setloading(false);
                  toast.success("Plan added successfully");
                }
              })
              .catch((error) => {
                setloading(false);
                console.error(
                  "Error adding subscription:",
                  error.response ? error.response.data : error.message
                );
                throw error;
              });
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Col className={`${styles.title}`}>
                <h3>Manage Subscription Setting</h3>
              </Col>

              <Col className="tableBox">
                <h3>Create Subscription</h3>
                <Col>
                  <LabelInputComponent
                    title="Plan name"
                    name="planname"
                    maxLength={30} // Limit the input to 30 characters
                  />{""}
                  <ErrorMessage name="planname">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>
                  <TextAreaComponent
                    label="Plan Description"
                    name="description"
                    placeholder="Description"
                    setFieldValue={setFieldValue}
                  />
                  <ErrorMessage name="description">
                    {(msg) => <div className={styles.error}>{msg}</div>}
                  </ErrorMessage>

                  {values.plantype.length > 0 &&
                    values.plantype.map((planAmount, index) => (
                      <Col key={index} style={{ marginTop: "20px" }}>
                        <Col
                          style={{ marginBottom: "14px", marginTop: "14px" }}
                        >
                          <SelectDropdownComponent
                            placeholder="Country Selection"
                            title="Country Selection"
                            options={countryOptions}
                            onChange={(value) =>
                              setFieldValue(`plantype[${index}].country`, value)
                            }
                          />
                          <ErrorMessage name={`plantype[${index}].country`}>
                            {(msg) => <div className={styles.error}>{msg}</div>}
                          </ErrorMessage>
                        </Col>
                        <LabelInputComponent
                          title={`Plan Amount (Monthly)`}
                          name={`plantype[${index}].amount`}
                          maxLength={10}
                        />
                        <ErrorMessage name={`plantype[${index}].amount`}>
                          {(msg) => <div className={styles.error}>{msg}</div>}
                        </ErrorMessage>

                        {index > 0 && (
                          <FilledButtonComponent
                            onClick={() =>
                              setFieldValue(
                                "plantype",
                                values.plantype.filter((o, i) => i !== index)
                              )
                            }
                            className={`${styles.deleteBtn}`}
                          >
                            <Image src={IMAGES.Delete} alt="" />
                          </FilledButtonComponent>
                        )}
                      </Col>
                    ))}
                  <Col style={{ marginTop: "1px" }}>
                    <FilledButtonComponent
                      onClick={() => {
                        setFieldValue(`plantype`, [
                          ...values.plantype,
                          { country: "", amount: "" },
                        ]);
                      }}
                      className={`${styles.deleteBtn}`}
                    >
                      <Image src={IMAGES.Add} alt="" />
                    </FilledButtonComponent>
                  </Col>

                  <Col style={{ textAlign: "end", marginTop: "18px" }}>
                    <button className="btn submit" type="submit">
                      Save
                    </button>
                  </Col>
                </Col>
              </Col>
            </Form>
          )}
        </Formik>

        <Col className="tableBox">
          <h3>View Subscription</h3>
          <DataTable
            rowData={
              sub &&
              sub.length > 0 &&
              sub.map((s, id) => ({
                key: id,
                id: parseInt(s?._id?.slice(-8), 12),
                plan_type: "Monthly",
                plan_name: s?.planname,
                amount:
                  s?.plantype?.length > 0 &&
                  s?.plantype?.map((am) => `${am.amount} `),
                creation_date: moment(s?.updatedAt).format("L"),
                option: (
                  <Image
                    src={IMAGES.Delete}
                    alt=""
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                    }}
                    onClick={() => deleteduser(s?._id)}
                  />
                ),
              }))
            }
            colData={columns}
          />
        </Col>
      </LayoutHoc>
    </>
  );
}
