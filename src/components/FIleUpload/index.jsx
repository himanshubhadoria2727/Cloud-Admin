import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Upload } from 'antd';


const Fileuploader = ({ title, setFieldValue, index, name, count }) => {
    const [fileList, setFileList] = useState([

    ]);
    const handleChange = ({ fileList: newFileList, }) => {

        console.log(newFileList, "cheking");
        console.log(name, "efhehfuefuu");
        if (count === 0) {
            setFieldValue(name, newFileList[0]?.originFileObj
            )
            return
        }
        const allfiles = newFileList && newFileList?.length > 0 && newFileList?.map((data) => {
            return data?.originFileObj

        })
        console.log(allfiles, "cheking all files");

        setFieldValue(name, allfiles)
        setFileList(newFileList)
    };


    return (
        <>
            <Col>
                {title && <label>{title}</label>}
                <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture"
                    fileList={fileList}

                    onChange={handleChange}
                >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Col>
        </>
    );
}
export default Fileuploader;