import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Button from "../Components/common/Button";

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

const AddressBox = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px 20px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  text-align: center;

  p {
    font-size: 15px;
    color: #64748b;
    margin: 0;
  }
`;

const AddressCard = styled.div`
  width: 100%;
  background: #ffffff;
  border: 2px solid ${({ $isDefault }) => ($isDefault ? "#c327eb" : "#e2e8f0")};
  border-radius: 16px;
  padding: 16px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;

  &:hover {
    border-color: #c327eb;
  }

  .info-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .tag {
      background-color: #f3e8ff;
      color: #c327eb;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      width: fit-content;
    }

    .address-text {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #ef4444;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export default function AddressManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const newAddress = location.state?.selectedAddress;

  // 배송지 목록 상태 (문자열 배열로 관리)
  const [addresses, setAddresses] = useState([]);

  // 검색 페이지에서 주소를 들고 돌아올 때 실행
  useEffect(() => {
    if (newAddress) {
      // 💡 이미 등록된 주소인지 체크 (중복 등록 방지)
      if (addresses.includes(newAddress)) {
        alert("이미 등록된 배송지입니다.");
        return;
      }

      if (addresses.length >= 10) {
        alert("배송지는 최대 10개까지만 등록할 수 있습니다.");
        return;
      }

      //새 주소 안전하게 추가
      setAddresses((prev) => [...prev, newAddress]);
    }
  }, [newAddress]);

  // 배송지 삭제 함수
  const handleDelete = (indexToDelete) => {
    setAddresses(addresses.filter((_, index) => index !== indexToDelete));
  };

  // 더블클릭 시 기본 배송지(맨 앞)로 변경하는 함수
  const handleSetDefault = (indexToSet) => {
    const targetAddress = addresses[indexToSet];
    const remainingAddresses = addresses.filter(
      (_, index) => index !== indexToSet,
    );
    setAddresses([targetAddress, ...remainingAddresses]);
    alert(`"${targetAddress}" (이)가 기본 배송지로 설정되었습니다.`);
  };

  return (
    <Container>
      <HeaderRow>
        <BackButton onClick={() => navigate("/profile")}>〈</BackButton>
        <h2>배송지 관리 ({addresses.length}/10)</h2>
      </HeaderRow>

      <p style={{ fontSize: "13px", color: "#64748b", margin: "-10px 0 0 0" }}>
        💡 카드를 <strong>더블 클릭</strong>하시면 해당 주소가{" "}
        <strong>기본 배송지</strong>로 변경됩니다!
      </p>

      {addresses.length === 0 ? (
        <AddressBox>
          <p>등록된 배송지가 없어요</p>
        </AddressBox>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {addresses.map((addr, index) => (
            <AddressCard
              key={`${addr}-${index}`} // 💡 고유한 key 값을 주어 2,3번 카드가 꼬이지 않도록 완벽 분리
              $isDefault={index === 0}
              onDoubleClick={() => handleSetDefault(index)}
            >
              <div className="info-wrap">
                {index === 0 && <span className="tag">기본 배송지</span>}
                <div className="address-text">{addr}</div>
              </div>
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(index);
                }}
              >
                삭제
              </DeleteButton>
            </AddressCard>
          ))}
        </div>
      )}

      {addresses.length < 10 ? (
        <Button enabled={true} onClick={() => navigate("/address/search")}>
          + 배송지 추가하기
        </Button>
      ) : (
        <p style={{ textAlign: "center", fontSize: "13px", color: "#ef4444" }}>
          배송지는 최대 10개까지 등록 가능합니다.
        </p>
      )}
    </Container>
  );
}
