import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";
import BackButton from "../Components/common/BackButton";

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

const AddressForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }

  input {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    box-sizing: border-box;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: #c327eb;
    }

    &:read-only {
      background: #f8fafc;
    }
  }
`;

const SearchButtonRow = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 0 14px;
    border: 1px solid #c327eb;
    border-radius: 8px;
    background: white;
    color: #c327eb;
    font-weight: 600;
    cursor: pointer;
  }

  input {
    flex: 1;
    min-width: 0;
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

export default function AddressSearch() {
  const navigate = useNavigate();

  // ⭐ 수정: 우편번호, 주소, 상세주소 상태
  const [postCode, setPostCode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  // ⭐ 수정: 다음 우편번호 검색 함수
  const handleSelectAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 API를 불러오지 못했습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let extraAddress = "";

        // 도로명 주소일 경우 참고 항목 추가
        if (data.addressType === "R") {
          if (data.bname) {
            extraAddress += data.bname;
          }

          if (data.buildingName) {
            extraAddress += extraAddress
              ? `, ${data.buildingName}`
              : data.buildingName;
          }
        }

        setPostCode(data.zonecode);

        setAddress(
          extraAddress ? `${data.address} (${extraAddress})` : data.address,
        );

        setDetailAddress("");
      },
    }).open();
  };

  // ⭐ 수정: 주소 초기화 함수
  const cancelAddress = () => {
    setPostCode("");
    setAddress("");
    setDetailAddress("");
  };

  // ⭐ 수정: 배송지 등록 함수
  const handleRegisterAddress = () => {
    if (!address) {
      alert("주소를 먼저 검색해주세요.");
      return;
    }

    const fullAddress = detailAddress.trim()
      ? `${address}, ${detailAddress.trim()}`
      : address;

    navigate("/profile/address", {
      state: { selectedAddress: fullAddress },
    });
  };

  return (
    <Container>
      <HeaderRow>
        <BackButton onClick={() => navigate("/profile/address")}>〈</BackButton>
        <h2>배송지 검색</h2>
      </HeaderRow>

      <AddressForm>
        {/* ⭐ 수정: 우편번호 */}
        <FormRow>
          <label>우편번호</label>

          <SearchButtonRow>
            <input
              type="text"
              value={postCode}
              placeholder="우편번호"
              readOnly
            />

            <button type="button" onClick={handleSelectAddress}>
              주소 검색
            </button>

            <button type="button" onClick={cancelAddress}>
              취소
            </button>
          </SearchButtonRow>
        </FormRow>

        {/* ⭐ 수정: 주소 */}
        <FormRow>
          <label>주소</label>
          <input
            type="text"
            value={address}
            placeholder="주소를 검색해주세요."
            readOnly
          />
        </FormRow>

        {/* ⭐ 수정: 상세주소 */}
        <FormRow>
          <label>상세주소</label>
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            maxLength={100}
            placeholder="상세주소를 입력해주세요."
          />
        </FormRow>
      </AddressForm>

      <TipBox>
        <h4>tip</h4>
        <p style={{ margin: "0 0 8px 0" }}>
          아래와 같은 조합으로 검색하시면 더욱 정확한 결과를 찾을 수 있습니다.
        </p>

        <ul>
          <li>
            <strong>도로명 + 건물번호</strong> (예: 판교역로 166)
          </li>
          <li>
            <strong>지역명(동/리) + 번지</strong> (예: 백현동 532)
          </li>
          <li>
            <strong>지역명(동/리) + 건물명</strong> (예: 분당 주공)
          </li>
        </ul>
      </TipBox>

      <Button enabled={Boolean(address)} onClick={handleRegisterAddress}>
        배송지 등록하기
      </Button>
    </Container>
  );
}
