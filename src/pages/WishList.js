import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

/* ───────── 스타일 컴포넌트 ───────── */
const Container = styled.div`
  max-width: 900px;
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

/* 상품 카드들을 3열로 예쁘게 배치하는 그리드 레이아웃 */
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 모바일선 2열
  }
`;

/* 개별 상품 카드 박스 (더블 클릭 이벤트 적용) */
const ProductCard = styled.div`
  position: relative; /* 우측 하단에 하트를 절대 위치(absolute)로 꽂기 위해 필요 */
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  height: 220px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none; /* 더블 클릭 시 글씨 드래그 방지 */
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    border-color: #c327eb; /* 마우스 올리면 보라색 테두리 */
    box-shadow: 0 6px 16px rgba(195, 39, 235, 0.1);
  }

  .thumb {
    width: 100%;
    height: 130px;
    background-color: #f1f5f9;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
  }

  .info {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }
`;

/* 카드 우측 하단에 쏙 들어가는 하트 아이콘 뱃지 */
const HeartBadge = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: #f3e8ff;
  color: #c327eb;
  border: 1px solid #c327eb;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px rgba(195, 39, 235, 0.2);
  animation: popUp 0.2s ease-in-out;

  @keyframes popUp {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

/* ───────── 메인 컴포넌트 ───────── */
export default function WishList() {
  const navigate = useNavigate();

  // 예시 상품 데이터 (요청하신 대로 4가지 예시안 준비)
  const [products, setProducts] = useState([
    { id: 1, title: "상품 1: 뮤지컬 엘리자벳", isLiked: true }, // 기본 찜 되어있는 상태 예시
    { id: 2, title: "상품 2: 가을 인디 콘서트", isLiked: false },
    { id: 3, title: "상품 3: 클래식 오케스트라", isLiked: true }, // 기본 찜 되어있는 상태 예시
    { id: 4, title: "상품 4: 세미나룸 대여", isLiked: false },
  ]);

  // 카드를 '더블 클릭'했을 때 실행되는 함수 (찜하기 토글)
  const handleDoubleClickCard = (id) => {
    setProducts(
      products.map((item) =>
        item.id === id ? { ...item, isLiked: !item.isLiked } : item,
      ),
    );
  };

  return (
    <Container>
      <PageTitle>찜 목록</PageTitle>
      <p
        style={{ fontSize: "14px", color: "#64748b", margin: "-5px 0 10px 0" }}
      >
        💡 원하시는 상품을 <strong>더블 클릭</strong>하시면 우측 하단에
        찜(하트)이 생성되거나 취소됩니다!
      </p>

      <GridContainer>
        {products.map((item) => (
          <ProductCard
            key={item.id}
            onDoubleClick={() => handleDoubleClickCard(item.id)}
            onClick={() => {
              // 싱글 클릭 시 해당 상품 상세 페이지로 이동하도록 연결 가능
              // navigate(`/reservation/detail/${item.id}`);
            }}
          >
            <div className="thumb">이미지 영역</div>
            <div className="info">{item.title}</div>

            {/* isLiked가 true일 때만 우측 하단에 하트 뱃지 표시 */}
            {item.isLiked && <HeartBadge>💜 찜함</HeartBadge>}
          </ProductCard>
        ))}
      </GridContainer>
    </Container>
  );
}
