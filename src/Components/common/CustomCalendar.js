import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";

const CalendarWrapper = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
    background: transparent;
  }

  .react-calendar__navigation button {
    color: #333;
    font-weight: bold;
    font-size: 16px;
  }

  .react-calendar__tile--active {
    background: #333 !important;
    color: white !important;
    border-radius: 8px;
  }

  .react-calendar__tile {
    border-radius: 8px;
    padding: 12px 0;
  }

  .react-calendar__tile:hover {
    background-color: #f0f0f0;
  }

  /* 비활성화된 날짜 스타일 (흐리게 처리) */
  .react-calendar__tile:disabled {
    background-color: #f9f9f9;
    color: #d1d1d1;
    cursor: not-allowed;
  }
`;

const CustomCalendar = ({ onDateSelect }) => {
  const [value, setValue] = useState(new Date());

  // 1. 최소 선택 가능일: 오늘 날짜
  const today = new Date();

  // 2. 최대 선택 가능일: 오늘 기준으로 정확히 3달 뒤 계산
  const maxLimitDate = new Date();
  maxLimitDate.setMonth(today.getMonth() + 3);

  const handleDateChange = (nextDate) => {
    setValue(nextDate);
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, "0");
    const day = String(nextDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    if (onDateSelect) {
      onDateSelect(formattedDate);
    }
  };

  return (
    <CalendarWrapper>
      <Calendar
        onChange={handleDateChange}
        value={value}
        minDate={today} // 오늘 이전 날짜 선택 불가
        maxDate={maxLimitDate} // 3달 뒤 이후 날짜 선택 불가
        formatDay={(locale, date) =>
          date.toLocaleString("en", { day: "numeric" })
        }
      />
    </CalendarWrapper>
  );
};

export default CustomCalendar;
