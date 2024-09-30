import React from "react";
import { Checkbox } from "antd";

const CheckBoxComponent = ({ children, className, onChange, ...rest }) => (
  <Checkbox {...rest} className={className} onChange={(e) => onChange(e.target.checked)}>
    {children}
  </Checkbox>
);

export default CheckBoxComponent;