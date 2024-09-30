import { Select } from "antd";
import React from "react";

function SelectInput({ option, title, ...rest }) {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      {" "}
      {title && <label style={{ display: "block" }}>{title}</label>}
      <Select
        {...rest}
        defaultValue="lucy"
        onChange={handleChange}
        options={option}
      />
    </>
  );
}

export default SelectInput;
