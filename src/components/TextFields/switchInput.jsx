import React from 'react';
import { Switch } from 'antd';

const onChange = (checked) => {
  console.log(`switch to ${checked}`);
};

const SwitchInput = ({title, ...rest}) =><label> <Switch defaultChecked { ...rest} onChange={onChange} />{title} </label>;

export default SwitchInput;
