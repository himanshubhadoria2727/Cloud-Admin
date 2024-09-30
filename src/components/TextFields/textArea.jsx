// components/MyQuillEditor.js
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useField, useFormikContext } from 'formik';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const MyQuillEditor = ({ label, name, setFieldValue }) => {


  const newdat = useFormikContext()

  const [content, setContent] = useState('');

  useEffect(() => {
    // Check if 'field' is defined and has a value before updating local state
    if (newdat.values[name] !== content) {
      setContent(newdat.values[name]);
    }
  }, [newdat.values[name], content]);

  const handleChange = (value) => {
    setContent(value);
    setFieldValue(name, value);

  };

  return (
    <div>
      {label && <label style={{ fontSize: '16px' }}>{label} :</label>}
      <ReactQuill value={content} onChange={handleChange} />
    </div>
  );
};

export default MyQuillEditor;
