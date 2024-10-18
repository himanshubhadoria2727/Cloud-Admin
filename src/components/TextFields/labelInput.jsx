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
  const { getFieldProps, setFieldValue } = useFormikContext();

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
    if (name.includes('amount')) {
      handleNumericChange(e); // Numeric input for 'amount' fields
    } else {
      handleStringChange(e); // String input for 'planname' or other fields
    }
  };

  return (
    <div>
      {title && <label>{title}</label>}
      <Input
        {...getFieldProps(name)}
        placeholder={placeholder}
        className={className}
        disabled={disabledStatus}
        maxLength={maxLength}
        onChange={handleChange} // Custom onChange handler for dynamic input types
        {...rest}
      />
    </div>
  );
}

export default LabelInputComponent;
