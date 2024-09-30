import React from 'react';
import { Input } from 'antd';
const { TextArea } = Input;
const TextField = ({title}) => (
  <>
    {title && <label >{title}</label>}
    <TextArea rows={4} />

  </>
);
export default TextField;