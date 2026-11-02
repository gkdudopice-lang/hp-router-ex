import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 15px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
`;

const ProductCard = styled.div`
  position: relative;
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
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    border-color: #c327eb;
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

/* 찜 취소를 명확하게 누를 수 있는 독립된 하트 버튼 */
const HeartButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: #f3e8ff;
  color: #c327eb;
  border: 1px solid #c327eb;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(195, 39, 235, 0.2);
  transition: transform 0.1s;

  &:active {
    transform: scale(0.95);
  }
`;

export default function WishList() {
  const navigate = useNavigate();

  // 초기 데이터를 localStorage에서 가져오거나 기본값 사용
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("wishlist_products");
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, title: "상품 1: 뮤지컬 엘리자벳", isLiked: true },
      { id: 2, title: "상품 2: 가을 인디 콘서트", isLiked: false },
      { id: 3, title: "상품 3: 클래식 오케스트라", isLiked: true },
      { id: 4, title: "상품 4: 세미나룸 대여", isLiked: false },
    ];
  });

  // 상태가 바뀔 때마다 localStorage에 저장하여 다른 페이지와 연동되도록 함
  useEffect(() => {
    localStorage.setItem("wishlist_products", JSON.stringify(products));
  }, [products]);

  // 하트 버튼을 눌렀을 때 찜 상태 토글 (이벤트 버블링 방지 포함)
  const handleToggleLike = (id, e) => {
    e.stopPropagation(); // 카드가 클릭되는 것(상세페이지 이동)을 막아줌
    setProducts(
      products.map((item) =>
        item.id === id ? { ...item, isLiked: !item.isLiked } : item,
      ),
    );
  };

  const likedProducts = products.filter((item) => item.isLiked);

  return (
    <Container>
      <PageTitle>찜 목록</PageTitle>
      <p
        style={{ fontSize: "14px", color: "#64748b", margin: "-5px 0 10px 0" }}
      >
        💡 상품을 누르시면 상세 페이지로 이동하며, 우측 하단의{" "}
        <strong>하트 버튼</strong>을 누르면 찜이 취소됩니다.
      </p>

      {likedProducts.length === 0 ? (
        <EmptyBox>
          <p>❤️ 찜한 상품이 없습니다.</p>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px" }}>
            마음에 드는 상품에 찜을 추가해 보세요!
          </p>
        </EmptyBox>
      ) : (
        <GridContainer>
          {likedProducts.map((item) => (
            <ProductCard
              key={item.id}
              onClick={() => navigate(`/reservation/detail/${item.id}`)}
            >
              <div className="thumb">이미지 영역</div>
              <div className="info">{item.title}</div>

              {/* 하트 버튼을 따로 두어 싱글/더블클릭 충돌을 원천 차단 */}
              <HeartButton onClick={(e) => handleToggleLike(item.id, e)}>
                💜 찜함
              </HeartButton>
            </ProductCard>
          ))}
        </GridContainer>
      )}
    </Container>
  );
}
