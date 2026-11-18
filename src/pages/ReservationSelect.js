import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CustomCalendar from "../Components/common/CustomCalendar";
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
  gap: 24px;
`;

const SessionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin: 0;
`;

const SessionCard = styled.div`
  background: ${({ $isPassed }) => ($isPassed ? "#f1f5f9" : "#ffffff")};

  border: 2px solid
    ${({ $isSelected, $isPassed }) =>
      $isSelected ? "#c327eb" : $isPassed ? "#cbd5e1" : "#e2e8f0"};

  border-radius: 16px;
  padding: 20px;

  cursor: ${({ $isPassed }) => ($isPassed ? "not-allowed" : "pointer")};

  opacity: ${({ $isPassed }) => ($isPassed ? 0.6 : 1)};

  transition: all 0.2s ease-in-out;

  box-shadow: ${({ $isSelected }) =>
    $isSelected
      ? "0 4px 12px rgba(195, 39, 235, 0.15)"
      : "0 2px 8px rgba(0, 0, 0, 0.04)"};

  &:hover {
    border-color: ${({ $isPassed }) => ($isPassed ? "#cbd5e1" : "#c327eb")};
  }
`;

const TimeText = styled.div`
  font-size: 20px;
  font-weight: 800;

  color: ${({ $isSelected, $isPassed }) =>
    $isPassed ? "#94a3b8" : $isSelected ? "#c327eb" : "#1e293b"};

  margin-bottom: 10px;
`;

const SeatInfoList = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #475569;
  margin-bottom: 8px;

  span strong {
    color: #0f172a;
  }
`;

const CastText = styled.div`
  font-size: 13px;
  color: #94a3b8;
`;

/* ───────── 메인 컴포넌트 ───────── */

const ReservationSelect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sessionList, setSessionList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [scheduleError, setScheduleError] = useState("");

  // 날짜를 빠르게 바꿔 선택했을 때 이전 요청 결과가 덮어쓰지 않도록 관리
  const requestIdRef = useRef(0);

  // 선택한 날짜의 회차 3개 조회 또는 생성
  const loadSchedules = async (dateString) => {
    const currentRequestId = ++requestIdRef.current;

    try {
      setIsLoadingSchedules(true);
      setScheduleError("");

      // 선택한 날짜를 백엔드에 전달
      const response = await AxiosApi.getOrCreateSchedulesByDate(
        id,
        dateString,
      );

      console.log("선택 날짜의 회차 응답:", response.data);

      // 회차별 잔여 좌석 조회
      const updatedSessions = await Promise.all(
        response.data.map(async (session) => {
          const scheduleId = session.scheduleId ?? session.id;

          let remaining = 0;

          try {
            const seatResponse = await AxiosApi.getRemainingSeats(scheduleId);

            console.log(
              `${scheduleId}번 회차 잔여 좌석 응답:`,
              seatResponse.data,
            );

            remaining =
              typeof seatResponse.data === "number"
                ? seatResponse.data
                : (seatResponse.data.remainingSeats ?? 0);
          } catch (error) {
            console.error(`${scheduleId}번 회차 잔여 좌석 조회 실패:`, error);
          }

          const concertTime = String(session.concertTime);

          return {
            id: scheduleId,
            scheduleId: scheduleId,
            date: session.concertDate,
            time: concertTime.slice(0, 5),
            seats: remaining,
          };
        }),
      );

      // 가장 최근에 선택한 날짜의 요청 결과만 반영
      if (currentRequestId === requestIdRef.current) {
        console.log("최종 회차 목록:", updatedSessions);
        setSessionList(updatedSessions);
      }
    } catch (error) {
      console.error("회차 조회 또는 생성 실패:", error);

      if (currentRequestId === requestIdRef.current) {
        setSessionList([]);
        setScheduleError(
          "회차를 불러오지 못했습니다. 다시 날짜를 선택해 주세요.",
        );
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoadingSchedules(false);
      }
    }
  };

  // 공연 시작 30분 전 예매 마감
  const isSessionPassed = (dateString, timeString) => {
    const now = new Date();

    const [year, month, day] = dateString.split("-").map(Number);
    const [hours, minutes] = timeString.split(":").map(Number);

    const sessionTime = new Date(year, month - 1, day, hours, minutes, 0);

    const deadlineTime = new Date(sessionTime.getTime() - 30 * 60 * 1000);

    return now >= deadlineTime;
  };

  // 날짜 선택
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setSelectedSessionId(null);
    setSessionList([]);

    // 날짜를 선택한 시점에만 해당 날짜의 회차 요청
    loadSchedules(dateString);
  };

  // 회차 선택
  const handleSessionClick = (sessionId) => {
    setSelectedSessionId(sessionId);
  };

  // 뒤로 가기
  const handleClose = () => {
    navigate(-1);
  };

  // 예매하기 버튼
  const handleNextStep = () => {
    const selectedSession = sessionList.find(
      (session) => Number(session.scheduleId) === Number(selectedSessionId),
    );

    if (!selectedSession) {
      alert("선택한 회차를 찾을 수 없습니다.");
      return;
    }

    if (isSessionPassed(selectedSession.date, selectedSession.time)) {
      alert("예매 가능 시간이 마감되었습니다.");
      return;
    }

    if (selectedSession.seats <= 0) {
      alert("잔여 좌석이 없습니다.");
      return;
    }

    // 기존 DB에 저장된 회차 ID 사용
    navigate(`/reservation/seat/${selectedSession.scheduleId}`, {
      state: {
        date: selectedSession.date,
        sessionId: selectedSession.scheduleId,
      },
    });
  };

  // 선택한 날짜에 해당하는 회차만 표시
  const filteredSessions = sessionList.filter(
    (session) => session.date === selectedDate,
  );

  return (
    <Container>
      <CustomCalendar onDateSelect={handleDateSelect} />

      {selectedDate && (
        <SessionSection>
          <SectionTitle>{selectedDate} 회차 선택</SectionTitle>

          {isLoadingSchedules ? (
            <p>회차와 좌석 정보를 불러오는 중입니다...</p>
          ) : scheduleError ? (
            <p>{scheduleError}</p>
          ) : filteredSessions.length === 0 ? (
            <p>선택한 날짜의 회차가 없습니다.</p>
          ) : (
            filteredSessions.map((session) => {
              const isPassed = isSessionPassed(session.date, session.time);

              const isSelected =
                Number(selectedSessionId) === Number(session.id);

              return (
                <SessionCard
                  key={session.id}
                  $isSelected={isSelected}
                  $isPassed={isPassed}
                  onClick={() => {
                    if (isPassed) {
                      alert(
                        "예매 가능 시간이 마감되었습니다. (공연 시작 30분 전 마감)",
                      );
                      return;
                    }

                    handleSessionClick(session.id);
                  }}
                >
                  <TimeText $isSelected={isSelected} $isPassed={isPassed}>
                    {session.time}
                    {isPassed && " (마감)"}
                  </TimeText>

                  <SeatInfoList>
                    <span>
                      전체 잔여 좌석 <strong>{session.seats}</strong>석
                    </span>
                  </SeatInfoList>

                  <CastText>{session.casting}</CastText>
                </SessionCard>
              );
            })
          )}
        </SessionSection>
      )}

      <BottomBar>
        <div>
          <Button
            enabled={
              Boolean(selectedDate && selectedSessionId) &&
              !isSaving &&
              !isLoadingSchedules
            }
            onClick={handleNextStep}
          >
            예매하기
          </Button>
        </div>
      </BottomBar>
    </Container>
  );
};

export default ReservationSelect;
