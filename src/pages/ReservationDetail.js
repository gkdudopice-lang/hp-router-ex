import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import BottomBar from "../Components/common/BottomBar";

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
  height: 380px;
  background-color: #e2e8f0;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #64748b;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

  // 하단 예매하기 버튼 클릭 시 -> 날짜 및 회차 선택 페이지로 이동 (추후 라우트 연결)
  const handleBookingClick = () => {
    navigate(`/reservation/select/${id}`);
  };

  return (
    <Container>
      {/* 1. 표지 이미지 */}
      <PosterBox>표지 (이미지 영역) - 상품 {id || "1"}</PosterBox>

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
        <p>관람객 입장 안내 및 안전 수칙에 대한 공지사항 샘플 텍스트입니다.</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.casting}>
        <h2>캐스팅</h2>
        <p>출연진 정보 샘플: 최재림, 이해원, 송원근, 에블린 등</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.detail}>
        <h2>상품상세</h2>
        <p>
          본 상품의 상세 소개 및 시놉시스, 주요 특징에 대한 설명이 들어갑니다.
        </p>
      </SectionBox>

      <SectionBox ref={sectionRefs.price}>
        <h2>가격 및 할인 정보</h2>
        <p>
          VIP석 150,000원 | R석 120,000원 | S석 90,000원 | A석 60,000원
          <br />
          장애인 및 국가유공자 30% 할인 적용 가능
        </p>
      </SectionBox>

      <SectionBox ref={sectionRefs.guide}>
        <h2>이용안내</h2>
        <p>
          관람 연령: 중학생 이상 관람가 / 러닝타임: 150분 (인터미션 15분 포함)
        </p>
      </SectionBox>

      <SectionBox ref={sectionRefs.refund}>
        <h2>취소 및 환불 규정</h2>
        <p>
          예매 후 7일 이내 취소 시 취소수수료가 면제되며, 관람일 전일까지 환불
          신청이 가능합니다.
        </p>
      </SectionBox>

      <SectionBox ref={sectionRefs.location}>
        <h2>장소 오시는 길</h2>
        <p>
          공연장 위치: 서울시 예술의전당 오페라극장 (주차장이 혼잡하오니
          대중교통을 이용해 주세요.)
        </p>
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
