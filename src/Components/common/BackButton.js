import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

/* ───────── 스타일 컴포넌트 ───────── */
const StyledButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  color: #64748b;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #c327eb; /* 마우스 올리면 포인트 보라색으로 변경 */
  }
`;

const BackButton = ({ to, onClick }) => {
  const navigate = useNavigate();

  // 기본 동작: 만약 특정 경로(to)가 있으면 거기로 이동, 없으면 단순히 이전 페이지(-1)로 이동
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <StyledButton onClick={handleClick} aria-label="뒤로 가기">
      〈
    </StyledButton>
  );
};

export default BackButton;
