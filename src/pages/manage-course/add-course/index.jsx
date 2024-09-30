import LayoutHoc from '@/HOC/LayoutHoc'
import { Col } from 'antd'
import React, { useState } from 'react'
import styles from "../styles.module.css"
import LabelInputComponent from '@/components/TextFields/labelInput'
import SelectDropdownComponent from '@/components/TextFields/selectDropdown'
import FilledButtonComponent from '@/components/Button'
import MyQuillEditor from '@/components/TextFields/textArea'
import { IMAGES } from '@/assest/images'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import Link from 'next/link'
import { SVG } from '@/assest/svg'
import TimepickerComponent from '@/components/TextFields/timepicker'
import TextField from '@/components/TextFields/textFIeld'

export default function AddDevice() {

    const [contentSections, setContentSections] = useState([
        {
            title: '',
            mediaFile: null,
            embedCode: '',
        },
    ]);

    const handleAddContentSection = () => {
        setContentSections((prevSections) => [
            ...prevSections,
            {
                title: '',
                mediaFile: null,
                embedCode: '',
            },
        ]);
    };

    const handleRemoveContentSection = (index) => {
        setContentSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections.splice(index, 1);
            return updatedSections;
        });
    };

    const handleTitleChange = (index, value) => {
        setContentSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[index].title = value;
            return updatedSections;
        });
    };

    const handleMediaFileChange = (index, file) => {
        setContentSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[index].mediaFile = file;
            return updatedSections;
        });
    };

    const handleEmbedCodeChange = (index, value) => {
        setContentSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[index].embedCode = value;
            return updatedSections;
        });
    };

    const [musicFiles, setMusicFiles] = useState(['']); // Initial state with one empty string

    const handleAddMusicFile = () => {
        setMusicFiles([...musicFiles, '']);
    };

    const handleRemoveMusicFile = (index) => {
        const updatedMusicFiles = [...musicFiles];
        updatedMusicFiles.splice(index, 1);
        setMusicFiles(updatedMusicFiles);
    };

    const [sections, setSections] = useState([
        {
            chapterName: '',
            description: '',
            file: null,
        },
    ]);

    const handleAddSection = () => {
        setSections((prevSections) => [
            ...prevSections,
            {
                chapterName: '',
                description: '',
                file: null,
            },
        ]);
    };

    const handleDeleteSection = (index) => {
        setSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections.splice(index, 1);
            return updatedSections;
        });
    };

    const handleChapterNameChange = (index, value) => {
        setSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[index].chapterName = value;
            return updatedSections;
        });
    };

    const handleDescriptionChange = (index, value) => {
        setSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[index].description = value;
            return updatedSections;
        });
    };

    const handleFileChange = (index, file) => {
        setSections((prevSections) => {
            const updatedSections = [...prevSections];
            updatedSections[index].file = file;
            return updatedSections;
        });
    };
    // Define your dynamic options
    const dynamicOptions = [
        { value: 'one', label: 'one' },
        { value: 'two', label: 'two' },
        // Add more options as needed
    ];
    const difficultOptions = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        // Add more options as needed
    ];


    const handleSelectChange = (value) => {
        console.log(`Selected: ${value}`);
        // Add your custom logic here
    };

    // Define your dynamic options
    const LanguageOptions = [
        { value: 'english', label: 'english' },
        { value: 'hindi', label: 'hindi' },
        { value: 'punjabi', label: 'punjabi' },
        // Add more options as needed
    ];


    return (
        <>
            <LayoutHoc>
                <Col className={`${styles.title}`}>
                    <h3>Add Course</h3>
                    <Link href="/manage-course">  <FilledButtonComponent className={`${styles.arrowBtn}`}> <SVG.Arrow /> Back</FilledButtonComponent></Link>
                </Col>
                <Col className="tableBox">

                    <Col style={{ marginBottom: "14px" }}>
                        <SelectDropdownComponent
                            placeholder="Select Category"
                            title="Category"
                            options={dynamicOptions}
                            onChange={handleSelectChange}
                        />
                    </Col>
                    <Col style={{ marginBottom: "14px" }}>
                        <SelectDropdownComponent
                            placeholder="Select Raag Name"
                            title="Raag Name"
                            options={dynamicOptions}
                            onChange={handleSelectChange}
                        />
                    </Col>
                    <Col style={{ marginBottom: "14px" }}>
                        <SelectDropdownComponent
                            placeholder="Select Taal Name"
                            title="Taal Name"
                            options={dynamicOptions}
                            onChange={handleSelectChange}
                        />
                    </Col>
                    <Col style={{ marginBottom: "14px" }}>
                        <SelectDropdownComponent
                            placeholder="Select Lesson"
                            title="Lesson Type"
                            options={dynamicOptions}
                            onChange={handleSelectChange}
                        />
                    </Col>
                    <Col style={{ marginBottom: "14px" }}>
                        <SelectDropdownComponent
                            placeholder="Difficulty Level"
                            title="Difficulty Level"
                            options={difficultOptions}
                            onChange={handleSelectChange}
                        />
                    </Col>
                    <Col>
                        <LabelInputComponent title="Course Name" />
                    </Col>
                    <Col>
                        <MyQuillEditor
                            classname={`${styles.quillbox}`}
                            label="Course Description"
                          
                        />
                    </Col>
                    <Col>
                        <LabelInputComponent title="Teacher Name" />
                    </Col>
                    <Col style={{ position: "relative" }}>
                        <TimepickerComponent title="Duration" />

                    </Col>


                    <Col style={{ textAlign: "end", marginTop: "16px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
                <Col className={`${styles.title}`}>
                    <h3>Course Material</h3>
                </Col>
                <Col className='tableBox'>
                    {sections.map((section, index) => (
                        <Col key={index} className={`${styles.chapterBox}`}>
                            <LabelInputComponent
                                title="Chapter Name"
                                type="text"
                                value={section.chapterName}
                                onChange={(e) => handleChapterNameChange(index, e.target.value)}
                            />
                            <Col style={{ marginBottom: "14px" }}>
                                <SelectDropdownComponent
                                    placeholder="Content Selection"
                                    title="Content Selection"
                                    options={LanguageOptions}
                                    onChange={handleSelectChange}
                                />
                            </Col>
                            <MyQuillEditor
                                classname={`${styles.quillbox}`}
                                label="Description"
                                value={section.description}
                                onChange={(value) => handleDescriptionChange(index, value)}
                            />
                            <Col>
                                {/* <label>Video</label> */}
                                <Col className="videoSection">
                                    <LabelInputComponent
                                        className={`${styles.fileInput}`}
                                        type="file"
                                        title="Video"
                                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                                    />
                                    {/* <LabelInputComponent title="Embed Code" type="text" className={`${styles.fileInput}`} placeholder="Url" /> */}
                                </Col>
                            </Col>
                            {sections.length > 1 && (
                                <FilledButtonComponent
                                    onClick={() => handleDeleteSection(index)}
                                    className={`${styles.deleteBtn}`}
                                >
                                    <Image src={IMAGES.Delete} alt="" />
                                </FilledButtonComponent>
                            )}
                        </Col>
                    ))}
                    <FilledButtonComponent onClick={handleAddSection} className={`${styles.deleteBtn}`}>
                        <Image src={IMAGES.Add} alt="" />
                    </FilledButtonComponent>
                    <Col style={{ textAlign: "end", marginTop: "16px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
                <Col className={`${styles.title}`}>
                    <h3>Shabad & Translation</h3>
                </Col>
                <Col className='tableBox'>
                    {/* <LabelInputComponent title="Embed Title" type="text" /> */}
                    <TextField title="Embed Title" />
                    <Col style={{ textAlign: "end", marginTop: "16px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
                <Col className={`${styles.title}`}>
                    <h3>Notations</h3>
                </Col>
                <Col className='tableBox'>
                    <Col className={`${styles.videoSection}`}>
                        <Col>
                            <LabelInputComponent title="English Notation (upload pdf)" type="file" className={`${styles.fileInput}`} />
                            <Col className={`${styles.pdfBox}`}>
                                <Col className={`${styles.itemBox}`}>
                                    <SVG.PdfIcon />
                                    <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                                </Col>

                            </Col>
                        </Col>
                        <Col>
                            <LabelInputComponent title="Punjabi Notation (upload pdf)" type="file" className={`${styles.fileInput}`} />
                            <Col className={`${styles.pdfBox}`}>
                                <Col className={`${styles.itemBox}`}>
                                    <SVG.PdfIcon />
                                    <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                                </Col>

                            </Col>
                        </Col>
                        <Col>
                            <LabelInputComponent title="Hindi Notation (upload pdf)" type="file" className={`${styles.fileInput}`} />
                            <Col className={`${styles.pdfBox}`}>
                                <Col className={`${styles.itemBox}`}>
                                    <SVG.PdfIcon />
                                    <Image src={IMAGES.Delete} alt="" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                                </Col>

                            </Col>
                        </Col>
                    </Col>
                    <Col style={{ textAlign: "end", marginTop: "10px", position: 'relative', right: "12px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>

                <Col className={`${styles.title}`}>
                    <h3>Katha (Shabhad explanation)</h3>
                </Col>
                <Col className='tableBox'>
                    {musicFiles.map((musicFile, index) => (
                        <Col key={index}>
                            <LabelInputComponent title="Music File" type="file" className={`${styles.fileInput}`} />
                            {/* Delete icon to remove the current Music File input field */}
                            {index > 0 && (
                                <FilledButtonComponent onClick={() => handleRemoveMusicFile(index)} className={`${styles.deleteBtn}`}>
                                    <Image src={IMAGES.Delete} alt="" />
                                </FilledButtonComponent>
                            )}
                        </Col>
                    ))}
                    {/* Plus icon to append a new Music File input field */}
                    <FilledButtonComponent onClick={handleAddMusicFile} className={`${styles.deleteBtn}`}>
                        <Image src={IMAGES.Add} alt="" />
                    </FilledButtonComponent>
                    {/* Your existing Save button */}
                    <Col style={{ textAlign: "end", marginTop: "10px", position: 'relative', right: "12px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
                <Col className={`${styles.title}`}>
                    <h3>Related Content</h3>
                </Col>
                <Col className='tableBox'>
                    {contentSections.map((section, index) => (
                        <>
                            <Col key={index}>
                                <Col className={`${styles.videoSection}`}>
                                    <LabelInputComponent
                                        title="Title"
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => handleTitleChange(index, e.target.value)}
                                    />
                                    <LabelInputComponent
                                        title="Media File"
                                        type="file"
                                        onChange={(e) => handleMediaFileChange(index, e.target.files[0])}
                                        className={`${styles.fileInput}`}
                                    />
                                    <Col className={`${styles.embededCode}`}>
                                        <p className={`${styles.or}`}>or</p>
                                        <Col style={{ display: "block" }}>
                                            <label>Embed Code</label>
                                            <TextField
                                                value={section.embedCode}
                                                onChange={(e) => handleEmbedCodeChange(index, e.target.value)}
                                            />
                                        </Col>
                                    </Col>
                                    {/* Delete icon to remove the current content section */}

                                </Col>
                                {index > 0 && (
                                    <FilledButtonComponent onClick={() => handleRemoveContentSection(index)} className={`${styles.deleteBtn}`}>
                                        <Image src={IMAGES.Delete} alt="" />
                                    </FilledButtonComponent>
                                )}
                            </Col>
                        </>
                    ))}
                    {/* Plus icon to append a new content section */}
                    <FilledButtonComponent onClick={handleAddContentSection} className={`${styles.deleteBtn}`}>
                        <Image src={IMAGES.Add} alt="" />
                    </FilledButtonComponent>
                    {/* Your existing Save button */}
                    <Col style={{ textAlign: "end", marginTop: "36px", position: 'relative', right: "12px" }}>
                        <FilledButtonComponent className="btn submit">Save</FilledButtonComponent>
                    </Col>
                </Col>
            </LayoutHoc>
        </>
    )
}
