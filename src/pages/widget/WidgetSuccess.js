import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

const SuccessPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px 20px;
  box-sizing: border-box;

  background-color: #f5f7fa;
`;

const ResultCard = styled.div`
  width: 650px;
  max-width: 100%;

  padding: 45px 40px;
  box-sizing: border-box;

  background-color: #ffffff;
  border-radius: 20px;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);

  @media (max-width: 600px) {
    padding: 35px 20px;
  }
`;

const ResultIcon = styled.div`
  width: 70px;
  height: 70px;

  margin: 0 auto 25px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background-color: ${(props) => (props.$failed ? "#fff1f0" : "#e8f8ef")};

  color: ${(props) => (props.$failed ? "#d93025" : "#16a05d")};

  font-size: 38px;
  font-weight: bold;
`;

const ResultTitle = styled.h2`
  margin: 0 0 12px;

  text-align: center;
  font-size: 27px;
  font-weight: 700;

  color: #222222;
`;

const ResultDescription = styled.p`
  margin: 0 0 35px;

  text-align: center;
  font-size: 15px;
  line-height: 1.6;

  color: #777777;
`;

const PaymentInfoBox = styled.div`
  padding: 25px;
  margin-bottom: 25px;

  background-color: #f8f9fb;
  border-radius: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 20px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    flex-shrink: 0;
    font-size: 14px;
    color: #777777;
  }

  b {
    font-size: 15px;
    color: #333333;
    text-align: right;
    word-break: break-all;
  }
`;

const AmountText = styled.b`
  font-size: 23px !important;
  color: #c327eb !important;
`;

const ResponseBox = styled.div`
  margin-top: 25px;

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
    color: #333333;
  }

  pre {
    padding: 18px;

    background-color: #f8f9fb;
    border-radius: 10px;

    font-size: 15px;
    line-height: 1.6;
    color: #555555;

    white-space: pre-wrap;
    overflow-wrap: anywhere;
    overflow-x: auto;
  }
`;

const HomeButton = styled(Link)`
  display: block;
  width: 100%;

  margin-top: 30px;
  padding: 17px 20px;
  box-sizing: border-box;

  border-radius: 10px;

  background-color: #c327eb;
  color: #ffffff;

  text-align: center;
  text-decoration: none;

  font-size: 16px;
  font-weight: bold;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: #a81cd0;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function WidgetSuccessPage() {
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount"));

  const confirmStarted = useRef(false);
  useEffect(() => {
    // 결제 승인 요청이 이미 시작됐다면 다시 보내지 않음
    if (confirmStarted.current) {
      return;
    }

    confirmStarted.current = true;

    async function confirmPayment() {
      try {
        if (!paymentKey || !orderId || !amount) {
          throw new Error("결제 승인에 필요한 정보가 없습니다.");
        }

        const token = localStorage.getItem("accessToken");

        const response = await fetch(`${API_BASE_URL}/api/payment/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "결제 승인에 실패했습니다.");
        }

        setResponseData(data);
      } catch (error) {
        console.error("결제 승인 오류:", error);
        setErrorMessage(error.message);
      }
    }

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  return (
    <SuccessPageContainer>
      <ResultCard>
        {errorMessage ? (
          <>
            <ResultIcon $failed>!</ResultIcon>

            <ResultTitle>결제 승인에 실패했어요</ResultTitle>

            <ResultDescription>
              결제 승인 과정에서 문제가 발생했습니다.
              <br />
              아래 오류 내용을 확인해주세요.
            </ResultDescription>

            <PaymentInfoBox>
              <InfoRow>
                <span>오류 내용</span>
                <b>{errorMessage}</b>
              </InfoRow>
            </PaymentInfoBox>

            <HomeButton to="/">메인으로 돌아가기</HomeButton>
          </>
        ) : (
          <>
            <ResultIcon>✓</ResultIcon>

            <ResultTitle>
              {responseData ? "결제가 완료됐어요!" : "결제를 확인하고 있어요"}
            </ResultTitle>

            <ResultDescription>
              {responseData
                ? "예약과 결제가 정상적으로 처리되었습니다."
                : "결제 승인 결과를 확인하고 있습니다. 잠시만 기다려주세요."}
            </ResultDescription>

            <PaymentInfoBox>
              <InfoRow>
                <span>결제금액</span>
                <AmountText>{amount.toLocaleString()}원</AmountText>
              </InfoRow>

              <InfoRow>
                <span>주문번호</span>
                <b>{orderId}</b>
              </InfoRow>
            </PaymentInfoBox>

            <HomeButton to="/">메인으로 돌아가기</HomeButton>
          </>
        )}
      </ResultCard>
    </SuccessPageContainer>
  );
}
