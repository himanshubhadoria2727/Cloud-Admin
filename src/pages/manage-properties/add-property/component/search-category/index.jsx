// SearchCategory.jsx

import React, { useState } from 'react';
import { Select } from 'antd';

const SearchCategory = ({ title, options, onCategoryChange, setFieldValue }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (value) => {
    console.log('selectedfeef', value);
    setFieldValue('category', value)
    setSelectedValue(value);
    onCategoryChange(value); // Call the callback function with the selected value
  };

  return (
    <>
      {title && <label>{title}</label>}
      <Select
        defaultValue="Select Category"
        placeholder="Search"
        onChange={handleChange}
        options={options && options.length > 0 && options.map((cat) => {
          return {
            value: cat?._id, label: <span>{cat?.CategoryName}</span>
          }
        })}
      />
    </>
  );
};

export default SearchCategory;
