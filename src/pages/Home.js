import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CustomCalendar from "../Components/common/CustomCalendar";
import { Link } from "react-router-dom";
import AxiosApi from "../api/AxiosApi";

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

const ProductSection = styled.div`
  position: relative;
  width: 100%;
  margin-top: 35px;
`;

const ViewAllLink = styled(Link)`
  position: absolute;
  top: -45px; /* 상품 카드들보다 위쪽 여백에 맞게 조절 */
  right: 0px; /* 오른쪽 끝에 딱 맞춤 */
  font-size: 14px;
  font-weight: 600;
  color: #475569; /* 진한 회색 */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #1e293b; /* 마우스 올렸을 때 조금 더 진한 색 */
    text-decoration: underline;
  }
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
  height: 180px; /* 이미지 공간을 고려해 높이 살짝 조정 */
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
    font-size: 15px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  const [concertList, setConcertList] = useState([]); // 백엔드에서 받아온 전체 콘서트 목록
  const [filteredProducts, setFilteredProducts] = useState([]); // 화면에 보여줄 상단 카드 4개
  const [selectedDate, setSelectedDate] = useState(""); // 캘린더에서 선택한 날짜
  const [selectedFilter, setSelectedFilter] = useState("인기 추천"); // 선택된 필터 키워드

  // 필터 키워드 목록
  const keywords = ["인기 추천", "신규 등록", "오픈 예정", "마감 임박"];

  // 1. 처음 페이지 켤 때 백엔드에서 전체 콘서트 데이터 가져오기
  useEffect(() => {
    const fetchHomeConcerts = async () => {
      try {
        const response = await AxiosApi.getAllConcerts();
        const data = Array.isArray(response.data) ? response.data : [];
        setConcertList(data);
        setFilteredProducts(data.slice(0, 4)); // 최초 4개 세팅
      } catch (error) {
        console.error("홈 화면 콘서트 목록 불러오기 실패:", error);
      }
    };
    fetchHomeConcerts();
  }, []);

  // 2. 날짜나 필터 버튼이 바뀔 때마다 상단 4개 상품 필터링 및 정렬
  useEffect(() => {
    if (concertList.length === 0) return;

    let result = [...concertList];

    // 날짜가 선택된 경우 (필요에 따라 필터 로직 확장 가능)
    if (selectedDate) {
      console.log("선택된 날짜 필터 적용:", selectedDate);
    }

    // 필터 키워드별 분기 처리
    if (selectedFilter === "인기 추천") {
      result = result.sort((a, b) => b.id - a.id); // 최신 등록순 등 예시 정렬
    } else if (selectedFilter === "신규 등록") {
      result = result.slice().reverse(); // 역순 정렬 예시
    } else if (selectedFilter === "마감 임박") {
      result = result.sort((a, b) => a.price - b.price); // 가격순 정렬 예시
    } else if (selectedFilter === "오픈 예정") {
      result = result.slice(5, 9); // 임의의 구간 슬라이스 예시
    }

    // 상단에는 항상 4개만 노출
    setFilteredProducts(result.slice(0, 4));
  }, [selectedDate, selectedFilter, concertList]);

  const handleCardClick = (id) => {
    navigate(`/reservation/detail/${id}`);
  };

  // 캘린더에서 날짜를 선택했을 때 실행되는 함수
  const handleDateSelect = (formattedDate) => {
    console.log("홈 화면에서 받은 선택 날짜:", formattedDate);
    setSelectedDate(formattedDate);
  };

  return (
    <ContentWrapper>
      <ProductSection>
        <ViewAllLink to="/concertlist">상품 전체보기 &gt;</ViewAllLink>

        {/* 상단 상품 카드 4개 영역 (백엔드 더미 데이터 연동) */}
        <TopSection>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((concert) => (
              <ProductCard
                key={concert.id}
                onClick={() => handleCardClick(concert.id)}
              >
                {/* 포스터 이미지 영역 */}
                <div
                  style={{
                    height: "70px",
                    background: "#f0f0f0",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  {concert.posterUrl ? (
                    <img
                      src={concert.posterUrl}
                      alt={concert.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#888",
                        fontSize: "11px",
                      }}
                    >
                      이미지 준비중
                    </div>
                  )}
                </div>
                <h3>{concert.title}</h3>
                <p>{concert.location || "공연장 정보 없음"}</p>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#c327eb",
                    fontWeight: "bold",
                  }}
                >
                  예약하기 &gt;
                </span>
              </ProductCard>
            ))
          ) : (
            <p>데이터를 불러오는 중입니다...</p>
          )}
        </TopSection>
      </ProductSection>

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
