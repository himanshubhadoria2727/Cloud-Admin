import React from 'react';
import { Select } from 'antd';

const SearchCategory = ({ defaultValue, onChange, options, title, ...rest }) => {
  // console.log(options, "cheking optoo");
  return (
    <>
      {title && <label>{title}</label>}
      <Select
        {...rest}
        defaultValue={defaultValue}

        onChange={onChange}
        options={options}
      />
    </>
  )
};

export default SearchCategory;
