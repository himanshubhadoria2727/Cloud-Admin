import React from "react";
import { Carousel } from "antd";
import Image from "next/image";
import styles from "./ImageSlider.module.css";

const ImageSlider = ({ images }) => {
  const transformImageUrl = (url) => {
    if (!url) return url;
    return url.replace('http://localhost:8000', process.env.NEXT_PUBLIC_REST_API_ENDPOINT);
  };

  return (
    <Carousel autoplay>
      {images.map((image, index) => (
        <div key={index} className={styles.imageContainer}>
          <Image 
            src={transformImageUrl(image)} 
            alt={`Property Image ${index + 1}`} 
            className={styles.image}
            width={800}
            height={600}
            layout="responsive"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageSlider;