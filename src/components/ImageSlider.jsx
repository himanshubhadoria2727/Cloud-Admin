import React from "react";
import { Carousel } from "antd";
import styles from "./ImageSlider.module.css"; // Create a CSS module for styling

const ImageSlider = ({ images }) => {
  return (
    <Carousel autoplay>
      {images.map((image, index) => (
        <div key={index} className={styles.imageContainer}>
          <img src={image} alt={`Property Image ${index + 1}`} className={styles.image} />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageSlider; 