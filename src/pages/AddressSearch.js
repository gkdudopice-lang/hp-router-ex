import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Input from "../Components/common/Input";
import Button from "../Components/common/Button"; // 공통 버튼 활용

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

  // 주소를 선택하거나 직접 입력해서 등록할 때 실행되는 함수
  const handleSelectAddress = (addressToRegister) => {
    if (!addressToRegister.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }
    navigate("/profile/address", {
      state: { selectedAddress: addressToRegister },
    });
  };

  return (
    <Container>
      <HeaderRow>
        <BackButton onClick={() => navigate("/profile/address")}>〈</BackButton>
        <h2>배송지 검색</h2>
      </HeaderRow>

      {/* 검색 입력창 */}
      <SearchBoxWrapper>
        <Input
          type="text"
          placeholder="예) 판교역로 166, 분당 주공, 백현동 532"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span onClick={() => handleSelectAddress(keyword)}>🔍</span>
      </SearchBoxWrapper>

      {/* 💡 직접 입력한 검색어로 바로 등록할 수 있는 버튼 추가 */}
      {keyword.trim() && (
        <Button enabled={true} onClick={() => handleSelectAddress(keyword)}>
          "{keyword}" (으)로 배송지 등록하기
        </Button>
      )}

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
    </Container>
  );
}
