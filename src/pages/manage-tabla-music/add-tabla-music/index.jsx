import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "antd";
import LayoutHoc from "@/HOC/LayoutHoc";
import FilledButtonComponent from "@/components/Button";
import styles from "../styles.module.css";
import SearchCategory from "@/components/search-category";
import Fileuploader from "@/components/FIleUpload";
import { SVG } from "@/assest/svg";
import { IMAGES } from "@/assest/images";
import Image from "next/image";
import LabelInputComponent from "@/components/TextFields/labelInput";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { getCategoryapi, getSubcategory } from "@/api/Categoryapi";
import { addTabla } from "@/api/tabla";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as Yup from "yup";

export default function AddTabla() {
  const router = useRouter();
  const [RaagOption, setRaagOption] = useState([]);
  const [subRaagOption, setsubRaagOption] = useState([]);
  const dynamicOptions = [
    {
      value: "C",
      label: "C",
    },
    {
      value: "C#",
      label: "C#",
    },
    {
      value: "D",
      label: "D",
    },
    {
      value: "D#",
      label: "D#",
    },
    {
      value: "E",
      label: "E",
    },
    {
      value: "F",
      label: "F",
    },
    {
      value: "F#",
      label: "F#",
    },
    {
      value: "G",
      label: "G",
    },
    {
      value: "G#",
      label: "G#",
    },
    {
      value: "F",
      label: "F",
    },
    {
      value: "F#",
      label: "F#",
    },
    {
      value: "B",
      label: "B",
    },
  ];

  const RaagOptions = [
    {
      value: "Bhairavi",
      label: "Bhairavi",
    },
    {
      value: "Bilawal",
      label: "Bilawal",
    },
    {
      value: "Kalyan",
      label: "Kalyan",
    },
    {
      value: "Khamaj",
      label: "Khamaj",
    },
    {
      value: "Purvi",
      label: "Purvi",
    },
  ];

  const SubRaagOptions = [
    {
      value: "Asaravi",
      label: "Asaravi",
    },
    {
      value: "Bilawal",
      label: "Bilawal",
    },
    {
      value: "Kalyan",
      label: "Kalyan",
    },
    {
      value: "Khamaj",
      label: "Khamaj",
    },
    {
      value: "Purvi",
      label: "Purvi",
    },
  ];

  const [selectedValue, setSelectedValue] = useState("C");
  const [raagValue, setRaagValue] = useState("Purvi");
  const [subraagValue, setSubRaagValue] = useState("Asaravi");
  const [fileSections, setFileSections] = useState([
    { title: "File 1", bpm: "100HZ" },
  ]);

  const handleCategoryChange = (value) => {
    setSelectedValue(value);
  };

  const handleRaagChange = (value) => {
    setRaagValue(value);
  };
  const handleSubRaagChange = (value) => {
    setSubRaagValue(value);
  };

  const addFileSection = () => {
    const newSection = {
      bpm: selectedValue,
    };
    setFileSections([...fileSections, newSection]);
  };
  const removeFileSection = (index) => {
    const updatedSections = [...fileSections];
    updatedSections.splice(index, 1);
    setFileSections(updatedSections);
  };

  const handleBpmChange = (index, bpm) => {
    const updatedSections = [...fileSections];
    updatedSections[index].bpm = bpm;
    setFileSections(updatedSections);
  };

  const handleSave = () => {
    // Add your save logic here
    console.log("Save button clicked");
  };

  const [inputCount, setInputCount] = useState(1); // State to track the number of input fields

  const handleAddInput = () => {
    setInputCount((prevCount) => prevCount + 1); // Increment input count on plus icon click
  };
  const initialValues = {
    pitch: "",
    taalname: "",
    subtaalname: "",
    taal: [
      {
        name: "",
      },
    ],

    bpm: [""],
    taalfiles: [],
  };
  useEffect(() => {
    getCategoryapi().then((data) => {
      console.log(data, "defhrghf");
      setRaagOption(data?.data?.allcategory);
    });
    getSubcategory().then((data) => {
      console.log(data, "dhceugyur");
      setsubRaagOption(data?.data);
    });
  }, []);
  const tablaschema = Yup.object().shape({
    pitch: Yup.string().required("Pitch is required"),
    taalname: Yup.string().required("Taal Name is required"),
    subtaalname: Yup.string().required("SubTaal Name is required"),
    taal: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Taal Name is required"),
        })
      )
      .min(1, "At least one Taal is required"),
    bpm: Yup.array()
      .of(Yup.string().required("BPM is required"))
      .min(1, "At least one BPM is required"),
  });

  console.log(subRaagOption, "nduwuwfue");

  const handleSubmit = (values)=>{
    const formdata = new FormData();
    formdata.append("taalname", values?.taalname);
    formdata.append("subtaalname", values?.subtaalname);
    formdata.append("pitch", values?.pitch);

    for (let i = 0; i <= values?.taal?.length; i++) {
      formdata.append(`taal[${i}][name]`, values?.taal[i]?.name);
    }
    for (let i = 0; i <= values?.bpm?.length; i++) {
      formdata.append(`bpm[${i}]`, values?.bpm[i]);
      formdata.append("taalfiles", values?.taalfiles[i]);
    }

    addTabla(formdata).then((data) => {
      console.log(data?.data?.message, "challllllllllllllllllllll");
      toast.success(`${data?.data?.message}`);
      router.back();
    });
  }

  return (
    <>
      <LayoutHoc>
        <Formik
          initialValues={initialValues}
          validationSchema={tablaschema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Col className={styles.title}>
                <h3>Add Tabla Music</h3>
                <Link href="/manage-tabla-music">
                  {" "}
                  <FilledButtonComponent>
                    {" "}
                    <SVG.Arrow /> Back
                  </FilledButtonComponent>
                </Link>
              </Col>
              <Col className="tableBox fileAttach">
                <Col className={styles.titleBox}>
                  <SearchCategory
                    title="Select Pitch"
                    defaultValue={selectedValue}
                    onChange={(value) => {
                      setFieldValue("pitch", value);
                    }}
                    options={dynamicOptions}
                  />
                  <ErrorMessage name="pitch" style={{ color: "red" }} />
                </Col>
                <Col className={styles.titleBox}>
                  <SearchCategory
                    title="Select Taal Name "
                    defaultValue={RaagOption}
                    onChange={(value) => {
                      setFieldValue("taalname", value);
                    }}
                    options={
                      RaagOption &&
                      RaagOption.length > 0 &&
                      RaagOption?.map((data) => ({
                        value: data?._id,
                        label: data?.CategoryName,
                      }))
                    }
                  />
                  <ErrorMessage name="taalname" style={{ color: "red" }} />
                </Col>

                <Col className={styles.titleBox}>
                  <SearchCategory
                    title="Select Sub Taal Name"
                    defaultValue={subRaagOption}
                    onChange={(value) => {
                      setFieldValue("subtaalname", value);
                    }}
                    options={
                      subRaagOption &&
                      subRaagOption.length > 0 &&
                      subRaagOption?.map((data) => ({
                        value: data?._id,
                        label: data?.subCategory,
                      }))
                    }
                  />
                </Col>
                <Col className={styles.taalBox}>
                  <label>Taal</label>
                  {/* Render input fields based on inputCount state */}

                  <Row className={styles.taalInput}>
                    {values?.taal?.length > 0 &&
                      values?.taal.map((tal, index) => (
                        <>
                          <Col md={2} key={index} className="taalInput">
                            <LabelInputComponent name={`taal[${index}].name`} />
                            <ErrorMessage
                              name={`taal[${index}].name`}
                              style={{ color: "red" }}
                            />
                          </Col>
                          {index > 0 && (
                            <Image
                              src={IMAGES.Delete}
                              alt=""
                              onClick={() => {
                                setFieldValue(
                                  "taal",
                                  values?.taal?.filter((o, i) => i !== index)
                                );
                              }}
                              style={{
                                cursor: "pointer",
                                height: "20px",
                                width: "20px",
                                marginTop: "12px",
                              }}
                            />
                          )}
                        </>
                      ))}
                  </Row>

                  <Col>
                    <Image
                      src={IMAGES.Add}
                      alt=""
                      style={{
                        // Image with cursor pointer
                        cursor: "pointer",
                        height: "20px",
                        width: "20px",
                        position: "relative",
                        top: "7px",
                      }}
                      onClick={() => {
                        setFieldValue("taal", [...values?.taal, { name: "" }]);
                      }}
                    />{" "}
                    {/* onClick event to add input */}
                  </Col>
                </Col>
                {values?.bpm?.length > 0 &&
                  values?.bpm?.map((taalfile, index) => (
                    <Row key={index} className={`${styles.appendRow}`}>
                      <Col md={11} className={`${styles.fileName}`}>
                        <input
                          type="file"
                          accept=".mp3"
                          onChange={(e) => {
                            let Catfile = e.target.files[0];
                            setFieldValue("taalfiles", [
                              ...values?.taalfiles,
                              Catfile,
                            ]);
                          }}
                          style={{
                            width: "100%",
                            borderRadius: "12px solid red",

                            background: "#FFF",
                            boxShadow:
                              "0px 10px 30px 0px rgba(41, 17, 80, 0.05)",
                            height: "44px",
                            marginBottom: "18px",
                          }}
                        />
                      </Col>
                      <Col md={1}></Col>
                      <Col md={12}>
                        <Col className={`${styles.fileName}`}>
                          <LabelInputComponent
                            title="BPM"
                            name={`bpm[${index}]`}
                          />
                          <ErrorMessage
                            name={`bpm[${index}]`}
                            style={{ color: "red" }}
                          />
                        </Col>
                      </Col>

                      {index > 0 && (
                        <Col style={{ width: "100%" }}>
                          <Image
                            src={IMAGES.Delete}
                            alt=""
                            onClick={() => {
                              setFieldValue(
                                "bpm",
                                values?.bpm?.filter((o, i) => i !== index)
                              );
                            }}
                            style={{
                              cursor: "pointer",
                              height: "20px",
                              width: "20px",
                              marginTop: "12px",
                            }}
                          />
                        </Col>
                      )}
                      <Col>
                        <Image
                          src={IMAGES.Add}
                          onClick={() => {
                            setFieldValue("bpm", [...values?.bpm, ""]);
                          }}
                          alt=""
                          style={{
                            cursor: "pointer",
                            height: "20px",
                            width: "20px",
                            position: " relative",
                            top: "15px",
                          }}
                        />
                      </Col>
                    </Row>
                  ))}

                <Col style={{ textAlign: "end", marginTop: "15px" }}>
                  <button className="btn submit" type="submit" onClick={handleSubmit}>
                    Save
                  </button>
                </Col>
              </Col>
            </Form>
          )}
        </Formik>
      </LayoutHoc>
    </>
  );
}
