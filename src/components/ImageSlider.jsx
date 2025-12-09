import React from "react";
import { Carousel } from "antd";
import Image from "next/image";
import styles from "./ImageSlider.module.css";

const ImageSlider = ({ images }) => {
  const transformImageUrl = (url) => {
    if (!url) return null;
    return url.replace('http://localhost:8000', process.env.NEXT_PUBLIC_REST_API_ENDPOINT || 'http://localhost:8000');
  };

  // Filter out null/undefined images
  const validImages = (images || []).filter(image => image && transformImageUrl(image));

  if (validImages.length === 0) {
    return (
      <div className={styles.imageContainer}>
        <div className={styles.noImage}>No images available</div>
      </div>
    );
  }

  return (
    <Carousel autoplay>
      {validImages.map((image, index) => {
        const transformedUrl = transformImageUrl(image);
        return (
          <div key={index} className={styles.imageContainer}>
            <Image
              src={transformedUrl}
              alt={`Property Image ${index + 1}`}
              className={styles.image}
              width={800}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default ImageSlider;