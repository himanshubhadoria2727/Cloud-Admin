import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutHoc from '@/HOC/LayoutHoc';
import styles from "../category.module.css";
import { Col } from 'antd';
import LabelInputComponent from '@/components/TextFields/labelInput';
import FilledButtonComponent from '@/components/Button';
import Link from 'next/link';
import { SVG } from '@/assest/svg';
import { addCategory } from '@/features/category/categorySlice';
import { useRouter } from 'next/router';

export default function AddCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const { status, error } = useSelector((state) => state.category);

    const handleSubmit = async () => {
        if (!categoryName) {
            alert("Category name is required");
            return;
        }
        if (!categoryImage) {
            alert("Category image is required");
            return;
        }

        const formData = new FormData();
        formData.append('CategoryName', categoryName);
        formData.append('image', categoryImage);

        // Debugging FormData entries
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
            if (key === 'image') {
                console.log('Image File:', value);
                console.log('Image File Type:', value.type);
                console.log('Image File Size:', value.size);
            }
        }

        try {
            const result = await dispatch(addCategory(formData)).unwrap();
            console.log("Dispatch result:", result);
            router.back();
        } catch (error) {
            console.error("Error during category addition:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file);
            setCategoryImage(file);
        }
    };

    return (
        <LayoutHoc>
            <Col className={`${styles.title}`}>
                <h3 style={{ position: "relative", top: "6px" }}>Add Category</h3>
                <Link href="/manage-raag-sub-raag">
                    <FilledButtonComponent>
                        <SVG.Arrow /> Back
                    </FilledButtonComponent>
                </Link>
            </Col>
            <Col className="tableBoxed tableBox">
                <Col>
                    <LabelInputComponent 
                        type="text" 
                        title="Category Name" 
                        value={categoryName} 
                        onChange={(e) => setCategoryName(e.target.value)} 
                    />
                </Col>
                <Col>
                    <LabelInputComponent 
                        type="file" 
                        title="Category Image" 
                        onChange={handleFileChange} 
                    />
                </Col>
                <Col style={{ textAlign: "end", marginTop: "15px" }}>
                    <FilledButtonComponent className="btn submit" onClick={handleSubmit}>
                        Save
                    </FilledButtonComponent>
                </Col>
            </Col>
            {status === 'loading' && <p>Saving category...</p>}
            {status === 'failed' && (
                <p>Error: {typeof error === 'string' ? error : 'An error occurred'}</p>
            )}
        </LayoutHoc>
    );
}
