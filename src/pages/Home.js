import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CustomCalendar from "../Components/common/CustomCalendar";

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 40px;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const ProductCard = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #777;
  }
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
`;

const FilterBox = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;

  h4 {
    margin: 0 0 5px 0;
    font-size: 15px;
    color: #333;
  }
`;

const KeywordButton = styled.button`
  padding: 10px;
  border: 1px solid #ddd;
  background-color: ${({ $active }) => ($active ? "#333" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #eee;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("전체 상품");

  // 필터 키워드 목록
  const keywords = ["인기 추천", "신규 등록", "오픈 예정", "마감 임박"];

  const handleCardClick = (id) => {
    navigate(`/reservation/${id}`);
  };

  // 캘린더에서 날짜를 선택했을 때 실행되는 함수
  const handleDateSelect = (formattedDate) => {
    console.log("홈 화면에서 받은 선택 날짜:", formattedDate);
    // 나중에 이 날짜를 백엔드로 보내서 해당 날짜 상품 목록을 불러오면 됩니다!
  };

  return (
    <ContentWrapper>
      {/* 상단 상품 카드 4개 영역 */}
      <TopSection>
        {[1, 2, 3, 4].map((item) => (
          <ProductCard key={item} onClick={() => handleCardClick(item)}>
            <h3>상품 {item}</h3>
            <p>상품 상세 설명 안내</p>
            <span
              style={{ fontSize: "12px", color: "purple", fontWeight: "bold" }}
            >
              예약하기 &gt;
            </span>
          </ProductCard>
        ))}
      </TopSection>

      {/* 하단 캘린더 및 필터 키워드 영역 */}
      <BottomSection>
        {/* 분리한 공통 캘린더 컴포넌트 장착 */}
        <CustomCalendar onDateSelect={handleDateSelect} />

        <FilterBox>
          <h4>필터 버튼 키워드</h4>
          {keywords.map((keyword, index) => (
            <KeywordButton
              key={index}
              $active={selectedFilter === keyword}
              onClick={() => setSelectedFilter(keyword)}
            >
              {keyword}
            </KeywordButton>
          ))}
        </FilterBox>
      </BottomSection>
    </ContentWrapper>
  );
};

export default Home;
