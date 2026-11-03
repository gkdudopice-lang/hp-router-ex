import React, { useState, useEffect, useRef } from "react";
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
  grid-column: 1 / -1;
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
    padding-right: 70px; /* 하트 버튼과 겹치지 않도록 오른쪽 여백 추가 */
    position: relative; /* 하트 버튼을 절대 위치로 배치하기 위해 부모 요소에 position 설정 */
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
  const [wishlistItems, setWishlistItems] = useState([]);

  const alertShown = useRef(false);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "TRUE" && !alertShown.current) {
      alertShown.current = true;
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 로그인된 사용자 아이디 가져오기
  const currentUserId = localStorage.getItem("userId") || "guest";
  const storageKey = `wishlist_${currentUserId}`;

  // 찜 목록 불러오기 함수
  const loadWishlist = () => {
    const savedWishlist = JSON.parse(localStorage.getItem(storageKey)) || [];
    setWishlistItems(savedWishlist);
  };

  useEffect(() => {
    loadWishlist();

    // 다른 탭이나 컴포넌트에서 로컬스토리지 변경 시 실시간 동기화
    const handleStorageChange = (e) => {
      if (e.key === storageKey) {
        loadWishlist();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  // 찜 목록에서 하트 버튼을 눌러 개별 취소할 때
  const handleRemoveWish = (id, e) => {
    e.stopPropagation();
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem(storageKey, JSON.stringify(updatedWishlist));

    // 커스텀 이벤트 발생시켜 동일 창 내의 ProductList에도 즉시 알림
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <Container>
      <PageTitle>찜 목록 ({currentUserId}님)</PageTitle>
      <p
        style={{ fontSize: "14px", color: "#64748b", margin: "-5px 0 10px 0" }}
      >
        💡 찜한 상품들입니다. 우측 하단의 <strong>하트 버튼</strong>을 누르면
        찜이 취소됩니다.
      </p>

      <GridContainer>
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <ProductCard
              key={item.id}
              onClick={() => navigate(`/reservation/detail/${item.id}`)}
            >
              <div className="thumb">상품 이미지</div>
              <div className="info-area">
                <div className="title">{item.title}</div>
                <div className="price">{item.price}</div>
              </div>

              <HeartButton onClick={(e) => handleRemoveWish(item.id, e)}>
                💜 찜함
              </HeartButton>
            </ProductCard>
          ))
        ) : (
          <EmptyBox>
            <p>❤️ 찜한 상품이 없습니다.</p>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px" }}>
              상품 전체 페이지에서 마음에 드는 상품을 클릭해 보세요!
            </p>
          </EmptyBox>
        )}
      </GridContainer>
    </Container>
  );
}
