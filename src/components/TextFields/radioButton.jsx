import React from 'react';
import { Radio } from 'antd';
const RadioBox = ({children, ... rest}) => <Radio {... rest}>{children}</Radio>;
export default RadioBox;