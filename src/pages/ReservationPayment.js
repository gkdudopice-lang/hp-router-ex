import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import BottomBar from "../Components/common/BottomBar";

/* ───────── 스타일 컴포넌트 ───────── */
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionBox = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 8px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #475569;

  span:last-child {
    font-weight: 600;
    color: #0f172a;
  }
`;

const TotalPriceRow = styled(InfoRow)`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;

  span:last-child {
    color: #c327eb;
  }
`;

/* 결제 수단 선택 버튼 그룹 */
const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const MethodButton = styled.button`
  padding: 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "#f3e8ff" : "#ffffff"};
  color: ${({ $isSelected }) => ($isSelected ? "#c327eb" : "#334155")};
  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "#c327eb" : "#e2e8f0")};

  &:hover {
    border-color: #c327eb;
  }
`;

/* ───────── 메인 컴포넌트 ───────── */
const ReservationPayment = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 페이지(좌석 선택)에서 전달받은 데이터
  const { date, sessionId, seats } = location.state || {
    date: "2026-10-25",
    sessionId: 1,
    seats: ["A1", "A2"], // 테스트용 기본값
  };

  // 선택한 결제 수단 상태 ("card": 신용카드, "transfer": 계좌이체 등)
  const [paymentMethod, setPaymentMethod] = require("react").useState("card");

  // 좌석당 가격 계산 (예시: 1석당 50,000원)
  const pricePerSeat = 50000;
  const totalAmount = seats ? seats.length * pricePerSeat : 0;

  // 결제 완료 버튼 클릭 시
  const handlePaymentSubmit = () => {
    const finalBookingData = {
      productId: id,
      date: date,
      sessionId: sessionId,
      seats: seats,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      bookingNumber: "HP-" + Math.floor(100000 + Math.random() * 900000), // 예매 번호 생성
      paidAt: new Date().toISOString(),
    };

    console.log("최종 결제 및 예매 완료 데이터:", finalBookingData);
    alert("결제가 성공적으로 완료되었습니다!");

    // 예매 완료 후 마이페이지(또는 예약 내역 확인 페이지)로 이동하면서 데이터 전달
    navigate("/reservation/history", {
      state: { newBooking: finalBookingData },
    });
  };

  return (
    <Container>
      {/* 1. 예매 정보 요약 박스 */}
      <SectionBox>
        <h3>예매 정보 확인</h3>
        <InfoRow>
          <span>상품 번호</span>
          <span>상품 {id || "1"}</span>
        </InfoRow>
        <InfoRow>
          <span>관람 일시</span>
          <span>
            {date} ({sessionId === 1 ? "14:00" : "19:30"})
          </span>
        </InfoRow>
        <InfoRow>
          <span>선택 좌석</span>
          <span>{seats && seats.join(", ")}</span>
        </InfoRow>
      </SectionBox>

      {/* 2. 결제 금액 박스 */}
      <SectionBox>
        <h3>결제 금액</h3>
        <InfoRow>
          <span>티켓 금액 ({seats ? seats.length : 0}매)</span>
          <span>{totalAmount.toLocaleString()}원</span>
        </InfoRow>
        <InfoRow>
          <span>할인 금액</span>
          <span>0원</span>
        </InfoRow>
        <TotalPriceRow>
          <span>총 결제 금액</span>
          <span>{totalAmount.toLocaleString()}원</span>
        </TotalPriceRow>
      </SectionBox>

      {/* 3. 결제 수단 선택 박스 */}
      <SectionBox>
        <h3>결제 수단 선택</h3>
        <PaymentMethodGrid>
          <MethodButton
            $isSelected={paymentMethod === "card"}
            onClick={() => setPaymentMethod("card")}
          >
            신용 / 체크카드
          </MethodButton>
          <MethodButton
            $isSelected={paymentMethod === "transfer"}
            onClick={() => setPaymentMethod("transfer")}
          >
            무통장 입금
          </MethodButton>
        </PaymentMethodGrid>
      </SectionBox>

      {/* 하단 공통 결제 버튼 */}
      <BottomBar>
        <div>
          <Button enabled={true} onClick={handlePaymentSubmit}>
            {totalAmount.toLocaleString()}원 결제하기
          </Button>
        </div>
      </BottomBar>
    </Container>
  );
};

export default ReservationPayment;
