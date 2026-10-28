import React from "react";
import styled, { css } from "styled-components";

// 1. 실제 스타일이 들어가는 버튼 (button 태그를 스타일링)
const StyledBtn = styled.button`
  width: 100%;
  height: 50px;
  color: white;
  background-color: #999;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 18px;
  cursor: not-allowed;

  /* $enabled가 true일 때 보라색으로 활성화 */
  ${({ $enabled }) =>
    $enabled &&
    css`
      background-color: #c327eb;
      cursor: pointer;

      &:hover {
        background-color: #a81cd0;
      }

      &:active {
        background-color: #c327eb;
      }
    `}
`;

// 2. 외부에서 불러와서 사용할 Button 컴포넌트
const Button = ({ enabled, onClick, children, type = "button" }) => {
  return (
    <StyledBtn
      type={type}
      $enabled={enabled}
      disabled={!enabled}
      onClick={onClick}
    >
      {children}
    </StyledBtn>
  );
};

export default Button;
