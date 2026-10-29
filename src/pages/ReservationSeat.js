import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button"; // 기존에 쓰던 공통 버튼 그대로 활용
import BottomBar from "../Components/common/BottomBar";

/* ───────── 스타일 컴포넌트 ───────── */
const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 30px 20px 100px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

/* 상단 스크린 바 */
const ScreenBox = styled.div`
  width: 100%;
  background-color: #334155;
  color: #ffffff;
  text-align: center;
  padding: 12px;
  font-weight: 700;
  font-size: 15px;
  border-radius: 8px;
  letter-spacing: 2px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const GuideText = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;

/* 좌석 배치 영역 (콘서트장 느낌의 정렬) */
const SeatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center;
  background: #ffffff;
  padding: 24px 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const SeatRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

/* 개별 좌석 버튼 스타일 */
const SeatButton = styled.button`
  width: 50px;
  height: 45px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: ${({ $isReserved }) => ($isReserved ? "not-allowed" : "pointer")};
  transition: all 0.2s ease-in-out;

  /* 1. 예매 완료된 좌석 (진한 회색) */
  ${({ $isReserved }) =>
    $isReserved &&
    `
      background-color: #cbd5e1;
      color: #64748b;
      box-shadow: none;
    `}

  /* 2. 내가 선택한 좌석 */
  ${({ $isSelected, $isReserved }) =>
    !$isReserved &&
    $isSelected &&
    `
      background-color: purple;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(195, 39, 235, 0.3);
      transform: translateY(-2px);
    `}

  /* 3. 선택 가능한 좌석 (화이트 + 입체 그림자 + 호버 시 보라색 테두리) */
  ${({ $isSelected, $isReserved }) =>
    !$isReserved &&
    !$isSelected &&
    `
      background-color: #ffffff;
      color: #334155;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);

      &:hover {
        border-color: purple;
        color: purple;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(195, 39, 235, 0.15);
      }
    `}
`;

/* 하단 상태 범례 안내 */
const LegendBox = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
  align-items: center;
  margin-top: 4px;

  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const LegendColor = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  border: ${({ border }) => border || "none"};
`;

/* 선택한 좌석 확인 상자 */
const SelectedInfoBox = styled.div`
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  span {
    color: #c327eb;
    font-weight: 700;
  }
`;

/* ───────── 메인 컴포넌트 ───────── */
const ReservationSeat = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 앞 페이지에서 넘어온 날짜와 회차 정보
  const { date, sessionId } = location.state || {};

  // 30개의 좌석 데이터 (A~E열, 각 6석)
  const [seats, setSeats] = useState([
    { id: "A1", name: "A1", isReserved: false },
    { id: "A2", name: "A2", isReserved: true }, // 예매 완료 예시
    { id: "A3", name: "A3", isReserved: false },
    { id: "A4", name: "A4", isReserved: false },
    { id: "A5", name: "A5", isReserved: false },
    { id: "A6", name: "A6", isReserved: false },

    { id: "B1", name: "B1", isReserved: false },
    { id: "B2", name: "B2", isReserved: false },
    { id: "B3", name: "B3", isReserved: true }, // 예매 완료 예시
    { id: "B4", name: "B4", isReserved: false },
    { id: "B5", name: "B5", isReserved: false },
    { id: "B6", name: "B6", isReserved: false },

    { id: "C1", name: "C1", isReserved: false },
    { id: "C2", name: "C2", isReserved: false },
    { id: "C3", name: "C3", isReserved: false },
    { id: "C4", name: "C4", isReserved: false },
    { id: "C5", name: "C5", isReserved: false },
    { id: "C6", name: "C6", isReserved: false },

    { id: "D1", name: "D1", isReserved: false },
    { id: "D2", name: "D2", isReserved: false },
    { id: "D3", name: "D3", isReserved: false },
    { id: "D4", name: "D4", isReserved: false },
    { id: "D5", name: "D5", isReserved: false },
    { id: "D6", name: "D6", isReserved: false },

    { id: "E1", name: "E1", isReserved: false },
    { id: "E2", name: "E2", isReserved: false },
    { id: "E3", name: "E3", isReserved: false },
    { id: "E4", name: "E4", isReserved: false },
    { id: "E5", name: "E5", isReserved: false },
    { id: "E6", name: "E6", isReserved: false },
  ]);

  // 선택한 좌석 번호들을 담을 배열
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 좌석 클릭 이벤트
  const handleSeatClick = (seat) => {
    if (seat.isReserved) return; // 팔린 좌석은 클릭 방지

    if (selectedSeats.includes(seat.name)) {
      setSelectedSeats(selectedSeats.filter((item) => item !== seat.name));
    } else {
      setSelectedSeats([...selectedSeats, seat.name]);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  // 예매하기 버튼 클릭 시 (백엔드로 보낼 데이터 정리)
  const handleBooking = () => {
    if (selectedSeats.length === 0) return;

    const bookingData = {
      productId: id,
      date: date,
      sessionId: sessionId,
      seats: selectedSeats,
      bookingTime: new Date().toISOString(), // 예매 시간
    };

    console.log("백엔드로 전송될 최종 데이터:", bookingData);

    // 다음 결제/완료 페이지로 이동
    navigate(`/reservation/payment/${id}`, {
      state: bookingData,
    });
  };

  // 6개씩 끊어서 행(Row)으로 나누기
  const rows = [
    seats.slice(0, 6),
    seats.slice(6, 12),
    seats.slice(12, 18),
    seats.slice(18, 24),
    seats.slice(24, 30),
  ];

  return (
    <Container>
      <ScreenBox>SCREEN · 스크린</ScreenBox>
      <GuideText>원하시는 좌석을 클릭해 선택하세요.</GuideText>

      <SeatContainer>
        {rows.map((row, rowIndex) => (
          <SeatRow key={rowIndex}>
            {row.map((seat) => {
              const isSelected = selectedSeats.includes(seat.name);

              return (
                <SeatButton
                  key={seat.id}
                  $isReserved={seat.isReserved}
                  $isSelected={isSelected}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.name}
                </SeatButton>
              );
            })}
          </SeatRow>
        ))}

        <LegendBox>
          <div>
            <LegendColor color="#ffffff" border="1px solid #cbd5e1" /> 선택 가능
          </div>
          <div>
            <LegendColor color="purple" /> 선택한 좌석
          </div>
          <div>
            <LegendColor color="#cbd5e1" /> 예매 완료
          </div>
        </LegendBox>
      </SeatContainer>

      <SelectedInfoBox>
        선택한 좌석:{" "}
        <span>
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "선택된 좌석이 없습니다."}
        </span>
      </SelectedInfoBox>

      {/* 하단 고정 버튼 영역 */}
      <BottomBar>
        <div>
          <Button enabled={selectedSeats.length > 0} onClick={handleBooking}>
            예매하기
          </Button>
        </div>
      </BottomBar>
    </Container>
  );
};

export default ReservationSeat;
