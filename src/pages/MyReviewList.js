// src/pages/mypage/MyReviewList.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackButton from "../Components/common/BackButton";

/* ───────── 스타일 컴포넌트 (화이트·블랙·보라 감성) ───────── */
const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 40px auto;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const EmptyBox = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  p {
    font-size: 15px;
    color: #64748b;
    margin: 0;
  }
`;

const ReviewListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s;

  &:hover {
    border-color: #c327eb; /* 마우스 올리면 포인트 보라색 테두리 */
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .product-title {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
    }

    .review-date {
      font-size: 12px;
      color: #94a3b8;
    }
  }

  .star-rating {
    font-size: 14px;

    .rating-number {
      margin-left: 6px;
      font-weight: 600;
      color: #64748b;
      font-size: 13px;
    }
  }

  .review-content {
    font-size: 14px;
    color: #334155;
    line-height: 1.5;
    margin: 0;
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
  }
`;

const MyReviewList = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  // 컴포넌트가 처음 렌더링될 때 localStorage에서 저장된 리뷰 데이터를 불러옴
  useEffect(() => {
    const savedReviews = localStorage.getItem("myReviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  return (
    <Container>
      {/* 상단 헤더 영역 (백버튼 + 정중앙 타이틀) */}
      <HeaderRow>
        <BackButton to="/mypage" />{" "}
        {/* 마이페이지로 안전하게 돌아가도록 설정 */}
        <Title>내가 쓴 리뷰 ({reviews.length})</Title>
      </HeaderRow>

      {/* 작성한 리뷰가 없을 때 보여줄 빈 화면 */}
      {reviews.length === 0 ? (
        <EmptyBox>
          <p>작성한 리뷰가 없어요</p>
        </EmptyBox>
      ) : (
        /* 작성한 리뷰가 있을 때 쭈르륵 보여주는 리스트 영역 */
        <ReviewListWrapper>
          {reviews.map((review, index) => (
            <ReviewCard key={index}>
              <div className="review-header">
                <span className="product-title">{review.productTitle}</span>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="star-rating">
                {"⭐".repeat(review.rating)}
                <span className="rating-number">({review.rating}/5)</span>
              </div>
              <p className="review-content">{review.content}</p>
            </ReviewCard>
          ))}
        </ReviewListWrapper>
      )}
    </Container>
  );
};

export default MyReviewList;
