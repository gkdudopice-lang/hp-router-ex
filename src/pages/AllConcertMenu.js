import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../Components/common/Input";

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

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const PageTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const FilterBox = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 400px;

  input {
    flex: 1;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductCard = styled.div`
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  height: 240px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    border-color: #c327eb;
    box-shadow: 0 6px 16px rgba(195, 39, 235, 0.1);
  }

  .thumb {
    width: 100%;
    height: 120px;
    background-color: #f1f5f9;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
  }

  .info-area {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price {
    font-size: 13px;
    font-weight: 600;
    color: #c327eb;
  }
`;

/* 찜 상태에 따라 스타일이 바뀌는 하트 버튼 */
const HeartButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: ${(props) => (props.$isLiked ? "#f3e8ff" : "#ffffff")};
  color: ${(props) => (props.$isLiked ? "#c327eb" : "#94a3b8")};
  border: 1px solid ${(props) => (props.$isLiked ? "#c327eb" : "#cbd5e1")};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.1s ease-in-out;

  &:hover {
    border-color: #c327eb;
    color: #c327eb;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NoResult = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #64748b;
  font-size: 15px;
  grid-column: 1 / -1;
`;

export default function AllConcertMenu() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const currentUserId = localStorage.getItem("userId") || "guest";
  const storageKey = `wishlist_${currentUserId}`;

  // 전체 상품 초기 데이터
  const [products, setProducts] = useState([
    { id: 1, title: "뮤지컬 엘리자벳", price: "140,000원", isLiked: false },
    { id: 2, title: "가을 인디 콘서트", price: "55,000원", isLiked: false },
    { id: 3, title: "클래식 오케스트라", price: "80,000원", isLiked: false },
    { id: 4, title: "세미나룸 대여", price: "20,000원", isLiked: false },
    { id: 5, title: "재즈 라이브 페스티벌", price: "66,000원", isLiked: false },
    { id: 6, title: "연극 보잉보잉", price: "40,000원", isLiked: false },
  ]);

  // 계정별 찜 상태 동기화 함수
  const syncWishlistState = () => {
    const savedWishlist = JSON.parse(localStorage.getItem(storageKey)) || [];
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        isLiked: savedWishlist.some((item) => item.id === product.id),
      })),
    );
  };

  useEffect(() => {
    syncWishlistState();

    const handleStorageChange = (e) => {
      if (e.key === storageKey || e.type === "wishlistUpdated") {
        syncWishlistState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wishlistUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wishlistUpdated", handleStorageChange);
    };
  }, [storageKey]);

  // 하트 버튼을 클릭했을 때 찜 상태(On/Off) 토글 및 계정별 로컬스토리지 저장
  const handleToggleLike = (id, e) => {
    e.stopPropagation(); // 카드 클릭(상세페이지 이동 등) 이벤트와 충돌 방지

    const updatedProducts = products.map((item) => {
      if (item.id === id) {
        return { ...item, isLiked: !item.isLiked };
      }
      return item;
    });

    setProducts(updatedProducts);

    const newWishlist = updatedProducts.filter((item) => item.isLiked);
    localStorage.setItem(storageKey, JSON.stringify(newWishlist));

    // 실시간 동기화 이벤트 발생
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container>
      <HeaderBox>
        <PageTitle>전체 상품 목록 ({currentUserId}님)</PageTitle>
        <FilterBox>
          <Input
            placeholder="상품명을 검색해보세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterBox>
      </HeaderBox>

      <p style={{ fontSize: "13px", color: "#64748b", margin: "-10px 0 0 0" }}>
        💡 우측 하단의 <strong>하트 버튼</strong>을 클릭하시면 찜이 설정되거나
        취소됩니다!
      </p>

      <GridContainer>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              onClick={() => {
                // 싱글 클릭 시 상세 페이지 이동 (필요시 경로 연결)
                // navigate(`/reservation/detail/${item.id}`);
              }}
            >
              <div className="thumb">상품 이미지</div>

              <div className="info-area">
                <div className="title">{item.title}</div>
                <div className="price">{item.price}</div>
              </div>

              {/* 하트 버튼 적용 (isLiked 값에 따라 색상/스타일 동적 변경) */}
              <HeartButton
                $isLiked={item.isLiked}
                onClick={(e) => handleToggleLike(item.id, e)}
              >
                {item.isLiked ? "💜 찜함" : "🤍 찜하기"}
              </HeartButton>
            </ProductCard>
          ))
        ) : (
          <NoResult>검색 결과가 없습니다.</NoResult>
        )}
      </GridContainer>
    </Container>
  );
}
