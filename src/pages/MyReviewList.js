// src/pages/mypage/MyReviewLihandleSubmitst.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BackButton from "../Components/common/BackButton";
import Button from "../Components/common/Button";
import AxiosApi from "../api/AxiosApi";

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

const ReviewTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #999;
  border-radius: 12px;
  resize: vertical;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #c327eb;
  }
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    width: 90px;
    height: 38px;
    border-radius: 10px;
    font-size: 13px;
  }
`;

const MyReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState("");

  // 컴포넌트가 처음 렌더링될 때 DB에서 내가 작성한 리뷰를 불러옴
  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const response = await AxiosApi.getMyReviews();

        const reviewList = response.data.map((item) => ({
          id: item.id,
          productTitle: item.productTitle,
          date: item.regDate ? item.regDate.split("T")[0] : "",
          rating: item.rating,
          content: item.content,
        }));

        setReviews(reviewList);
      } catch (error) {
        console.error("내 리뷰 조회 실패:", error);
        alert("리뷰 목록을 불러오지 못했습니다.");
      }
    };

    fetchMyReviews();
  }, []);

  // 리뷰 수정 시작
  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditContent(review.content);
  };

  // 리뷰 수정 저장
  const handleUpdate = async (reviewId) => {
    if (!editContent.trim()) {
      alert("리뷰 내용을 입력해 주세요.");
      return;
    }

    try {
      await AxiosApi.updateReview(reviewId, editRating, editContent);

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                rating: editRating,
                content: editContent,
              }
            : review,
        ),
      );

      setEditingId(null);
      alert("리뷰가 수정되었습니다.");
    } catch (error) {
      console.error("리뷰 수정 실패:", error);
      alert(error.response?.data?.message || "리뷰 수정에 실패했습니다.");
    }
  };

  // 리뷰 삭제
  const handleDelete = async (reviewId) => {
    if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await AxiosApi.deleteReview(reviewId);

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));

      alert("리뷰가 삭제되었습니다.");
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      alert(error.response?.data?.message || "리뷰 삭제에 실패했습니다.");
    }
  };

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
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <div className="review-header">
                <span className="product-title">{review.productTitle}</span>
                <span className="review-date">{review.date}</span>
              </div>

              {editingId === review.id ? (
                <>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <span
                        key={score}
                        onClick={() => setEditRating(score)}
                        style={{
                          cursor: "pointer",
                          opacity: score <= editRating ? 1 : 0.3,
                        }}
                      >
                        ⭐
                      </span>
                    ))}
                    <span className="rating-number">({editRating}/5)</span>
                  </div>

                  <ReviewTextArea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="리뷰 내용을 입력해 주세요."
                  />

                  <ReviewActions>
                    <Button enabled={true} onClick={() => setEditingId(null)}>
                      취소
                    </Button>

                    <Button
                      enabled={true}
                      onClick={() => handleUpdate(review.id)}
                    >
                      저장
                    </Button>
                  </ReviewActions>
                </>
              ) : (
                <>
                  <div className="star-rating">
                    {"⭐".repeat(review.rating)}
                    <span className="rating-number">({review.rating}/5)</span>
                  </div>

                  <p className="review-content">{review.content}</p>

                  <ReviewActions>
                    <Button enabled={true} onClick={() => handleEdit(review)}>
                      수정
                    </Button>

                    <Button
                      enabled={true}
                      onClick={() => handleDelete(review.id)}
                    >
                      삭제
                    </Button>
                  </ReviewActions>
                </>
              )}
            </ReviewCard>
          ))}
        </ReviewListWrapper>
      )}
    </Container>
  );
};

export default MyReviewList;
