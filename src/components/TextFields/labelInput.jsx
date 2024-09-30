import { Form, Input } from "antd";
import React from "react";
import { useField, useFormikContext, ErrorMessage } from "formik";

function LabelInputComponent({ title, className, placeholder, disabledStatus, name, ...rest }) {
  const newdat = useFormikContext()
  return (
    <div>
      {title && <label>{title}</label>}
      {
        name ? <Input
          {...newdat.getFieldProps(`${name}`)}
          placeholder={placeholder} className={className} disabled={disabledStatus} {...rest} /> : <Input

          placeholder={placeholder} className={className} disabled={disabledStatus} {...rest} />
      }
    </div>
  );
}

export default LabelInputComponent;
