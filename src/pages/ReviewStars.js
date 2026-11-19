import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button"; // 💡 공통 버튼 컴포넌트 재사용
import Star from "../img/star.png";
import yellowStar from "../img/yellostar.png";
import BackButton from "../Components/common/BackButton";
import AxiosApi from "../api/AxiosApi";

export default function ReviewStars() {
  const { id } = useParams(); // 어떤 상품에 대한 리뷰인지 상품 번호 받기
  const navigate = useNavigate();
  const location = useLocation();
  const productTitle = location.state?.productTitle || "상품";

  const [clicked, setClicked] = useState([false, false, false, false, false]);
  const [content, setContent] = useState("");

  const array = [0, 1, 2, 3, 4];
  const clickedStarNum = clicked.filter(Boolean).length;

  const starScore = (index) => {
    setClicked(clicked.map((_, i) => i <= index));
  };

  const handleSubmit = async () => {
    if (clickedStarNum === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    if (!content.trim()) {
      alert("리뷰 내용을 입력해 주세요.");
      return;
    }

    try {
      await AxiosApi.createReview(id, clickedStarNum, content);
      alert("리뷰가 성공적으로 등록되었습니다!");
      navigate("/mypage/reviews");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        alert("이미 작성하신 리뷰입니다.");
        navigate("/mypage/reviews");
        return;
      }

      console.error("리뷰 등록 실패:", error);
      alert(message || "리뷰 등록에 실패했습니다.");
    }
  };
  const handleCancel = () => {
    setClicked([false, false, false, false, false]);
    setContent("");
  };

  return (
    <ReviewContainer>
      <HeaderRow>
        <BackButton></BackButton>
        <Title>리뷰 작성하기 ({productTitle})</Title>
      </HeaderRow>
      <Label>별점 선택 (클릭하여 선택)</Label>

      <RatingRow>
        <StarsWrap>
          {array.map((index) => (
            <img
              key={index}
              onClick={() => starScore(index)}
              src={clicked[index] ? yellowStar : Star}
              alt={`${index + 1}점`}
              draggable="false"
            />
          ))}
        </StarsWrap>

        <StarNum>{clickedStarNum} / 5점</StarNum>
      </RatingRow>

      <ReviewInput
        placeholder="리뷰 내용을 작성해주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <ButtonRow>
        {/* 💡 공통 Button 컴포넌트로 대체하여 일관된 보라색 테마 적용 */}
        <div style={{ width: "100px" }}>
          <Button enabled={true} onClick={handleCancel}>
            취소
          </Button>
        </div>
        <div style={{ width: "120px" }}>
          <Button enabled={true} onClick={handleSubmit}>
            리뷰 등록
          </Button>
        </div>
      </ButtonRow>
    </ReviewContainer>
  );
}

/* ───────── 스타일 컴포넌트 ───────── */
const ReviewContainer = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 30px auto;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: 700;

  color: #1e293b;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

const StarsWrap = styled.div`
  display: flex;
  gap: 6px;

  img {
    width: 28px;
    height: 28px;
    cursor: pointer;
  }
`;

const StarNum = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #c327eb; // 💡 보라색 포인트 컬러 적용
`;

const ReviewInput = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  height: 120px;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: none;

  &:focus {
    outline: none;
    border-color: purple; // 💡 포커스 시 보라색 테두리
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;
