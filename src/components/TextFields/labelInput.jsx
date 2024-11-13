import { Input } from "antd";
import React from "react";
import { useFormikContext } from "formik";

function LabelInputComponent({
  title,
  className,
  placeholder,
  disabledStatus,
  name,
  maxLength,
  ...rest
}) {
  const { getFieldProps, setFieldValue, touched, errors } = useFormikContext();

  // Function to handle numeric input (allows decimal values)
  const handleNumericChange = (e) => {
    const value = e.target.value;
    // Allow empty string, numbers, or decimal numbers
    const numericValue = value === "" || /^\d*\.?\d*$/.test(value) ? value : getFieldProps(name).value;
    setFieldValue(name, numericValue);
  };

  // Function to handle string input
  const handleStringChange = (e) => {
    setFieldValue(name, e.target.value);
  };

  // Determine the input type based on the name or custom logic
  const handleChange = (e) => {
    if (name.includes('amount') || name.includes('phone_no')) {
      handleNumericChange(e); // Numeric input for 'amount' fields
    } else {
      handleStringChange(e); // String input for other fields
    }
  };

  return (
    <div className={`label-input-component ${className}`}>
      {title && <label htmlFor={name}>{title}</label>}
      <Input
        id={name} // Use id for better accessibility
        {...getFieldProps(name)}
        placeholder={placeholder}
        disabled={disabledStatus}
        maxLength={maxLength}
        onChange={handleChange} // Custom onChange handler for dynamic input types
        {...rest}
      />
      {/* Display error message if the field has been touched and there is an error
      {touched[name] && errors[name] && (
        <div className="error-message">{errors[name]}</div>
      )} */}
    </div>
  );
}

export default LabelInputComponent;
