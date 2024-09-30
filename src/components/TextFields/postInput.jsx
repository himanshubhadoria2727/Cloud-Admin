import { Input } from "antd";
import React from "react";

function PostInputComponent({ tag, value, className, ...rest }) {
  return (
    <Input
      {...rest}
      addonAfter={tag}
      className={className}
      defaultValue={value}
    />
  );
}

export default PostInputComponent;
