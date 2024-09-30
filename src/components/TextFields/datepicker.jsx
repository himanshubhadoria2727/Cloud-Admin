import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Col } from 'antd';
import { SVG } from '@/assest/svg';

const DateRangePickerComponent = () => {
  const [range, setRange] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const formattedDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const containerRef = useRef();

  function handleClickOutside(event) {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setRange(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  return (
    <Col className='dateField' ref={containerRef}>
      <span className="dateSelect" onClick={() => setRange(!range)}>
        {formattedDate(dateRange[0].startDate)} to {formattedDate(dateRange[0].endDate)}
      </span>
      <SVG.Date onClick={() => setRange(!range)} />
      {range && (
        <DateRangePicker
          ranges={dateRange}
          onChange={handleSelect}
          months={2}
          direction="horizontal"
        />
      )}
    </Col>
  );
};

export default DateRangePickerComponent;
