import React from 'react';
import { Select, Space } from 'antd';

const { Option } = Select;

const SelectDropdownComponent = ({ options, defaultValue, onChange, title, placeholder }) => (
  <>
  {title && <label>{title}</label>}
  <Select

    className='searchCountry'
    style={{ width: '100%' }}
    placeholder={placeholder}
    defaultValue={defaultValue}
    onChange={onChange}
    optionLabelProp="label"
  >
    {options.map((option) => (
      <Option key={option.value} value={option.value} label={option.label}>
        <Space>
          {option.label}
        </Space>
      </Option>
    ))}
  </Select>
  </>
);

export default SelectDropdownComponent;
