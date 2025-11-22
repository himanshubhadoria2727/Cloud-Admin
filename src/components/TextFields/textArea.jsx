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
          .compact-editor .ql-container,
          .full-editor .ql-container {
            font-family: inherit;
          }

          .compact-editor .ql-container {
            height: 150px !important;
            max-height: 150px !important;
            overflow-y: auto !important;
          }

          .full-editor .ql-container {
            height: ${height} !important;
            max-height: ${height} !important;
            overflow-y: auto !important;
          }

          .ql-editor {
            height: 100% !important;
            min-height: unset !important;
            max-height: unset !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            word-wrap: break-word !important;
            word-break: break-all !important;
            overflow-wrap: break-word !important;
            white-space: pre-wrap !important;
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .ql-container {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          .ql-editor p,
          .ql-editor ol,
          .ql-editor ul,
          .ql-editor pre,
          .ql-editor blockquote,
          .ql-editor h1,
          .ql-editor h2,
          .ql-editor h3,
          .ql-editor h4,
          .ql-editor h5,
          .ql-editor h6 {
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
          }

          .ql-container.ql-snow {
            border: 1px solid #ccc;
            border-radius: 0 0 8px 8px;
          }

          .ql-toolbar.ql-snow {
            border: 1px solid #ccc;
            border-radius: 8px 8px 0 0;
          }

          /* Responsive adjustments for Quill editor */
          @media (max-width: 768px) {
            .compact-editor .ql-container {
              height: 180px !important;
              max-height: 180px !important;
              overflow-y: auto !important;
            }

            .full-editor .ql-container {
              height: 200px !important;
              max-height: 200px !important;
              overflow-y: auto !important;
            }

            .ql-editor {
              font-size: 14px;
              padding: 10px;
            }

            .ql-toolbar.ql-snow {
              padding: 4px;
            }

            .ql-toolbar.ql-snow .ql-formats {
              margin-right: 8px;
            }
          }

          @media (max-width: 480px) {
            .compact-editor .ql-container {
              height: 150px !important;
              max-height: 150px !important;
              overflow-y: auto !important;
            }

            .full-editor .ql-container {
              height: 180px !important;
              max-height: 180px !important;
              overflow-y: auto !important;
            }

            .ql-editor {
              font-size: 13px;
              padding: 8px;
            }

            .ql-toolbar.ql-snow {
              padding: 3px;
            }

            .ql-toolbar.ql-snow .ql-formats {
              margin-right: 6px;
            }

            .ql-toolbar.ql-snow button {
              width: 24px;
              height: 24px;
            }
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
