import ImgCrop from 'antd-img-crop';
import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
const BannerUpload = ({ title, addimage, image }) => {
  const [fileList, setFileList] = useState([]);


  useEffect(() => {
    if (image) {
      // If there is a server image, add it to the fileList
      setFileList([
        {
          uid: '-1',
          name: 'server-image',
          status: 'done',
          url: image, // assuming 'image' is the link to the server image
        },
      ]);
    }
  }, [image]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    addimage(newFileList[0]?.originFileObj
    )
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <>
      {title && <label >{title}</label>}
      <ImgCrop rotationSlider>
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
        >
          {fileList.length < 1 && '+ Upload'}
        </Upload>
      </ImgCrop>
    </>
  );
};
export default BannerUpload;