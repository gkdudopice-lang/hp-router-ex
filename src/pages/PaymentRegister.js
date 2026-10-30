// src/pages/mypage/PaymentRegister.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackButton from "../Components/common/BackButton";

const PaymentRegister = () => {
  const navigate = useNavigate();

  const handleAccountRegister = () => {
    alert("계좌 등록 기능으로 연결됩니다.");
    // TODO: 실제 계좌 등록 API 연동 또는 이전 페이지로 이동
    navigate("/mypage/payment");
  };

  const handleCardRegister = () => {
    alert("카드 등록 기능으로 연결됩니다.");
    // TODO: 실제 카드 등록 API 연동 또는 이전 페이지로 이동
    navigate("/mypage/payment");
  };

  return (
    <Container>
      {/* 💡 상단 헤더 영역 (공통 백버튼 + 정중앙 타이틀) */}
      <HeaderRow>
        <BackButton to="/mypage/payment" />{" "}
        {/* 뒤로 가기 누르면 결제수단 관리로 이동 */}
        <Title>결제수단 등록</Title>
      </HeaderRow>

      {/* 등록 버튼 영역 */}
      <ButtonWrapper>
        <RegisterButton onClick={handleAccountRegister}>
          계좌 등록하기
        </RegisterButton>
        <RegisterButton onClick={handleCardRegister}>
          카드 등록하기
        </RegisterButton>
      </ButtonWrapper>
    </Container>
  );
};

/* ───────── 스타일 컴포넌트 (화이트·블랙·보라 감성) ───────── */
const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 40px auto;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ButtonWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const RegisterButton = styled.button`
  width: 100%;
  max-width: 360px;
  height: 52px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #c327eb; /* 마우스 올리면 포인트 보라색 테두리 */
    color: #c327eb;
    background-color: #faf5ff; /* 아주 연한 보라빛 배경 */
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default PaymentRegister;
