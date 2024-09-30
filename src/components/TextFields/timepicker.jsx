import { Col, TimePicker } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';

const format = 'HH:mm';

export default function TimepickerComponent({ title }) {
  const [visible, setVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleOpenChange = (openValue) => {
    setVisible(openValue);
  };

  const handleTimeChange = (time) => {
    console.log({time});
    setSelectedTime(time);
  };

  const handleClose = () => {
    // Apply the selected time or perform any other action
    console.log('Selected Time:', selectedTime);

    // Close the TimePicker
    setVisible(false);
  };

  return (
    <>
      <Col className='timepicker'>
        {title && <label>{title}</label>}
        <TimePicker
          placeholder='hh:mm'
          format={format}
          open={visible}
          onOpenChange={handleOpenChange}
          onChange={handleTimeChange}
          changeOnBlur={handleTimeChange}
          onBlur={handleClose} // This event is triggered when the TimePicker loses focus
        />
      </Col>
    </>
  );
}
