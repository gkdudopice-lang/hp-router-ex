import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import BottomBar from "../Components/common/BottomBar";

import AxiosApi from "../api/AxiosApi";

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

const SeatButton = styled.button`
  width: 50px;
  height: 45px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: ${({ $status, $isSelected }) =>
    $status !== "AVAILABLE" || $isSelected ? "not-allowed" : "pointer"};
  transition: all 0.2s ease-in-out;

  /* 1. 임시 선점 좌석: 연노랑 */
  ${({ $status }) =>
    $status === "HELD" &&
    `
      background-color: #fff2b2;
      color: #927000;
      box-shadow: none;
    `}

  /* 2. 예매 완료 좌석: 회색 */
  ${({ $status }) =>
    $status === "RESERVED" &&
    `
      background-color: #cbd5e1;
      color: #64748b;
      box-shadow: none;
    `}

  /* 3. 내가 선택한 좌석: 보라색 */
  ${({ $status, $isSelected }) =>
    $status === "AVAILABLE" &&
    $isSelected &&
    `
      background-color: purple;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(195, 39, 235, 0.3);
      transform: translateY(-2px);
    `}

  /* 4. 선택 가능한 좌석: 흰색 */
  ${({ $status, $isSelected }) =>
    $status === "AVAILABLE" &&
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

  // 좌석 배열 선언
  const [seats, setSeats] = useState([]);

  // DB에서 해당 회차의 좌석 목록 조회
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const scheduleId = sessionId ?? id;

        const response = await AxiosApi.getSeats(scheduleId);

        console.log("DB 좌석 목록:", response.data);

        const mappedSeats = response.data.map((item) => {
          const status = item.status;
          const seatNumber = item.seatNumber ?? item.SeatNumber;

          return {
            id: item.id,
            name: seatNumber,
            status: status,
            isReserved: status !== "AVAILABLE",
          };
        });

        setSeats(mappedSeats);
      } catch (error) {
        console.error("좌석 목록 조회 실패:", error);
        alert("좌석 정보를 불러오지 못했습니다.");
      }
    };

    fetchSeats();
  }, [sessionId, id]);

  // 선택한 좌석 번호들을 담을 배열
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 예매 요청 중복 방지
  const [loading, setLoading] = useState(false);
  // 좌석 클릭 이벤트
  const handleSeatClick = (seat) => {
    if (seat.status !== "AVAILABLE") return;

    if (selectedSeats.includes(seat.name)) {
      setSelectedSeats(selectedSeats.filter((item) => item !== seat.name));
    } else {
      setSelectedSeats([...selectedSeats, seat.name]);
    }
  };
  // 예매하기 버튼
  const handleBooking = async () => {
    if (selectedSeats.length == 0 || loading) {
      return;
    }
    setLoading(true);
    try {
      const reservationData = {
        scheduleId: sessionId,
        seatNumbers: selectedSeats,
      };
      console.log("예매 전송 데이터:", reservationData);
      const res = await AxiosApi.createReservation(reservationData);

      navigate(`/reservation/payment/${res.data.reservationId}`, {
        state: {
          date: date,
          sessionId: sessionId,
          seats: selectedSeats,
          reservation: res.data,
        },
      });
    } catch (error) {
      console.error("예매 실패 상태:", error.response?.status);
      console.error("서버 오류 내용:", error.response?.data);
      console.error("오류 메시지:", error.message);

      alert("예매 저장에 실패 했습니다.");
    } finally {
      setLoading(false);
    }
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
                  $status={seat.status}
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
          <div>
            <LegendColor color="#fff2b2" /> 임시 선점
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
