import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const API_BASE_URL = "http://localhost:8111";
const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

// 전체 페이지
const CheckoutContainer = styled.div`
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 50px 20px;
  box-sizing: border-box;

  background-color: #f5f7fa;
`;

// 결제 카드
const CheckoutBox = styled.div`
  width: 900px;
  max-width: 100%;

  padding: 60px 70px;
  box-sizing: border-box;

  background-color: #ffffff;
  border-radius: 20px;

  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);

  @media (max-width: 600px) {
    padding: 35px 20px;
  }
`;

// 제목
const CheckoutTitle = styled.h2`
  margin: 0 0 35px;

  font-size: 28px;
  font-weight: bold;
  color: #333333;

  text-align: center;
`;

// 상품 정보 영역
const OrderInfoBox = styled.div`
  width: 100%;
  padding: 25px 30px;
  margin-bottom: 30px;

  box-sizing: border-box;

  background-color: #f8f9fa;
  border-radius: 12px;
`;

// 상품 정보 한 줄
const OrderInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 20px;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    flex-shrink: 0;
    font-size: 15px;
    color: #666666;
  }

  b {
    font-size: 16px;
    color: #333333;
    text-align: right;
    word-break: break-word;
  }
`;

// 결제 금액
const OrderAmount = styled.b`
  font-size: 22px !important;
  color: #c327eb !important;
`;

// 토스 결제 UI 바깥쪽
const PaymentMethodWrapper = styled.div`
  width: 100%;
  margin-top: 25px;
`;

// 토스 약관 UI 바깥쪽
const AgreementWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

// 오류 메시지
const ErrorMessage = styled.p`
  margin: 0 0 20px;
  padding: 15px 20px;

  background-color: #fff1f0;
  border: 1px solid #ffc9c5;
  border-radius: 10px;

  color: #d93025;
  font-size: 14px;
  line-height: 1.5;

  word-break: break-word;
`;

// 결제 버튼
const PaymentButton = styled.button`
  width: 100%;
  margin-top: 35px;
  padding: 18px;

  border: none;
  border-radius: 10px;

  background-color: #c327eb;
  color: #ffffff;

  font-size: 18px;
  font-weight: bold;

  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #a81cd0;
  }

  &:disabled {
    background-color: #b8c9e0;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export function WidgetCheckoutPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { date, sessionId, seats, reservation } = location.state || {};
  // 이전 예매 결제 페이지에서 전달받은 예매 정보
  const concertTime = reservation?.concertTime?.slice(0, 5);
  // 예약 완료 후 전달받은 예약 ID
  const reservationId = searchParams.get("reservationId");

  const [widgets, setWidgets] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [ready, setReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentRequesting, setPaymentRequesting] = useState(false);
  const initializationStarted = useRef(false);
  useEffect(() => {
    if (initializationStarted.current) {
      return;
    }

    initializationStarted.current = true;

    async function initializePayment() {
      try {
        if (!reservationId) {
          throw new Error("예약번호가 없습니다.");
        }

        if (!clientKey) {
          throw new Error("토스 클라이언트 키가 설정되지 않았습니다.");
        }

        const token = localStorage.getItem("accessToken");

        // 1. Spring Boot에서 주문 정보 가져오기
        const prepareResponse = await fetch(
          `${API_BASE_URL}/api/payment/prepare`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && {
                Authorization: `Bearer ${token}`,
              }),
            },
            body: JSON.stringify({
              reservationId: Number(reservationId),
            }),
          },
        );

        const prepareData = await prepareResponse.json();

        console.log("prepare 상태코드 =", prepareResponse.status);

        console.log("prepare 응답내용 =", prepareData);

        if (!prepareResponse.ok) {
          throw new Error(
            prepareData.message ||
              prepareData.error ||
              prepareData.detail ||
              `주문 정보 요청 실패: ${prepareResponse.status}`,
          );
        }

        setOrderInfo(prepareData);

        // 2. 토스 SDK 초기화
        const tossPayments = await loadTossPayments(clientKey);

        // 3. 결제 위젯 생성
        const paymentWidgets = tossPayments.widgets({
          customerKey: ANONYMOUS,
        });

        // 4. 결제 금액 설정
        await paymentWidgets.setAmount({
          currency: "KRW",
          value: Number(prepareData.amount),
        });

        // 5. 토스 결제 UI와 약관 UI 렌더링
        await Promise.all([
          paymentWidgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),

          paymentWidgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        setWidgets(paymentWidgets);
        setReady(true);
      } catch (error) {
        console.error("결제 위젯 초기화 오류:", error);

        setErrorMessage(error.message || "결제 준비에 실패했습니다.");
      }
    }

    initializePayment();
  }, [reservationId]);

  // 결제 버튼 클릭

  async function handlePayment() {
    if (paymentRequesting || !widgets || !orderInfo) {
      return;
    }

    setPaymentRequesting(true);

    try {
      await widgets.requestPayment({
        orderId: orderInfo.orderId,
        orderName: orderInfo.orderName,

        successUrl: window.location.origin + "/payment/success",

        failUrl: window.location.origin + "/payment/fail",
      });
    } catch (error) {
      console.error("결제 요청 오류:", error);

      setErrorMessage(error.message || "결제 요청에 실패했습니다.");
      setPaymentRequesting(false);
    }
  }

  return (
    <CheckoutContainer>
      <CheckoutBox>
        <CheckoutTitle>예약 결제</CheckoutTitle>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        {orderInfo && (
          <OrderInfoBox>
            <OrderInfoItem>
              <span>상품명</span>
              <b>{reservation?.concertTitle ?? "-"}</b>
            </OrderInfoItem>

            <OrderInfoItem>
              <span>상품 번호</span>
              <b>{reservation?.concertId ?? "-"}</b>
            </OrderInfoItem>

            <OrderInfoItem>
              <span>관람 일시</span>
              <b>
                {date ?? "-"} {concertTime ? `(${concertTime})` : ""}
              </b>
            </OrderInfoItem>

            <OrderInfoItem>
              <span>선택 좌석</span>
              <b>{seats.length > 0 ? seats.join(", ") : "좌석 정보 없음"}</b>
            </OrderInfoItem>

            <OrderInfoItem>
              <span>결제 금액</span>
              <OrderAmount>
                {Number(orderInfo.amount).toLocaleString()}원
              </OrderAmount>
            </OrderInfoItem>
          </OrderInfoBox>
        )}

        {/* 토스 결제 UI: ID 변경 금지 */}
        <PaymentMethodWrapper>
          <div id="payment-method" />
        </PaymentMethodWrapper>

        {/* 토스 이용약관 UI: ID 변경 금지 */}
        <AgreementWrapper>
          <div id="agreement" />
        </AgreementWrapper>

        <PaymentButton
          type="button"
          disabled={!ready || paymentRequesting}
          onClick={handlePayment}
        >
          {paymentRequesting
            ? "결제창을 여는 중..."
            : ready
              ? "결제하기"
              : "결제 정보를 불러오는 중..."}
        </PaymentButton>
      </CheckoutBox>
    </CheckoutContainer>
  );
}
