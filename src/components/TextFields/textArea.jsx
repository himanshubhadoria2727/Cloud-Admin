// components/MyQuillEditor.js
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useField, useFormikContext } from 'formik';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const MyQuillEditor = ({ label, name, setFieldValue, height = '250px', compact = false }) => {
  const newdat = useFormikContext();
  const [content, setContent] = useState('');
  
  // Helper function to get the nested value from a path like "bedroomDetails.0.leaseTerms"
  const getNestedValue = (obj, path) => {
    if (!path) return '';
    const keys = path.split('.');
    return keys.reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : '';
    }, obj);
  };

  useEffect(() => {
    // For nested fields like bedroomDetails[0].leaseTerms
    const currentValue = getNestedValue(newdat.values, name);
    
    // Only update local state if it's different and not during editing
    if (currentValue !== undefined && currentValue !== content) {
      setContent(currentValue);
    }
  }, [newdat.values, name]);

  const handleChange = (value) => {
    setContent(value);
    // Use the provided setFieldValue function
    setFieldValue(name, value);
  };

  // Custom styles for the editor container
  const containerStyle = {
    marginBottom: '20px',
  };

  // Custom modules config based on compact mode
  const modules = {
    toolbar: compact ? [
      ['bold', 'italic', 'underline'],
      ['clean']
    ] : [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['clean']
    ]
  };

  return (
    <div>
      {label && <label style={{ fontSize: '16px', marginBottom: '8px', display: 'block' }}>{label}</label>}
      <div style={containerStyle} className={compact ? 'compact-editor' : 'full-editor'}>
        <style jsx global>{`
          .compact-editor .ql-container {
            height: auto;
            min-height: 150px;
            max-height: 200px;
          }
          
          .full-editor .ql-container {
            height: auto;
            min-height: ${height};
            max-height: 500px;
          }
          
          .ql-editor {
            min-height: ${compact ? '150px' : height};
            overflow-y: auto;
          }
        `}</style>
        <ReactQuill 
          value={content} 
          onChange={handleChange}
          modules={modules}
        />
      </div>
    </div>
  );
};

export default MyQuillEditor;
