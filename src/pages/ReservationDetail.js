import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";
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

  // 1. 백엔드에서 받아온 상품 정보를 담을 상태 (초기값 null)
  const [product, setProduct] = useState(null);

  // 2. 페이지가 처음 열릴 때(또는 id가 바뀔 때) 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        // 백엔드 API 호출 (함수명은 실제 만드신 AxiosApi 규격에 맞게 조정하세요)
        const response = await AxiosApi.getConcertDetail(id);
        setProduct(response.data); // 받아온 콘서트/상품 객체 데이터 저장
      } catch (error) {
        console.error("상품 상세 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchProductDetail();
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

  // 하단 예매하기 버튼 클릭 시 -> 날짜 및 회차 선택 페이지로 이동 (추후 라우트 연결)
  const handleBookingClick = () => {
    navigate(`/reservation/select/${id}`);
  };

  // 데이터를 아직 불러오는 중일 때의 처리 (로딩 바나 문구)
  if (!product) {
    return (
      <Container>
        <p>상품 정보를 불러오는 중입니다...</p>
      </Container>
    );
  }

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
        <p>{product.content || "등록된 공지사항이 없습니다."}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.casting}>
        <h2>캐스팅</h2>
        <p>콘서트명: {product.title}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.detail}>
        <h2>상품상세</h2>
        <p>{product.content}</p>
      </SectionBox>

      <SectionBox ref={sectionRefs.price}>
        <h2>가격 및 할인 정보</h2>
        <p>
          기본 가격:{" "}
          {product.price
            ? product.price.toLocaleString() + "원"
            : "가격 정보 없음"}
        </p>
      </SectionBox>

      <SectionBox ref={sectionRefs.guide}>
        <h2>이용안내</h2>
        <p>
          상품 ID: {product.id} / {product.title} 이용 안내입니다.
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
