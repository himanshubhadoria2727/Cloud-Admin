import { Button } from "antd";
import React from "react";

function FilledButtonComponent({ children, className, type, onClick, ...rest }) {
  const handleClick = () => {

    console.log("Type: submit");

    if (onClick) {
      onClick();
    }
  };

  return (
    <Button className={className} type={type} onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
}

export default FilledButtonComponent;
