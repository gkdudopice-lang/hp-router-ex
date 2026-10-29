import React from "react";
import styled from "styled-components";
// 예약 디테일, 싯, 셀렉트에 사용될 하단 버튼 고정 바

const BarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  padding: 16px 20px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  z-index: 100;

  div {
    width: 100%;
    max-width: 500px;
  }
`;

const BottomBar = ({ children }) => {
  return (
    <BarWrapper>
      <div>{children}</div>
    </BarWrapper>
  );
};

export default BottomBar;
