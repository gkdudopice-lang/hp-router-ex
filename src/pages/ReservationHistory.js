import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import AxiosApi from "../api/AxiosApi";

/* ───────── 스타일 컴포넌트 ───────── */
const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PageTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 10px 0;
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background-color: ${({ $active }) => ($active ? "#f3e8ff" : "#f1f5f9")};
  color: ${({ $active }) => ($active ? "#c327eb" : "#64748b")};
  transition: all 0.2s;

  &:hover {
    background-color: #f3e8ff;
    color: #c327eb;
  }
`;

const ReservationCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #64748b;

  .rsv-num {
    font-weight: 600;
    color: #334155;
  }

  .status-badge {
    background-color: ${({ $status }) =>
      $status === "이용 완료"
        ? "#f1f5f9"
        : $status === "취소/환불"
          ? "#fee2e2"
          : "#ecfdf5"};
    color: ${({ $status }) =>
      $status === "이용 완료"
        ? "#64748b"
        : $status === "취소/환불"
          ? "#dc2626"
          : "#059669"};
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: 700;
  }
`;

const CardBody = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  .thumbnail {
    width: 140px;
    height: 90px;
    background-color: #e2e8f0;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 6px;

    h3 {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
  }
`;

const DetailsBox = styled.div`
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;

  strong {
    color: #1e293b;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
`;

const SubButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ $primary }) => ($primary ? "#c327eb" : "#cbd5e1")};
  background-color: ${({ $primary }) => ($primary ? "#c327eb" : "#ffffff")};
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#334155")};
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

/* 바코드 모달 스타일 */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 320px;
  width: 100%;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #1e293b;
  }

  .barcode-box {
    font-family: monospace;
    font-size: 24px;
    letter-spacing: 4px;
    background: #f1f5f9;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    text-align: center;
  }
`;

/* ───────── 메인 컴포넌트 ───────── */
export default function ReservationHistory() {
  // 공연 날짜와 시간에 따라 예매 상태 판별
  const getReservationStatus = (item) => {
    if (item.status === "CANCELLED") {
      return "취소/환불";
    }

    if (item.status === "PAID") {
      const concertDateTime = new Date(
        `${item.concertDate}T${item.concertTime}`,
      );

      if (
        !Number.isNaN(concertDateTime.getTime()) &&
        concertDateTime.getTime() < Date.now()
      ) {
        return "이용 완료";
      }

      return "이용 예정";
    }

    return "";
  };

  const navigate = useNavigate();

  // 탭 상태 ("all", "upcoming", "completed", "cancelled")
  const [activeTab, setActiveTab] = useState("all");

  // 바코드 모달 상태
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [currentBarcode, setCurrentBarcode] = useState("");

  // 예매 내역 상태
  const [reservations, setReservations] = useState([]);

  // DB에서 로그인한 회원의 예매 내역 조회
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await AxiosApi.getMyReservations();

        console.log("내 예매 내역:", response.data);

        const mappedReservations = response.data
          .filter(
            (item) => item.status === "PAID" || item.status === "CANCELLED",
          )
          .map((item) => ({
            id: item.reservationId,
            date: item.reservedAt?.split("T")[0],
            title: item.concertTitle,
            location: item.location,
            schedule: `${item.concertDate} ( ${item.concertTime?.slice(0, 5)} )`,
            seats: `${item.seats.join(", ")}`,
            price: `${item.price.toLocaleString()}원`,
            status: getReservationStatus(item),
            posterUrl: item.posterUrl,
            scheduleId: item.scheduleId,
            productId: item.concertId,
          }));

        setReservations(mappedReservations);
      } catch (error) {
        console.error("예매 내역 조회 실패:", error);
      }
    };

    fetchReservations();
  }, []);

  // 예약 취소 버튼 클릭 시
  const handleCancelReservation = async (targetId) => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) {
      return;
    }

    try {
      // 1. 실제 DB 예매 취소 API 호출
      await AxiosApi.cancelReservation(targetId);

      // 2. 취소된 최신 예매 내역 다시 조회
      const response = await AxiosApi.getMyReservations();

      const mappedReservations = response.data
        .filter((item) => item.status === "PAID" || item.status === "CANCELLED")
        .map((item) => ({
          id: item.reservationId,
          date: item.reservedAt?.split("T")[0],
          title: item.concertTitle,
          location: item.location,
          schedule: `${item.concertDate} ( ${item.concertTime?.slice(0, 5)} )`,
          seats: `${item.seats.join(", ")}`,
          price: `${item.price.toLocaleString()}원`,
          status: getReservationStatus(item),
          posterUrl: item.posterUrl,
          scheduleId: item.scheduleId,
          productId: item.concertId,
        }));

      // 3. 화면 갱신
      setReservations(mappedReservations);

      alert("예약이 취소되어 취소/환불 내역으로 이동되었습니다.");
    } catch (error) {
      console.error("예매 취소 실패:", error);
      alert(error.response?.data?.message || "예매 취소에 실패했습니다.");
    }
  };

  // '리뷰 작성하기' 버튼을 눌렀을 때 실행되는 함수
  const handleGoToReview = (item) => {
    // navigate를 통해 리뷰 작성 페이지로 이동하면서 state에 상품 이름과 예약 번호를 쏙 담아 보냅니다!
    navigate(`/reservation/review/${item.id}`, {
      state: {
        productTitle: item.title,
        bookingDate: item.date,
      },
    });
  };

  // 탭에 따라 필터링된 목록 계산
  const filteredReservations = reservations.filter((item) => {
    if (activeTab === "upcoming") return item.status === "이용 예정";
    if (activeTab === "completed") return item.status === "이용 완료";
    if (activeTab === "cancelled") return item.status === "취소/환불";
    return true; // "all"
  });

  return (
    <Container>
      <PageTitle>예약 내역</PageTitle>

      {/* 탭 메뉴 */}
      <TabWrapper>
        <TabButton
          $active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        >
          전체 ({reservations.length})
        </TabButton>
        <TabButton
          $active={activeTab === "upcoming"}
          onClick={() => setActiveTab("upcoming")}
        >
          이용 예정 (
          {reservations.filter((i) => i.status === "이용 예정").length})
        </TabButton>
        <TabButton
          $active={activeTab === "completed"}
          onClick={() => setActiveTab("completed")}
        >
          이용 완료 (
          {reservations.filter((i) => i.status === "이용 완료").length})
        </TabButton>
        <TabButton
          $active={activeTab === "cancelled"}
          onClick={() => setActiveTab("cancelled")}
        >
          취소/환불 (
          {reservations.filter((i) => i.status === "취소/환불").length})
        </TabButton>
      </TabWrapper>

      {/* 예약 내역 카드 리스트 */}
      {filteredReservations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          해당하는 내역이 없습니다.
        </div>
      ) : (
        filteredReservations.map((item, index) => (
          <ReservationCard key={index}>
            <CardHeader $status={item.status}>
              <span className="rsv-num">
                예매번호: {item.id} | 예매일: {item.date}
              </span>
              <span className="status-badge">{item.status}</span>
            </CardHeader>

            <CardBody>
              <div className="thumbnail">
                {item.posterUrl ? (
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  "상품 이미지"
                )}
              </div>
              <div className="info">
                <h3>{item.title}</h3>
                <p>📍 {item.location}</p>
              </div>
            </CardBody>

            <DetailsBox>
              <div>
                📅 일시: <strong>{item.schedule}</strong>
              </div>
              <div>
                💺 선택 좌석: <strong>{item.seats}</strong>
              </div>
              <div>
                💳 결제금액: <strong>{item.price}</strong>
              </div>
            </DetailsBox>

            <ActionRow>
              {/* 상세보기: 레저베이션 디테일 페이지로 이동 */}
              <SubButton
                onClick={() =>
                  navigate(`/reservation/detail/${item.productId}`)
                }
              >
                상세보기
              </SubButton>

              {/* 이용 예정인 경우에만 예약 취소 가능 */}
              {item.status === "이용 예정" && (
                <SubButton onClick={() => handleCancelReservation(item.id)}>
                  예약 취소
                </SubButton>
              )}

              {/* 상품 바코드 (QR 체크인 대체) */}
              {item.status === "이용 예정" && (
                <SubButton
                  $primary
                  onClick={() => {
                    setCurrentBarcode(`BARCODE-${item.id}`);
                    setBarcodeModalOpen(true);
                  }}
                >
                  상품 바코드
                </SubButton>
              )}
              {item.status === "이용 완료" && (
                <SubButton
                  enabled={true}
                  onClick={() => handleGoToReview(item)}
                  style={{
                    backgroundColor: "#f3e8ff",
                    color: "#c327eb",
                    border: "2px solid #c327eb",
                  }}
                >
                  리뷰 작성하기
                </SubButton>
              )}
            </ActionRow>
          </ReservationCard>
        ))
      )}

      {/* 바코드 모달 팝업 */}
      {barcodeModalOpen && (
        <ModalOverlay onClick={() => setBarcodeModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>입장용 상품 바코드</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              입구에서 아래 바코드를 제시해 주세요.
            </p>
            <div className="barcode-box">║█║▌║█║▌│║▌║</div>
            <div
              style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}
            >
              {currentBarcode}
            </div>
            <Button enabled={true} onClick={() => setBarcodeModalOpen(false)}>
              닫기
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
