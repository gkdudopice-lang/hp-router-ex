import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../Components/common/Input";

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
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
  margin-bottom: 10px;

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 auto;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  position: absolute;
  left: 0;

  &:hover {
    color: #000;
  }
`;

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #c327eb;
  border-radius: 12px;
  padding: 0 16px;
  background: white;
  box-shadow: 0 4px 10px rgba(195, 39, 235, 0.1);

  input {
    border: none !important;
    box-shadow: none !important;
  }

  span {
    cursor: pointer;
    font-size: 18px;
    padding-left: 8px;
  }
`;

const TipBox = styled.div`
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;

  h4 {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 14px;
  }

  ul {
    margin: 0;
    padding-left: 16px;
  }
`;

const ResultItem = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #c327eb;
    background-color: #f3e8ff;
  }
`;

export default function AddressSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  // 💡 주소 예시를 6개로 넉넉하게 확장!
  const dummyResults = [
    "서울 강남구 테헤란로 123 스파크타워 4층",
    "서울 서초구 서초대로 77길 55 에이프로스퀘어",
    "경기도 성남시 분당구 판교역로 166 카카오 판교오피스",
    "서울특별시 마포구 양화로 45 메세나폴리스",
    "부산광역시 해운대구 센텀중앙로 79 센텀사이언스파크",
    "인천광역시 연수구 송도과학로 32 송도테크노파크",
  ];

  const handleSelectAddress = (address) => {
    navigate("/profile/address", {
      state: { selectedAddress: address },
    });
  };

  return (
    <Container>
      <HeaderRow>
        <BackButton onClick={() => navigate("/profile/address")}>〈</BackButton>
        <h2>배송지 검색</h2>
      </HeaderRow>

      <SearchBoxWrapper>
        <Input
          type="text"
          placeholder="예) 판교역로 166, 분당 주공, 백현동 532"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span>🔍</span>
      </SearchBoxWrapper>

      <TipBox>
        <h4>tip</h4>
        <p style={{ margin: "0 0 8px 0" }}>
          아래와 같은 조합으로 검색을 하시면 더욱 정확한 결과가 검색됩니다.
        </p>
        <ul>
          <li>
            <strong>도로명 + 건물번호</strong> (예: 판교역로 166, 제주 첨단로
            242)
          </li>
          <li>
            <strong>지역명(동/리) + 번지</strong> (예: 백현동 532, 제주 영평동
            2181)
          </li>
          <li>
            <strong>지역명(동/리) + 건물명(아파트명)</strong> (예: 분당 주공,
            연수동 주공3차)
          </li>
        </ul>
      </TipBox>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          추천 주소 (클릭하여 선택)
        </p>
        {dummyResults
          .filter((item) => item.includes(keyword))
          .map((address, index) => (
            <ResultItem
              key={index}
              onClick={() => handleSelectAddress(address)}
            >
              📍 {address}
            </ResultItem>
          ))}
      </div>
    </Container>
  );
}
