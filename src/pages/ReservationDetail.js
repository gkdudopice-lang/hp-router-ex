import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import BottomBar from "../Components/common/BottomBar";
import AxiosApi from "../api/AxiosApi";

/* ───────── 스타일 컴포넌트 ───────── */
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px 80px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* 1. 표지(이미지) 영역 */
const PosterBox = styled.div`
  width: 100%;
  height: 400px;
  background-color: #e2e8f0;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #64748b;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

/* 2. 상단 스크롤 탭 메뉴 (sticky로 고정) */
const TabNav = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 10px;
  z-index: 10;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button`
  padding: 8px 14px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
    color: #c327eb;
  }
`;

/* 3. 상세 콘텐츠 섹션 박스들 */
const SectionBox = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 250px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 10px;
    margin-bottom: 6px;
  }

  p {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
  }
`;

const ReservationDetail = () => {
  const { id } = useParams(); // URL에서 상품 번호(id) 가져오기
  const navigate = useNavigate();
  const [concert, setConcert] = useState(null);

  useEffect(() => {
    const loadConcert = async () => {
      try {
        const response = await AxiosApi.getConcertDetail(id);
        setConcert(response.data);
        console.log("공연정보:", response.data);
      } catch (error) {
        console.error("공연 조회 실패:", error);
      }
    };
    loadConcert();
  }, [id]);
  // 각 섹션으로 스크롤 이동을 위한 useRef 선언
  const sectionRefs = {
    notice: useRef(null),
    casting: useRef(null),
    detail: useRef(null),
    price: useRef(null),
    guide: useRef(null),
    refund: useRef(null),
    location: useRef(null),
    review: useRef(null),
  };

  const scrollToSection = (key) => {
    sectionRefs[key].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // 하단 예매하기 버튼 클릭
  const handleBookingClick = () => {
    // 로그인 여부 확인
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "TRUE") {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 로그인한 경우 예매 페이지로 이동
    navigate(`/reservation/select/${id}`);
  };

  return (
    <Container>
      <PosterBox>
        {/* 1. 표지 이미지 */}
        {concert?.posterUrl && (
          <img src={concert.posterUrl} alt={concert.title} />
        )}
      </PosterBox>
      {/* 2. 상단 탭 네비게이션 */}
      <TabNav>
        <TabButton onClick={() => scrollToSection("notice")}>
          공지사항
        </TabButton>
        <TabButton onClick={() => scrollToSection("casting")}>캐스팅</TabButton>
        <TabButton onClick={() => scrollToSection("detail")}>
          상품상세
        </TabButton>
        <TabButton onClick={() => scrollToSection("price")}>가격정보</TabButton>
        <TabButton onClick={() => scrollToSection("guide")}>이용안내</TabButton>
        <TabButton onClick={() => scrollToSection("refund")}>
          취소/환불
        </TabButton>
        <TabButton onClick={() => scrollToSection("location")}>장소</TabButton>
        <TabButton onClick={() => scrollToSection("review")}>리뷰</TabButton>
      </TabNav>

      {/* 3. 각 상세 정보 섹션들 */}
      <SectionBox ref={sectionRefs.notice}>
        <h2>공지사항</h2>
        <p>{concert?.notice}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.casting}>
        <h2>캐스팅</h2>
        <p>{concert?.casting}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.detail}>
        <h2>상품상세</h2>
        <p>{concert?.detail}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.price}>
        <h2>가격 및 할인 정보</h2>
        <p>{concert?.priceInfo}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.guide}>
        <h2>이용안내</h2>
        <p>{concert?.guide}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.refund}>
        <h2>취소 및 환불 규정</h2>
        <p>{concert?.refund}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.location}>
        <h2>장소 오시는 길</h2>
        <p>{concert?.location}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.review}>
        <h2>리뷰</h2>
        <p>
          ⭐ 4.9 / 5.0 (총 128개의 후기가 있습니다.)
          <br />
          "정말 최고의 공연이었습니다! 다음에도 또 예매할게요."
        </p>
      </SectionBox>

      {/* 하단 예매하기 고정 버튼 */}
      <BottomBar>
        <div>
          <Button enabled={true} onClick={handleBookingClick}>
            예매하기
          </Button>
        </div>
      </BottomBar>
    </Container>
  );
};

export default ReservationDetail;
