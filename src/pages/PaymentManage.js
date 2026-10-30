// src/pages/mypage/PaymentManage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackButton from "../Components/common/BackButton";

const PaymentManage = () => {
  const navigate = useNavigate();

  // 결제수단 목록 상태 (어떤 것이 주 거래인지 관리)
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: "토스뱅크", number: "100-00-00**-**0", isPrimary: false },
    { id: 2, name: "토스뱅크", number: "100-00-00**-**0", isPrimary: false },
    { id: 3, name: "토스뱅크", number: "100-00-00**-**0", isPrimary: true },
  ]);

  // 주 거래 카드 설정 함수 (클릭한 항목만 true로 변경)
  const handleSetPrimary = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isPrimary: method.id === id,
      })),
    );
  };

  // 결제수단 추가 페이지로 이동하는 함수
  const handleNavigateToAdd = () => {
    navigate("/payment-register"); // (필요에 따라 주소 확인)
  };

  return (
    <Container>
      {/* 💡 상단 헤더 영역 (공통 백버튼 + 정중앙 타이틀) */}
      <HeaderRow>
        <BackButton to="/mypage/account" />{" "}
        {/* 뒤로 가기 누르면 계정 정보로 이동 */}
        <Title>결제수단 관리</Title>
      </HeaderRow>

      {/* 결제수단 목록 영역 */}
      <MethodListWrapper>
        {paymentMethods.map((method) => (
          <MethodItem key={method.id} $isPrimary={method.isPrimary}>
            {/* 별표 아이콘 (클릭 시 주 거래 설정) */}
            <StarButton
              onClick={() => handleSetPrimary(method.id)}
              $isPrimary={method.isPrimary}
              title="주 거래 설정"
            >
              ★
            </StarButton>

            <CardIcon />

            <InfoArea>
              <span className="title">{method.name}</span>
              <span className="number">{method.number}</span>
            </InfoArea>
          </MethodItem>
        ))}
      </MethodListWrapper>

      {/* 결제수단 추가하기 버튼 */}
      <AddButton onClick={handleNavigateToAdd}>+ 결제수단 추가하기</AddButton>
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

const MethodListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MethodItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background-color: #ffffff;
  border: 1px solid ${(props) => (props.$isPrimary ? "#c327eb" : "#e2e8f0")}; /* 주 거래 카드일 때 보라색 테두리 강조 */
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;

  &:hover {
    border-color: #c327eb;
  }
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  /* 💡 활성화되면 포인트 보라색(#c327eb), 아니면 연한 회색 */
  color: ${(props) => (props.$isPrimary ? "#c327eb" : "#cbd5e1")};
  transition:
    transform 0.1s ease,
    color 0.2s;

  &:active {
    transform: scale(0.9);
  }
`;

const CardIcon = styled.div`
  width: 50px;
  height: 35px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }

  .number {
    font-size: 13px;
    color: #64748b;
  }
`;

const AddButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #f3e8ff; /* 연한 보라색 배경 (포인트 톤) */
  border: 1px solid #d8b4fe;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  color: #c327eb; /* 포인트 보라색 텍스트 */
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    background-color: #e9d5ff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default PaymentManage;
