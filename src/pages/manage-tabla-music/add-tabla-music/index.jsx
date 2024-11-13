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
import { sub } from "date-fns";

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
    // {
    //   value: "F",
    //   label: "F",
    // },
    // {
    //   value: "F#",
    //   label: "F#",
    // },
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
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState("C");
  const [raagValue, setRaagValue] = useState("Purvi");
  const [subraagValue, setSubRaagValue] = useState("Asaravi");
  const [fileSections, setFileSections] = useState([
    { title: "File 1", bpm: "100HZ" },
  ]);

  const [allSubCategories, setAllSubCategories] = useState([]);
  console.log(allSubCategories, "allSubCategories");

  const handleCategoryChange = async (value) => {
    try {
      // Step 1: Set the selected category value.
      setSelectedValue(value);
      console.log("Category selected:", value);

      // Simulating an asynchronous operation with a Promise, e.g., fetching subcategories from a server
      const fetchSubcategories = new Promise((resolve, reject) => {
        const filteredSubcategories = allSubCategories.filter(
          (subCategory) => subCategory.category._id === value
        );

        if (filteredSubcategories.length === 0) {
          reject(
            new Error("No subcategories found for the selected category.")
          );
        } else {
          resolve(filteredSubcategories);
        }
      });

      // Step 2: Await the promise to filter subcategories and handle async flow
      const filteredSubcategories = await fetchSubcategories;
      console.log("Filtered Subcategories: ", filteredSubcategories);

      // Step 3: Update subRaagOption with the filtered subcategories.
      setsubRaagOption(filteredSubcategories);
      console.log("Updated subRaagOption", filteredSubcategories);
    } catch (error) {
      // Handle any errors during the async operation
      console.error("Error handling category change:", error.message);

      // If no subcategories were found, clear the subRaagOption.
      setsubRaagOption([]);
      console.log("Cleared subRaagOption due to error or no subcategories.");
    }
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
    // taal: [
    //   {
    //     name: "",
    //   },
    // ],

    bpm: [""],
    taalfiles: [],
  };
  useEffect(() => {
    getCategoryapi().then((data) => {
      console.log(data, "defhrghf");
      setRaagOption(data?.data?.allCategories);
    });
    getSubcategory().then((data) => {
      console.log(data, "dhceugyur");
      // setsubRaagOption(data?.data);
      setAllSubCategories(data?.data);
    });
  }, []);
  const tablaschema = Yup.object().shape({
    pitch: Yup.string().required("Pitch is required"),
    taalname: Yup.string().required("Taal Name is required"),
    subtaalname: Yup.string().nullable("SubTaal Name is required"),
    taalfiles: Yup.array()
      .of(
        Yup.mixed()
          .test("fileType", "Only .mp3 files are allowed", (value) => {
            return value && value.type === "audio/mpeg";
          })
          .required("File is required")
      )
      .min(1, "At least one file is required"),
    bpm: Yup.array()
      .of(Yup.string().required("BPM is required"))
      .min(1, "At least one BPM is required"),
  });

  console.log(subRaagOption, "nduwuwfue");

  const handleSubmit = (values) => {
    setLoading(true);
    const formdata = new FormData();
    formdata.append("taalname", values?.taalname);
    formdata.append("subtaalname", values ? values?.subtaalname : undefined);
    formdata.append("pitch", values?.pitch);

    // Append non-empty taal entries
    // if (Array.isArray(values?.taal)) {
    //     values.taal.forEach((item, index) => {
    //         if (item?.name) {
    //             formdata.append(`taal[${index}][name]`, item.name);
    //         }
    //     });
    // }

    // Append non-empty bpm entries and taalfiles
    if (Array.isArray(values?.bpm)) {
      values.bpm.forEach((item, index) => {
        if (item) {
          formdata.append(`bpm[${index}]`, item);
        }
        if (values.taalfiles && values.taalfiles[index]) {
          formdata.append("taalfiles", values.taalfiles[index]);
        }
      });
    }

    // Submit the form data
    addTabla(formdata).then((data) => {
      console.log(data?.data?.message, "challllllllllllllllllllll");
      toast.success(`${data?.data?.message}`);
      setLoading(false);
      router.back();
    });
  };

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
                    defaultValue={dynamicOptions}
                    onChange={(value) => {
                      setFieldValue("pitch", value);
                    }}
                    options={dynamicOptions}
                  />
                  <ErrorMessage name="pitch">
                    {(msg) => <div className={styles.errorMessage}>{msg}</div>}
                  </ErrorMessage>{" "}
                </Col>
                <Col className={styles.titleBox}>
                  <SearchCategory
                    title="Select Taal Name"
                    defaultValue={RaagOption}
                    onChange={(value) => {
                      setFieldValue("taalname", value);
                      // Fetch subcategories specific to the selected Taal
                      handleCategoryChange(value); // Filter and update subcategories here
                    }}
                    options={RaagOption?.map((data) => ({
                      value: data?._id,
                      label: data?.CategoryName,
                    }))}
                  />
                  <ErrorMessage name="taalname">
                    {(msg) => <div className={styles.errorMessage}>{msg}</div>}
                  </ErrorMessage>
                </Col>

                {/* Conditionally render the "Sub Taal Name" dropdown only if there are filtered subcategories */}
                {subRaagOption?.length > 0 && (
                  <Col className={styles.titleBox}>
                    <SearchCategory
                      title="Select Sub Taal Name"
                      defaultValue={subRaagOption}
                      onChange={(value) => {
                        setFieldValue("subtaalname", value);
                      }}
                      options={subRaagOption?.map((data) => ({
                        value: data?._id,
                        label: data?.subCategory,
                      }))}
                    />
                  </Col>
                )}

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
                        <ErrorMessage name="taalfiles">
                          {(msg) => (
                            <div className={styles.errorMessage}>{msg}</div>
                          )}
                        </ErrorMessage>
                      </Col>
                      <Col md={1}></Col>
                      <Col md={12}>
                        <Col className={`${styles.fileName}`}>
                          <LabelInputComponent
                            title="BPM"
                            name={`bpm[${index}]`}
                          />
                          <ErrorMessage name={`bpm[${index}]`}>
                            {(msg) => (
                              <div className={styles.errorMessage}>{msg}</div>
                            )}
                          </ErrorMessage>
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
                  <button
                    className="btn submit"
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: "#4CAF50", // Adjust background color as needed
                      border: "none",
                      borderRadius: "5px",
                      color: "#FFF",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? (
                      <span className="loader">Saving...</span> // Add loader here
                    ) : (
                      "Save"
                    )}
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
